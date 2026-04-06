import type { SourceLocation } from "@/types";

const SOURCE_LOCATION_ATTRS = {
  startLine: "data-md-start-line",
  endLine: "data-md-end-line",
  startOffset: "data-md-start-offset",
  endOffset: "data-md-end-offset",
} as const satisfies Record<keyof SourceLocation, string>;

type SourceLocationKey = keyof SourceLocation;

interface SourceLookupPosition {
  offset?: number | null;
  line?: number | null;
}

function isNumber(value: number | undefined | null): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function parseNumericAttr(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function normalizeLocation(location: SourceLocation | null | undefined): SourceLocation | null {
  if (!location) return null;

  const next: SourceLocation = { ...location };

  if (isNumber(next.startLine) && isNumber(next.endLine) && next.startLine > next.endLine) {
    [next.startLine, next.endLine] = [next.endLine, next.startLine];
  }

  if (
    isNumber(next.startOffset) &&
    isNumber(next.endOffset) &&
    next.startOffset > next.endOffset
  ) {
    [next.startOffset, next.endOffset] = [next.endOffset, next.startOffset];
  }

  return Object.values(next).some(isNumber) ? next : null;
}

function getSpan(start?: number, end?: number): number {
  if (!isNumber(start) || !isNumber(end)) return Number.POSITIVE_INFINITY;
  return Math.abs(end - start) || 1;
}

function getRangeDistance(value: number, start?: number, end?: number): number {
  if (!isNumber(start) || !isNumber(end)) return Number.POSITIVE_INFINITY;
  const rangeStart = Math.min(start, end);
  const rangeEnd = Math.max(start, end);

  if (value < rangeStart) return rangeStart - value;
  if (value > rangeEnd) return value - rangeEnd;
  return 0;
}

function isWithinRange(value: number, start?: number, end?: number): boolean {
  if (!isNumber(start) || !isNumber(end)) return false;
  const rangeStart = Math.min(start, end);
  const rangeEnd = Math.max(start, end);
  return value >= rangeStart && value <= rangeEnd;
}

export function readSourceLocationFromElement(
  element: Element | null,
): SourceLocation | null {
  if (!element) return null;

  const location: SourceLocation = {};

  (Object.keys(SOURCE_LOCATION_ATTRS) as SourceLocationKey[]).forEach((key) => {
    const parsed = parseNumericAttr(element.getAttribute(SOURCE_LOCATION_ATTRS[key]));
    if (isNumber(parsed)) {
      location[key] = parsed;
    }
  });

  return normalizeLocation(location);
}

export function writeSourceLocationToElement(
  element: Element,
  location: SourceLocation | null | undefined,
): void {
  const normalized = normalizeLocation(location);

  (Object.keys(SOURCE_LOCATION_ATTRS) as SourceLocationKey[]).forEach((key) => {
    const attr = SOURCE_LOCATION_ATTRS[key];
    const value = normalized?.[key];

    if (isNumber(value)) {
      element.setAttribute(attr, String(value));
    } else {
      element.removeAttribute(attr);
    }
  });
}

export function mergeSourceLocations(
  locations: Array<SourceLocation | null | undefined>,
): SourceLocation | null {
  const normalized = locations
    .map((location) => normalizeLocation(location))
    .filter((location): location is SourceLocation => Boolean(location));

  if (normalized.length === 0) return null;

  const startLines = normalized
    .map((location) => location.startLine)
    .filter(isNumber);
  const endLines = normalized.map((location) => location.endLine).filter(isNumber);
  const startOffsets = normalized
    .map((location) => location.startOffset)
    .filter(isNumber);
  const endOffsets = normalized
    .map((location) => location.endOffset)
    .filter(isNumber);

  const merged: SourceLocation = {};

  if (startLines.length > 0) merged.startLine = Math.min(...startLines);
  if (endLines.length > 0) merged.endLine = Math.max(...endLines);
  if (startOffsets.length > 0) merged.startOffset = Math.min(...startOffsets);
  if (endOffsets.length > 0) merged.endOffset = Math.max(...endOffsets);

  return normalizeLocation(merged);
}

export function readSourceLocationFromNode(node: Node): SourceLocation | null {
  if (node.nodeType !== Node.ELEMENT_NODE) return null;

  const element = node as Element;
  const ownLocation = readSourceLocationFromElement(element);
  if (ownLocation) return ownLocation;

  const descendantLocations = Array.from(
    element.querySelectorAll<HTMLElement>(
      "[data-md-start-line], [data-md-start-offset]",
    ),
  ).map((descendant) => readSourceLocationFromElement(descendant));

  return mergeSourceLocations(descendantLocations);
}

export function readSourceLocationFromNodes(nodes: Node[]): SourceLocation | null {
  return mergeSourceLocations(nodes.map((node) => readSourceLocationFromNode(node)));
}

export function splitSourceLocation(
  location: SourceLocation | null | undefined,
  ratio: number,
): { first: SourceLocation | null; rest: SourceLocation | null } {
  const normalized = normalizeLocation(location);
  if (!normalized) {
    return { first: null, rest: null };
  }

  const clampedRatio = clamp(ratio, 0.01, 0.99);
  const first: SourceLocation = {};
  const rest: SourceLocation = {};

  if (isNumber(normalized.startLine) && isNumber(normalized.endLine)) {
    const totalLines = normalized.endLine - normalized.startLine + 1;
    if (totalLines <= 1) {
      first.startLine = normalized.startLine;
      first.endLine = normalized.endLine;
      rest.startLine = normalized.startLine;
      rest.endLine = normalized.endLine;
    } else {
      const firstLineCount = clamp(
        Math.round(totalLines * clampedRatio),
        1,
        totalLines - 1,
      );
      first.startLine = normalized.startLine;
      first.endLine = normalized.startLine + firstLineCount - 1;
      rest.startLine = first.endLine + 1;
      rest.endLine = normalized.endLine;
    }
  }

  if (isNumber(normalized.startOffset) && isNumber(normalized.endOffset)) {
    const totalSpan = normalized.endOffset - normalized.startOffset;
    if (totalSpan <= 1) {
      first.startOffset = normalized.startOffset;
      first.endOffset = normalized.endOffset;
      rest.startOffset = normalized.startOffset;
      rest.endOffset = normalized.endOffset;
    } else {
      const firstSpan = clamp(
        Math.round(totalSpan * clampedRatio),
        1,
        totalSpan - 1,
      );
      first.startOffset = normalized.startOffset;
      first.endOffset = normalized.startOffset + firstSpan;
      rest.startOffset = first.endOffset;
      rest.endOffset = normalized.endOffset;
    }
  }

  return {
    first: normalizeLocation(first),
    rest: normalizeLocation(rest),
  };
}

export function resolveSlideIndexBySourcePosition<T extends SourceLocation>(
  items: T[],
  position: SourceLookupPosition,
  fallbackIndex = 0,
): number {
  if (items.length === 0) return 0;

  const safeFallback = clamp(fallbackIndex, 0, items.length - 1);
  const offset = isNumber(position.offset) ? position.offset : undefined;
  const line = isNumber(position.line) ? position.line : undefined;

  if (!isNumber(offset) && !isNumber(line)) {
    return safeFallback;
  }

  const selectNearest = <
    Candidate extends { index: number; primary: number; secondary: number },
  >(
    candidates: Candidate[],
  ) =>
    candidates.sort((left, right) => {
      if (left.primary !== right.primary) return left.primary - right.primary;
      if (left.secondary !== right.secondary) return left.secondary - right.secondary;
      return Math.abs(left.index - safeFallback) - Math.abs(right.index - safeFallback);
    })[0]?.index;

  if (isNumber(offset)) {
    const offsetMatches = items
      .map((item, index) => ({
        index,
        primary: getSpan(item.startOffset, item.endOffset),
        secondary: getRangeDistance(offset, item.startOffset, item.endOffset),
      }))
      .filter(
        ({ index }) =>
          isWithinRange(offset, items[index]?.startOffset, items[index]?.endOffset),
      );

    const offsetMatch = selectNearest(offsetMatches);
    if (isNumber(offsetMatch)) return offsetMatch;
  }

  if (isNumber(line)) {
    const lineMatches = items
      .map((item, index) => ({
        index,
        primary: getSpan(item.startLine, item.endLine),
        secondary: getRangeDistance(line, item.startLine, item.endLine),
      }))
      .filter(
        ({ index }) =>
          isWithinRange(line, items[index]?.startLine, items[index]?.endLine),
      );

    const lineMatch = selectNearest(lineMatches);
    if (isNumber(lineMatch)) return lineMatch;
  }

  const proximityMatches = items
    .map((item, index) => ({
      index,
      primary: isNumber(offset)
        ? getRangeDistance(offset, item.startOffset, item.endOffset)
        : Number.POSITIVE_INFINITY,
      secondary: isNumber(line)
        ? getRangeDistance(line, item.startLine, item.endLine)
        : Number.POSITIVE_INFINITY,
    }))
    .filter(
      ({ primary, secondary }) =>
        Number.isFinite(primary) || Number.isFinite(secondary),
    );

  const proximityMatch = selectNearest(proximityMatches);
  return isNumber(proximityMatch) ? proximityMatch : safeFallback;
}
