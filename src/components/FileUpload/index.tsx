import React, { useState, useCallback } from 'react';
import { Upload, message, Card } from 'antd';
import { InboxOutlined, FileTextOutlined } from '@ant-design/icons';
import type { UploadProps, UploadFile } from 'antd';
import type { SubtitleFormat, FileUploadResult } from '../../types';
import { APP_CONFIG, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants/config';

const { Dragger } = Upload;

interface FileUploadProps {
  onFileSelect: (result: FileUploadResult) => void;
  loading?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, loading = false }) => {
  const [uploadedFile, setUploadedFile] = useState<UploadFile | null>(null);

  // 获取文件格式
  const getFileFormat = (filename: string): SubtitleFormat | null => {
    const ext = filename.toLowerCase().split('.').pop();
    switch (ext) {
      case 'srt':
        return 'srt';
      case 'ass':
      case 'ssa':
        return 'ass';
      case 'sup':
        return 'sup';
      default:
        return null;
    }
  };

  // 验证文件
  const validateFile = (file: File): { valid: boolean; error?: string; format?: SubtitleFormat } => {
    // 检查文件大小
    if (file.size > APP_CONFIG.MAX_FILE_SIZE) {
      return { valid: false, error: ERROR_MESSAGES.FILE_TOO_LARGE };
    }

    // 检查文件格式
    const format = getFileFormat(file.name);
    if (!format) {
      return { valid: false, error: ERROR_MESSAGES.UNSUPPORTED_FORMAT };
    }

    return { valid: true, format };
  };

  // 处理文件上传前的验证
  const beforeUpload: UploadProps['beforeUpload'] = useCallback((file: File) => {
    const validation = validateFile(file);
    
    if (!validation.valid) {
      message.error(validation.error!);
      onFileSelect({
        success: false,
        error: validation.error
      });
      return false;
    }

    // 文件验证通过，设置上传的文件
    const uploadFile: UploadFile = {
      uid: file.name + Date.now(),
      name: file.name,
      status: 'done',
      originFileObj: file
    };
    
    setUploadedFile(uploadFile);
    message.success(SUCCESS_MESSAGES.UPLOAD_SUCCESS);
    
    onFileSelect({
      success: true,
      file,
      format: validation.format
    });

    return false; // 阻止自动上传
  }, [onFileSelect]);

  // 处理文件移除
  const handleRemove = useCallback(() => {
    setUploadedFile(null);
    onFileSelect({
      success: false,
      error: '文件已移除'
    });
  }, [onFileSelect]);

  // 拖拽相关的props
  const uploadProps: UploadProps = {
    name: 'subtitle-file',
    multiple: false,
    accept: '.srt,.ass,.ssa,.sup',
    beforeUpload,
    onRemove: handleRemove,
    fileList: uploadedFile ? [uploadedFile] : [],
    showUploadList: {
      showPreviewIcon: false,
      showRemoveIcon: !loading,
      showDownloadIcon: false
    }
  };

  return (
    <Card 
      title={
        <div className="flex items-center gap-2">
          <FileTextOutlined />
          <span>文件上传</span>
        </div>
      }
      className="mb-6"
    >
      <Dragger {...uploadProps} disabled={loading}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
        </p>
        <p className="ant-upload-text text-lg font-medium">
          点击或拖拽字幕文件到此区域
        </p>
        <p className="ant-upload-hint text-gray-500">
          支持 .srt、.ass、.ssa、.sup 格式文件，单个文件不超过 50MB
        </p>
        
        {uploadedFile && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileTextOutlined className="text-blue-500" />
                <span className="font-medium">{uploadedFile.name}</span>
              </div>
              <span className="text-xs text-gray-500">
                {uploadedFile.originFileObj ? 
                  `${(uploadedFile.originFileObj.size / 1024).toFixed(1)} KB` : 
                  ''}
              </span>
            </div>
          </div>
        )}
      </Dragger>
      
      <div className="mt-4 text-sm text-gray-600">
        <h4 className="font-medium mb-2">支持的格式说明：</h4>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>SRT</strong> - 最常见的字幕格式，包含序号、时间轴和文本</li>
          <li><strong>ASS/SSA</strong> - Advanced SubStation Alpha 格式，支持样式</li>
          <li><strong>SUP</strong> - 蓝光字幕格式，需要 OCR 识别（即将支持）</li>
        </ul>
      </div>
    </Card>
  );
};