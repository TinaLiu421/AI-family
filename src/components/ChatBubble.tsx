import React from 'react';
import { Message } from '../types';
import { formatMessageTime } from '../utils/timeUtils';

interface ChatBubbleProps {
  message: Message;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isAncestor = message.sender === '祖先';
  
  return (
    <div 
      className={`flex ${isAncestor ? 'justify-start' : 'justify-end'} mb-4`}
      data-testid={`message-${message.id}`}
    >
      <div className="flex flex-col max-w-[75%]">
        <div 
          className={`px-4 py-3 rounded-2xl break-words ${
            isAncestor 
              ? 'bg-purple-50 text-purple-900 font-serif rounded-tl-none' 
              : 'bg-indigo-600 text-white rounded-tr-none'
          }`}
        >
          <p className={`text-sm sm:text-base ${isAncestor ? 'leading-relaxed' : 'leading-relaxed'}`}>
            {message.text}
          </p>
        </div>
        <span 
          className={`text-xs italic text-gray-500 mt-1 ${
            isAncestor ? 'self-start ml-1' : 'self-end mr-1'
          }`}
        >
          {formatMessageTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}