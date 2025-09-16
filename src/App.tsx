import React, { useEffect } from 'react';
import { Layout, Typography, Steps, message, ConfigProvider } from 'antd';
import { FileTextOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import zhCN from 'antd/locale/zh_CN';
import { FileUpload } from './components/FileUpload';
import { Preview } from './components/Preview';
import { FormatOptions } from './components/FormatOptions';
import { useFileUpload } from './hooks/useFileUpload';
import { useSubtitleParser } from './hooks/useSubtitleParser';
import type { ParseOptions } from './types';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

function App() {
  const { uploadResult, isUploading, handleFileSelect } = useFileUpload();
  const { parseResult, isParsing, parseFile } = useSubtitleParser();

  // 当文件上传成功后自动解析
  useEffect(() => {
    if (uploadResult?.success && uploadResult.file && uploadResult.format) {
      const options: ParseOptions = {
        removeSpeakerNames: false,
        mergeConsecutiveLines: true,
        removeEmptyLines: true,
        trimWhitespace: true
      };
      
      parseFile(uploadResult.file, uploadResult.format, options);
    }
  }, [uploadResult, parseFile]);

  // 计算当前步骤
  const getCurrentStep = () => {
    if (!uploadResult?.success) return 0;
    if (!parseResult?.success) return 1;
    return 2;
  };

  return (
    <ConfigProvider locale={zhCN}>
      <Layout className="min-h-screen bg-gray-50">
        <Header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <FileTextOutlined className="text-2xl text-blue-600" />
                <Title level={3} className="mb-0 text-gray-800">
                  Easy Subtitle
                </Title>
              </div>
              <div className="text-sm text-gray-500">
                字幕文件转换工具
              </div>
            </div>
          </div>
        </Header>

        <Content className="flex-1">
          <div className="max-w-6xl mx-auto px-4 py-8">
            {/* 页面标题和描述 */}
            <div className="text-center mb-8">
              <Title level={2} className="text-gray-800 mb-4">
                字幕文件转换工具
              </Title>
              <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
                支持将 SRT、ASS、SUP 字幕文件转换为 Word 或 PDF 文档，
                去除时间轴和格式信息，只保留纯净的台词内容。
              </Paragraph>
            </div>

            {/* 步骤指示器 */}
            <div className="mb-8">
              <Steps
                current={getCurrentStep()}
                items={[
                  {
                    title: '上传文件',
                    description: '选择字幕文件',
                    icon: <FileTextOutlined />
                  },
                  {
                    title: '解析预览',
                    description: '查看解析结果',
                    icon: <EyeOutlined />
                  },
                  {
                    title: '生成文档',
                    description: '导出Word/PDF',
                    icon: <DownloadOutlined />
                  }
                ]}
              />
            </div>

            {/* 主要内容区域 */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* 左侧：文件上传 */}
              <div className="xl:col-span-1">
                <FileUpload 
                  onFileSelect={handleFileSelect}
                  loading={isUploading || isParsing}
                />
              </div>

              {/* 右侧：预览和导出 */}
              <div className="xl:col-span-2 space-y-6">
                <Preview 
                  content={parseResult?.content || []}
                  loading={isParsing}
                  originalFormat={parseResult?.originalFormat}
                />
                
                <FormatOptions 
                  content={parseResult?.content || []}
                  disabled={!parseResult?.success}
                />
              </div>
            </div>

            {/* 功能特点说明 */}
            <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
              <Title level={4} className="text-center mb-6">
                功能特点
              </Title>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileTextOutlined className="text-blue-600 text-xl" />
                  </div>
                  <h5 className="font-medium mb-2">多格式支持</h5>
                  <p className="text-gray-600 text-sm">
                    支持 SRT、ASS、SUP 等常见字幕格式
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <EyeOutlined className="text-green-600 text-xl" />
                  </div>
                  <h5 className="font-medium mb-2">实时预览</h5>
                  <p className="text-gray-600 text-sm">
                    上传后立即预览解析结果，所见即所得
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <DownloadOutlined className="text-purple-600 text-xl" />
                  </div>
                  <h5 className="font-medium mb-2">纯净导出</h5>
                  <p className="text-gray-600 text-sm">
                    去除时间轴等冗余信息，只保留台词内容
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Content>

        <Footer className="bg-white border-t">
          <div className="max-w-6xl mx-auto px-4 py-6 text-center text-gray-500">
            <p>
              Easy Subtitle © 2024 - 简单易用的字幕转换工具
            </p>
          </div>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
