import React, { useState } from 'react';
import { Card, Radio, Button, Space, Form, Switch, InputNumber, Input, Divider, message } from 'antd';
import { DownloadOutlined, SettingOutlined, FileWordOutlined, FilePdfOutlined } from '@ant-design/icons';
import type { DocumentFormat, DocumentOptions, SubtitleEntry } from '../../types';
import { DEFAULT_DOCUMENT_OPTIONS } from '../../types/document';
import { generateWordDocument, downloadWordDocument } from '../../utils/generators/wordGenerator';

interface FormatOptionsProps {
  content: SubtitleEntry[];
  disabled?: boolean;
}

export const FormatOptions: React.FC<FormatOptionsProps> = ({ 
  content = [], 
  disabled = false 
}) => {
  const [selectedFormat, setSelectedFormat] = useState<DocumentFormat>('word');
  const [options, setOptions] = useState<DocumentOptions>(DEFAULT_DOCUMENT_OPTIONS);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // 处理选项变化
  const handleOptionsChange = (changedValues: Partial<DocumentOptions>) => {
    setOptions(prev => ({ ...prev, ...changedValues }));
  };

  // 生成并下载文档
  const handleGenerate = async () => {
    if (!content || content.length === 0) {
      message.warning('没有可生成的内容，请先上传并解析字幕文件');
      return;
    }

    setLoading(true);
    
    try {
      if (selectedFormat === 'word') {
        const result = await generateWordDocument(content, options);
        
        if (result.success && result.blob && result.filename) {
          downloadWordDocument(result.blob, result.filename);
          message.success('Word文档生成成功！');
        } else {
          message.error(result.error || 'Word文档生成失败');
        }
      } else {
        // PDF生成功能待实现
        message.info('PDF生成功能正在开发中...');
      }
    } catch (error) {
      message.error('文档生成过程中出现错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      title={
        <div className="flex items-center gap-2">
          <SettingOutlined />
          <span>导出设置</span>
        </div>
      }
      className="mb-6"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={options}
        onValuesChange={handleOptionsChange}
      >
        {/* 导出格式选择 */}
        <Form.Item label="导出格式">
          <Radio.Group 
            value={selectedFormat} 
            onChange={(e) => setSelectedFormat(e.target.value)}
            size="large"
          >
            <Radio.Button value="word" className="flex items-center gap-2">
              <FileWordOutlined className="text-blue-600" />
              Word 文档
            </Radio.Button>
            <Radio.Button value="pdf" className="flex items-center gap-2">
              <FilePdfOutlined className="text-red-600" />
              PDF 文档
            </Radio.Button>
          </Radio.Group>
        </Form.Item>

        {/* 文档设置 */}
        <Divider orientation="left">文档设置</Divider>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item name="title" label="文档标题">
            <Input placeholder="请输入文档标题" />
          </Form.Item>
          
          <Form.Item name="fontSize" label="字体大小">
            <InputNumber 
              min={8} 
              max={24} 
              addonAfter="pt"
              className="w-full"
            />
          </Form.Item>
          
          <Form.Item name="fontFamily" label="字体">
            <Input placeholder="字体名称，如：微软雅黑" />
          </Form.Item>
          
          <Form.Item name="lineSpacing" label="行距">
            <InputNumber 
              min={1} 
              max={3} 
              step={0.1}
              addonAfter="倍"
              className="w-full"
            />
          </Form.Item>
        </div>

        {/* 内容设置 */}
        <Divider orientation="left">内容设置</Divider>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item name="includeLineNumbers" valuePropName="checked">
            <Switch checkedChildren="显示行号" unCheckedChildren="隐藏行号" />
          </Form.Item>
          
          <Form.Item name="includeTimestamps" valuePropName="checked">
            <Switch checkedChildren="显示时间轴" unCheckedChildren="隐藏时间轴" />
          </Form.Item>
        </div>

        {/* 页面边距设置 */}
        <Divider orientation="left">页面边距 (pt)</Divider>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Form.Item name={['pageMargins', 'top']} label="上边距">
            <InputNumber min={0} max={144} className="w-full" />
          </Form.Item>
          
          <Form.Item name={['pageMargins', 'bottom']} label="下边距">
            <InputNumber min={0} max={144} className="w-full" />
          </Form.Item>
          
          <Form.Item name={['pageMargins', 'left']} label="左边距">
            <InputNumber min={0} max={144} className="w-full" />
          </Form.Item>
          
          <Form.Item name={['pageMargins', 'right']} label="右边距">
            <InputNumber min={0} max={144} className="w-full" />
          </Form.Item>
        </div>

        {/* 生成按钮 */}
        <Divider />
        
        <div className="flex justify-center">
          <Space>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              size="large"
              loading={loading}
              disabled={disabled || content.length === 0}
              onClick={handleGenerate}
            >
              生成并下载 {selectedFormat === 'word' ? 'Word' : 'PDF'} 文档
            </Button>
          </Space>
        </div>
        
        {content.length === 0 && (
          <div className="text-center text-gray-500 mt-4">
            请先上传并解析字幕文件
          </div>
        )}
      </Form>
    </Card>
  );
};