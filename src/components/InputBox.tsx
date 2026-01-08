import React, { useState, useRef, useEffect } from 'react';
import { SendIcon } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';

export function InputBox() {
  const [text, setText] = useState('');
  const { sendMessage, isTyping, waitingForReply } = useChat();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 自动聚焦输入框
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // 自动调整文本框高度
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [text]);

  // 处理消息发送
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isTyping && !waitingForReply) {
      sendMessage(text); // 发送消息到缓冲区
      setText(''); // 清空输入框
    }
  };

  // 监听键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 阻止默认换行行为
      handleSubmit(e as unknown as React.FormEvent); // 调用发送逻辑
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-white border-t p-3 sticky bottom-0 left-0 right-0"
    >
      <div className="relative max-w-3xl mx-auto">
        <div className="flex items-end border rounded-lg focus-within:ring-2 focus-within:ring-purple-300 bg-white overflow-hidden pr-2">
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown} // 添加键盘事件监听
            placeholder="输入消息..."
            className="flex-grow px-4 py-3 focus:outline-none resize-none max-h-[120px] min-h-[46px]"
            rows={1}
            disabled={isTyping || waitingForReply}
          />
          <button 
            type="submit" 
            className={`p-2 rounded-full ${
              text.trim() && !isTyping && !waitingForReply
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            } transition-colors duration-200`}
            disabled={!text.trim() || isTyping || waitingForReply}
          >
            <SendIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </form>
  );
}