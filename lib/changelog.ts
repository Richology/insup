/**
 * 更新日志数据
 */

export interface ChangelogEntry {
  date: string;
  title: string;
  items: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: '2026-04-05',
    title: 'InSup 基线迁移启动',
    items: [
      '完成新仓库与新品牌基线初始化',
      '替换站点元信息、README 与品牌文案',
      '移除旧品牌 Logo 与社区二维码资源引用',
      '为后续 PPT 横版模式预留产品定位',
    ],
  },
  {
    date: '2026-03-31',
    title: '主题系统全面升级',
    items: [
      '全新主题视觉设计，每个主题独具特色',
      '赤红：东方美学 + 宣纸纹理',
      '暗黑：极客美学 + 紫粉渐变光效',
      '新增更新日志时间轴功能',
    ],
  },
];

export const getLatestChangelog = (): ChangelogEntry => {
  return CHANGELOG[0];
};
