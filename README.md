# 字幕提取工具 easy-subtitle

一个简单易用的字幕文件转换工具，支持将常见的字幕格式转换为文档格式，方便阅读和整理台词内容。

## 功能特性

### 支持的输入格式
- **SRT文件** (.srt) - 最常见的字幕格式
- **ASS文件** (.ass/.ssa) - Advanced SubStation Alpha格式
- **SUP文件** (.sup) - 蓝光字幕格式

### 支持的输出格式
- **Word文档** (.docx) - 便于编辑和分享
- **PDF文件** (.pdf) - 便于阅读和打印

### 核心功能
- 📁 **文件上传**: 支持点击上传或拖拽上传
- 🧹 **内容清理**: 自动去除时间戳、样式标签等杂乱信息
- 👀 **实时预览**: 转换后立即显示解析内容预览
- 💾 **格式选择**: 可选择下载为Word或PDF格式
- 🎯 **纯净台词**: 只保留对话内容，去除无关信息

## 技术架构

> **架构决策**: 采用纯前端实现，无需后端服务器，提供更好的隐私保护和更快的响应速度。

### 纯前端实现
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI组件库**: Ant Design
- **样式方案**: Tailwind CSS
- **文件处理**: File API + FileReader
- **字幕解析**:
  - SRT: 自定义正则解析器
  - ASS: ass-parser 或自定义解析
  - SUP: tesseract.js (OCR识别)
- **文档生成**:
  - Word: docx库 (浏览器版本)
  - PDF: jsPDF + html2canvas
- **状态管理**: React Hooks (useState, useReducer)
- **文件下载**: URL.createObjectURL + download属性

## 项目结构

```
easy-subtitle/
├── src/
│   ├── components/          # React组件
│   │   ├── FileUpload/      # 文件上传组件
│   │   │   ├── index.tsx
│   │   │   └── style.module.css
│   │   ├── Preview/         # 内容预览组件
│   │   │   ├── index.tsx
│   │   │   └── style.module.css
│   │   ├── FormatOptions/   # 格式选项组件
│   │   │   └── index.tsx
│   │   └── Layout/          # 布局组件
│   │       └── index.tsx
│   ├── utils/               # 工具函数
│   │   ├── parsers/         # 字幕解析器
│   │   │   ├── srtParser.ts # SRT解析器
│   │   │   ├── assParser.ts # ASS解析器
│   │   │   └── supParser.ts # SUP解析器
│   │   ├── generators/      # 文档生成器
│   │   │   ├── wordGenerator.ts # Word文档生成
│   │   │   └── pdfGenerator.ts  # PDF文档生成
│   │   ├── fileUtils.ts     # 文件处理工具
│   │   └── textProcessor.ts # 文本处理工具
│   ├── types/               # TypeScript类型定义
│   │   ├── subtitle.ts      # 字幕相关类型
│   │   └── document.ts      # 文档相关类型
│   ├── hooks/               # 自定义Hooks
│   │   ├── useFileUpload.ts # 文件上传Hook
│   │   ├── useSubtitleParser.ts # 字幕解析Hook
│   │   └── useDocumentGenerator.ts # 文档生成Hook
│   ├── constants/           # 常量定义
│   │   └── formats.ts       # 支持的格式定义
│   ├── App.tsx              # 主应用组件
│   ├── App.css              # 全局样式
│   └── main.tsx             # 应用入口
├── public/                  # 静态资源
│   ├── index.html
│   └── favicon.ico
├── docs/                    # 项目文档
├── package.json
├── vite.config.ts           # Vite配置
├── tailwind.config.js       # Tailwind配置
├── tsconfig.json            # TypeScript配置
└── README.md
```

## 用户流程

### 主要使用步骤
1. **上传文件**: 用户点击上传按钮或直接拖拽字幕文件到上传区域
2. **文件验证**: 前端检查文件格式和大小是否符合要求
3. **本地解析**: 前端直接读取并解析字幕文件，提取纯台词内容
4. **实时预览**: 立即显示解析后的台词内容预览
5. **选择格式**: 用户选择要下载的文档格式(Word/PDF)
6. **本地生成**: 前端生成对应格式文档并自动下载

### 解析规则

#### SRT文件处理
- 去除序号(如: 1, 2, 3...)
- 去除时间戳(如: 00:00:01,000 --> 00:00:03,000)
- 保留纯台词内容
- 合并连续的同一说话人台词

#### ASS文件处理
- 去除样式标签(如: {\b1}, {\i1}等)
- 去除定位信息
- 去除特效标签
- 提取Dialogue行的文本内容

#### SUP文件处理
- OCR识别图像字幕
- 去除非文字内容
- 按时间轴排序

## 核心功能模块

### 文件处理模块
```typescript
// 文件上传和验证
interface FileUploadResult {
  success: boolean;
  file?: File;
  error?: string;
  format?: 'srt' | 'ass' | 'sup';
}

// 支持的文件类型
const SUPPORTED_FORMATS = {
  'srt': ['text/plain', '.srt'],
  'ass': ['text/plain', '.ass', '.ssa'],
  'sup': ['application/octet-stream', '.sup']
};
```

### 字幕解析模块
```typescript
// 解析结果接口
interface ParseResult {
  success: boolean;
  content: string[];
  lineCount: number;
  originalFormat: string;
  error?: string;
}

// 解析选项
interface ParseOptions {
  removeSpeakerNames?: boolean;
  mergeConsecutiveLines?: boolean;
  removeEmptyLines?: boolean;
  trimWhitespace?: boolean;
}
```

### 文档生成模块
```typescript
// 文档生成选项
interface DocumentOptions {
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
}

// 生成结果
interface GenerateResult {
  success: boolean;
  blob?: Blob;
  filename?: string;
  error?: string;
}
```

## 安装和运行

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 开发环境启动

```bash
# 克隆项目
git clone <repository-url>
cd easy-subtitle

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 应用将运行在 http://localhost:5173
```

### 生产环境部署

```bash
# 构建静态文件
npm run build

# 预览构建结果
npm run preview

# 部署到静态文件托管服务
# 如 Vercel, Netlify, GitHub Pages 等
```

## 配置选项

### 环境变量
```env
# 服务器配置
PORT=3001
NODE_ENV=production

# 文件上传配置
MAX_FILE_SIZE=50MB
UPLOAD_DIR=./uploads

# 文档生成配置
OUTPUT_DIR=./output
CLEANUP_INTERVAL=3600000  # 1小时清理临时文件
```

## 开发计划

### Phase 1: 基础功能 (MVP)
- [x] 项目初始化和架构设计
- [ ] 前端UI界面开发 (React + Ant Design)
- [ ] 文件上传组件 (拖拽支持)
- [ ] SRT文件解析功能
- [ ] Word文档生成功能 (docx库)
- [ ] 基础的文件下载功能

### Phase 2: 功能扩展
- [ ] ASS文件解析支持
- [ ] PDF文档生成功能 (jsPDF)
- [ ] 实时内容预览组件
- [ ] 解析选项配置界面
- [ ] 响应式设计优化

### Phase 3: 高级功能
- [ ] SUP文件OCR识别 (tesseract.js)
- [ ] 批量处理功能
- [ ] 自定义文档模板
- [ ] PWA支持 (离线使用)
- [ ] 多语言国际化
- [ ] 主题切换功能

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 联系方式

如有问题或建议，请提交 Issue 或联系开发者。

