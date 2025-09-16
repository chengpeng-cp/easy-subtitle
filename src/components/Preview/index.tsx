import React from 'react';
import { Card, Empty, Divider, Tag, Typography } from 'antd';
import { EyeOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import type { SubtitleEntry } from '../../types';

const { Paragraph, Text } = Typography;

interface PreviewProps {
  content: SubtitleEntry[];
  loading?: boolean;
  originalFormat?: string;
}

export const Preview: React.FC<PreviewProps> = ({ 
  content = [], 
  loading = false, 
  originalFormat 
}) => {
  if (loading) {
    return (
      <Card 
        title={
          <div className="flex items-center gap-2">
            <EyeOutlined />
            <span>内容预览</span>
          </div>
        }
        loading={true}
        className="mb-6"
      >
        <div className="h-64" />
      </Card>
    );
  }

  if (!content || content.length === 0) {
    return (
      <Card 
        title={
          <div className="flex items-center gap-2">
            <EyeOutlined />
            <span>内容预览</span>
          </div>
        }
        className="mb-6"
      >
        <Empty 
          description="请先上传字幕文件"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <Card 
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EyeOutlined />
            <span>内容预览</span>
          </div>
          <div className="flex items-center gap-2">
            {originalFormat && (
              <Tag color="blue" className="uppercase">
                {originalFormat}
              </Tag>
            )}
            <Tag color="green">
              {content.length} 条记录
            </Tag>
          </div>
        </div>
      }
      className="mb-6"
    >
      <div className="max-h-96 overflow-y-auto">
        {content.map((entry, index) => (
          <div key={index} className="mb-4 last:mb-0">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
                {index + 1}
              </div>
              
              <div className="flex-1 min-w-0">
                {/* 时间信息 */}
                {(entry.startTime || entry.endTime) && (
                  <div className="flex items-center gap-2 mb-2">
                    <ClockCircleOutlined className="text-gray-400" />
                    <Text type="secondary" className="text-xs">
                      {entry.startTime && entry.endTime 
                        ? `${entry.startTime} → ${entry.endTime}`
                        : entry.startTime || entry.endTime
                      }
                    </Text>
                  </div>
                )}
                
                {/* 说话人信息 */}
                {entry.speaker && (
                  <div className="flex items-center gap-2 mb-2">
                    <UserOutlined className="text-gray-400" />
                    <Tag size="small" color="orange">
                      {entry.speaker}
                    </Tag>
                  </div>
                )}
                
                {/* 台词内容 */}
                <Paragraph 
                  className="mb-0 text-base leading-relaxed"
                  copyable={{ text: entry.text }}
                >
                  {entry.text}
                </Paragraph>
              </div>
            </div>
            
            {index < content.length - 1 && (
              <Divider className="my-4" />
            )}
          </div>
        ))}
      </div>
      
      {/* 统计信息 */}
      <Divider />
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>
          共 {content.length} 条台词记录
        </span>
        <span>
          总字数约 {content.reduce((total, entry) => total + entry.text.length, 0)} 字
        </span>
      </div>
    </Card>
  );
};