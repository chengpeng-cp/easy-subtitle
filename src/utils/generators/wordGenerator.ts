import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import type { SubtitleEntry, DocumentOptions, GenerateResult } from '../../types';
import { DEFAULT_DOCUMENT_OPTIONS } from '../../types/document';

/**
 * 生成Word文档
 * @param content - 字幕内容数组
 * @param options - 文档生成选项
 * @returns 生成结果
 */
export async function generateWordDocument(
  content: SubtitleEntry[],
  options: Partial<DocumentOptions> = {}
): Promise<GenerateResult> {
  try {
    const opts = { ...DEFAULT_DOCUMENT_OPTIONS, ...options };
    
    if (!content || content.length === 0) {
      return {
        success: false,
        error: '没有可生成的内容'
      };
    }

    // 创建文档段落
    const paragraphs: Paragraph[] = [];
    
    // 添加标题
    if (opts.title) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: opts.title,
              bold: true,
              size: Math.round((opts.fontSize! + 4) * 2) // Word中字体大小为半角字符
            })
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: {
            after: 240 // 12pt
          }
        })
      );
    }
    
    // 添加内容段落
    content.forEach((entry, index) => {
      const children: TextRun[] = [];
      
      // 添加行号（如果需要）
      if (opts.includeLineNumbers) {
        children.push(
          new TextRun({
            text: `${index + 1}. `,
            bold: true,
            color: '666666'
          })
        );
      }
      
      // 添加时间戳（如果需要）
      if (opts.includeTimestamps && entry.startTime && entry.endTime) {
        children.push(
          new TextRun({
            text: `[${entry.startTime} --> ${entry.endTime}] `,
            italics: true,
            color: '999999',
            size: Math.round((opts.fontSize! - 2) * 2)
          })
        );
      }
      
      // 添加说话人（如果有）
      if (entry.speaker) {
        children.push(
          new TextRun({
            text: `${entry.speaker}：`,
            bold: true,
            color: '333333'
          })
        );
      }
      
      // 添加台词内容
      children.push(
        new TextRun({
          text: entry.text,
          size: Math.round(opts.fontSize! * 2)
        })
      );
      
      paragraphs.push(
        new Paragraph({
          children,
          spacing: {
            line: Math.round(opts.lineSpacing! * 240), // 行距
            after: 120 // 段后间距
          }
        })
      );
    });
    
    // 创建文档
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: opts.pageMargins!.top * 20, // 转换为twips
              bottom: opts.pageMargins!.bottom * 20,
              left: opts.pageMargins!.left * 20,
              right: opts.pageMargins!.right * 20
            }
          }
        },
        children: paragraphs
      }]
    });
    
    // 生成文档blob
    const blob = await Packer.toBlob(doc);
    
    // 生成文件名
    const timestamp = new Date().toISOString().slice(0, 16).replace(/[:\-T]/g, '');
    const filename = `${opts.title || '字幕内容'}_${timestamp}.docx`;
    
    return {
      success: true,
      blob,
      filename
    };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Word文档生成失败'
    };
  }
}

/**
 * 下载生成的Word文档
 * @param blob - 文档blob
 * @param filename - 文件名
 */
export function downloadWordDocument(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}