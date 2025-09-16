// 字幕相关类型定义

export type SubtitleFormat = 'srt' | 'ass' | 'sup';

export interface SubtitleEntry {
  index?: number;
  startTime?: string;
  endTime?: string;
  text: string;
  speaker?: string;
}

export interface ParseResult {
  success: boolean;
  content: SubtitleEntry[];
  lineCount: number;
  originalFormat: SubtitleFormat;
  error?: string;
}

export interface ParseOptions {
  removeSpeakerNames?: boolean;
  mergeConsecutiveLines?: boolean;
  removeEmptyLines?: boolean;
  trimWhitespace?: boolean;
}

export interface FileUploadResult {
  success: boolean;
  file?: File;
  error?: string;
  format?: SubtitleFormat;
}

export const SUPPORTED_FORMATS: Record<SubtitleFormat, string[]> = {
  'srt': ['.srt'],
  'ass': ['.ass', '.ssa'],
  'sup': ['.sup']
};

export const SUPPORTED_MIME_TYPES = [
  'text/plain',
  'application/octet-stream',
  'text/x-subrip'
];