// 文档生成相关类型定义

export type DocumentFormat = 'word' | 'pdf';

export interface DocumentOptions {
  title?: string;
  fontSize?: number;
  fontFamily?: string;
  lineSpacing?: number;
  pageMargins?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  includeLineNumbers?: boolean;
  includeTimestamps?: boolean;
}

export interface GenerateResult {
  success: boolean;
  blob?: Blob;
  filename?: string;
  error?: string;
}

export const DEFAULT_DOCUMENT_OPTIONS: DocumentOptions = {
  title: '字幕内容',
  fontSize: 12,
  fontFamily: '微软雅黑',
  lineSpacing: 1.5,
  pageMargins: {
    top: 72,
    bottom: 72,
    left: 72,
    right: 72
  },
  includeLineNumbers: false,
  includeTimestamps: false
};