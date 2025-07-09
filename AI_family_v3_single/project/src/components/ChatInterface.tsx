import React, { useRef, useEffect, useState } from 'react';
import { useChat } from '../contexts/ChatContext';
import { ChatBubble } from './ChatBubble';
import { InputBox } from './InputBox';

export function ChatInterface() {
  const { messages, ancestor, isTyping, currentTopicHint, currentInput } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showTopicHint, setShowTopicHint] = useState(false);
  
  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentInput]);
  
  // 控制话题提示的显示状态
  useEffect(() => {
    if (currentTopicHint) {
      setShowTopicHint(true);
      
      const timeout = setTimeout(() => {
        setShowTopicHint(false);
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [currentTopicHint]);

  // 监听滚动位置，确保提示始终可见
  useEffect(() => {
    const handleScroll = () => {
      // 检查是否需要执行某些滚动相关的逻辑
    };
    
    chatContainerRef.current?.addEventListener('scroll', handleScroll);
    return () => {
      chatContainerRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* 祖先资料头部 */}
      <div className="flex items-center p-4 border-b bg-purple-50">
        <div className="relative">
          <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-purple-200">
            <img 
              src={ancestor.avatar} 
              alt={ancestor.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        <div className="ml-3">
          <h2 className="text-lg font-serif font-medium text-purple-900">{ancestor.name}</h2>
          <p className="text-sm text-gray-600">{ancestor.relationship}</p>
        </div>
      </div>
      
      {/* 聊天消息区域 */}
      <div ref={chatContainerRef} className="flex-grow px-4 py-6 overflow-y-auto bg-gradient-to-b from-purple-50/50 to-white relative">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* 聊天消息 */}
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}

          {/* 当前输入内容 */}
          {currentInput && (
            <div className="text-gray-500 italic">{currentInput}</div>
          )}

          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="bg-purple-50 px-4 py-3 rounded-2xl rounded-tl-none">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* 话题提示 - 固定在输入框上方 */}
      {showTopicHint && currentTopicHint && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-100 text-gray-600 px-4 py-2 rounded shadow-md z-10 max-w-md w-full text-center">
          {currentTopicHint}
        </div>
      )}
      
      {/* 输入区域 */}
      <InputBox />
    </div>
  );
}    