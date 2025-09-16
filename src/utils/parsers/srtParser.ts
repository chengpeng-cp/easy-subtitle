import type { SubtitleEntry, ParseResult, ParseOptions } from '../../types';

/**
 * 解析SRT字幕文件内容
 * @param content - SRT文件的文本内容
 * @param options - 解析选项
 * @returns 解析结果
 */
export function parseSRT(content: string, options: ParseOptions = {}): ParseResult {
  try {
    const {
      removeSpeakerNames = false,
      mergeConsecutiveLines = true,
      removeEmptyLines = true,
      trimWhitespace = true
    } = options;

    // 清理内容，去除BOM和规范化换行符
    const cleanContent = content.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // 按双换行符分割字幕块
    const blocks = cleanContent.split(/\n\s*\n/).filter(block => block.trim());
    
    const entries: SubtitleEntry[] = [];

    for (const block of blocks) {
      const lines = block.split('\n').map(line => line.trim()).filter(line => line);
      
      if (lines.length < 3) continue; // SRT格式至少需要3行：序号、时间、内容
      
      const indexLine = lines[0];
      const timeLine = lines[1];
      const textLines = lines.slice(2);
      
      // 验证序号行
      if (!/^\d+$/.test(indexLine)) continue;
      
      // 验证时间行格式：00:00:01,000 --> 00:00:03,000
      const timeMatch = timeLine.match(/^(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})$/);
      if (!timeMatch) continue;
      
      const [, startTime, endTime] = timeMatch;
      
      // 处理文本内容
      let text = textLines.join(' ');
      
      if (trimWhitespace) {
        text = text.trim();
      }
      
      if (removeEmptyLines && !text) {
        continue;
      }
      
      // 去除说话人标识（如：张三：你好）
      let speaker: string | undefined;
      if (removeSpeakerNames) {
        const speakerMatch = text.match(/^([^：:]+)[：:]\s*(.*)$/);
        if (speakerMatch) {
          speaker = speakerMatch[1].trim();
          text = speakerMatch[2].trim();
        }
      }
      
      entries.push({
        index: parseInt(indexLine, 10),
        startTime,
        endTime,
        text,
        speaker
      });
    }
    
    // 合并连续的同一说话人台词
    let finalEntries = entries;
    if (mergeConsecutiveLines) {
      finalEntries = mergeConsecutiveEntries(entries);
    }
    
    return {
      success: true,
      content: finalEntries,
      lineCount: finalEntries.length,
      originalFormat: 'srt'
    };
    
  } catch (error) {
    return {
      success: false,
      content: [],
      lineCount: 0,
      originalFormat: 'srt',
      error: error instanceof Error ? error.message : '解析失败'
    };
  }
}

/**
 * 合并连续的同一说话人台词
 */
function mergeConsecutiveEntries(entries: SubtitleEntry[]): SubtitleEntry[] {
  if (entries.length === 0) return entries;
  
  const merged: SubtitleEntry[] = [];
  let current = { ...entries[0] };
  
  for (let i = 1; i < entries.length; i++) {
    const next = entries[i];
    
    // 如果是同一说话人且时间连续，则合并
    if (current.speaker === next.speaker && 
        shouldMergeEntries(current, next)) {
      current.text += ' ' + next.text;
      current.endTime = next.endTime;
    } else {
      merged.push(current);
      current = { ...next };
    }
  }
  
  merged.push(current);
  return merged;
}

/**
 * 判断两个字幕条目是否应该合并
 */
function shouldMergeEntries(current: SubtitleEntry, next: SubtitleEntry): boolean {
  if (!current.endTime || !next.startTime) return false;
  
  // 将时间转换为毫秒进行比较
  const currentEnd = timeToMs(current.endTime);
  const nextStart = timeToMs(next.startTime);
  
  // 如果间隔小于2秒，认为是连续的
  return (nextStart - currentEnd) < 2000;
}

/**
 * 将SRT时间格式转换为毫秒
 * 格式：00:00:01,000
 */
function timeToMs(timeStr: string): number {
  const parts = timeStr.split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const seconds = parseFloat(parts[2].replace(',', '.'));
  
  return (hours * 3600 + minutes * 60 + seconds) * 1000;
}