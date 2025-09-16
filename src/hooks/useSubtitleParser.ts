import { useState, useCallback } from 'react';
import { message } from 'antd';
import type { ParseResult, ParseOptions, SubtitleFormat } from '../types';
import { parseSRT } from '../utils/parsers/srtParser';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/config';

export const useSubtitleParser = () => {
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  const parseFile = useCallback(async (
    file: File, 
    format: SubtitleFormat, 
    options: ParseOptions = {}
  ): Promise<ParseResult> => {
    setIsParsing(true);
    
    try {
      // 读取文件内容
      const content = await readFileContent(file);
      
      let result: ParseResult;
      
      // 根据格式选择解析器
      switch (format) {
        case 'srt':
          result = parseSRT(content, options);
          break;
        case 'ass':
          // ASS解析器待实现
          result = {
            success: false,
            content: [],
            lineCount: 0,
            originalFormat: format,
            error: 'ASS格式解析功能正在开发中'
          };
          break;
        case 'sup':
          // SUP解析器待实现  
          result = {
            success: false,
            content: [],
            lineCount: 0,
            originalFormat: format,
            error: 'SUP格式解析功能正在开发中'
          };
          break;
        default:
          result = {
            success: false,
            content: [],
            lineCount: 0,
            originalFormat: format,
            error: ERROR_MESSAGES.UNSUPPORTED_FORMAT
          };
      }
      
      setParseResult(result);
      
      if (result.success) {
        message.success(`${SUCCESS_MESSAGES.PARSE_SUCCESS}，共解析 ${result.lineCount} 条记录`);
      } else {
        message.error(result.error || ERROR_MESSAGES.PARSE_FAILED);
      }
      
      return result;
      
    } catch (error) {
      const errorResult: ParseResult = {
        success: false,
        content: [],
        lineCount: 0,
        originalFormat: format,
        error: error instanceof Error ? error.message : ERROR_MESSAGES.PARSE_FAILED
      };
      
      setParseResult(errorResult);
      message.error(errorResult.error);
      return errorResult;
      
    } finally {
      setIsParsing(false);
    }
  }, []);

  const resetParse = useCallback(() => {
    setParseResult(null);
    setIsParsing(false);
  }, []);

  return {
    parseResult,
    isParsing,
    parseFile,
    resetParse
  };
};

/**
 * 读取文件内容
 */
function readFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        resolve(content);
      } else {
        reject(new Error('文件读取失败'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('文件读取出错'));
    };
    
    // 尝试以UTF-8编码读取，如果失败再尝试其他编码
    reader.readAsText(file, 'utf-8');
  });
}