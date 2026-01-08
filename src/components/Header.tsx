import React from 'react';
import { GhostIcon } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';

export function Header() {
  const { ancestor } = useChat();
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-10 shadow-sm">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GhostIcon className="h-5 w-5 text-purple-600" />
          <h1 className="text-lg font-serif font-medium text-purple-900">
            祖先聊天
          </h1>
        </div>
        <div className="flex items-center">
          <div className="rounded-full overflow-hidden w-8 h-8 border-2 border-purple-200">
            <img 
              src={ancestor.avatar} 
              alt={ancestor.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700">
            {ancestor.name}
          </span>
        </div>
      </div>
    </header>
  );
}