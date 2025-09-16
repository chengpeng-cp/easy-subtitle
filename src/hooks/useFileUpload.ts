import { useState, useCallback } from 'react';
import type { FileUploadResult, SubtitleFormat } from '../types';

export const useFileUpload = () => {
  const [uploadResult, setUploadResult] = useState<FileUploadResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = useCallback((result: FileUploadResult) => {
    setIsUploading(false);
    setUploadResult(result);
  }, []);

  const resetUpload = useCallback(() => {
    setUploadResult(null);
    setIsUploading(false);
  }, []);

  const startUpload = useCallback(() => {
    setIsUploading(true);
  }, []);

  return {
    uploadResult,
    isUploading,
    handleFileSelect,
    resetUpload,
    startUpload
  };
};