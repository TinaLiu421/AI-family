import React, { useState } from 'react';
import { 
  CloudIcon, 
  BriefcaseIcon, 
  HeartIcon, 
  LandmarkIcon,
  ComputerIcon, 
  UsersIcon,
  X
} from 'lucide-react';
import { Topic } from '../types';
import { useChat } from '../contexts/ChatContext';

// 将 topic 名称映射为中文
const topicIcons = {
  '气候变化': CloudIcon,
  '职场文化': BriefcaseIcon,
  '浪漫关系': HeartIcon,
  '政治局势': LandmarkIcon,
  '科技': ComputerIcon,
  '家庭关系': UsersIcon
};

// 英文 topic 与中文 topic 的映射
const topicMap: Record<string, string> = {
  'Climate Change': '气候变化',
  'Workplace Culture': '职场文化',
  'Romantic Relationships': '浪漫关系',
  'Political Situation': '政治局势',
  'Technology': '科技',
  'Family Relationships': '家庭关系',
};

export function TopicSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { topic, setTopic } = useChat();

  // 将当前 topic 转换为中文
  const translatedTopic = topic ? topicMap[topic] : null;

  return (
    <div className="fixed bottom-24 left-4 z-10">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg p-3 w-64 animate-fadeIn">
          <div className="flex justify-between items-center mb-2 pb-2 border-b">
            <h3 className="font-medium text-gray-800">选择话题</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          <div className="space-y-2">
            {Object.entries(topicIcons).map(([topicName, Icon]) => {
              const isActive = translatedTopic === topicName;
              return (
                <button
                  key={topicName}
                  onClick={() => {
                    setTopic(topicName as Topic); // 直接存储中文话题
                    setIsOpen(false);
                  }}
                  className={`flex items-center w-full px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-teal-100 text-teal-700'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Icon className={`h-4 w-4 mr-2 ${isActive ? 'text-teal-600' : 'text-gray-500'}`} />
                  <span>{topicName}</span>
                </button>
              );
            })}
            <div className="border-t pt-2 mt-2">
              <button
                onClick={() => {
                  setTopic(null);
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
              >
                <X className="h-4 w-4 mr-2 text-gray-500" />
                <span>清除话题</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-full shadow-lg transition-colors flex items-center justify-center"
          aria-label="选择话题"
        >
          <BriefcaseIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}