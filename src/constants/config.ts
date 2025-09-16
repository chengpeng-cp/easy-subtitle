// 应用配置常量

export const APP_CONFIG = {
  // 文件上传限制
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  SUPPORTED_FORMATS: ['srt', 'ass', 'sup'] as const,
  
  // 解析配置
  PARSE_OPTIONS: {
    defaultRemoveSpeakerNames: false,
    defaultMergeLines: true,
    maxLines: 10000
  },
  
  // 文档生成配置
  DOCUMENT_OPTIONS: {
    defaultFontSize: 12,
    defaultFontFamily: '微软雅黑',
    defaultLineSpacing: 1.5,
    maxContentLength: 1000000
  },

  // UI配置
  UI: {
    uploadAreaHeight: 200,
    previewMaxHeight: 400,
    animationDuration: 300
  }
};

export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: '文件大小超过限制(50MB)',
  UNSUPPORTED_FORMAT: '不支持的文件格式',
  PARSE_FAILED: '文件解析失败',
  GENERATE_FAILED: '文档生成失败',
  NO_CONTENT: '没有可处理的内容'
};

export const SUCCESS_MESSAGES = {
  UPLOAD_SUCCESS: '文件上传成功',
  PARSE_SUCCESS: '文件解析成功',
  GENERATE_SUCCESS: '文档生成成功'
};