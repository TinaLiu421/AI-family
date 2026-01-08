import React, { useState } from 'react';
import { 
  HomeIcon, 
  CakeIcon, 
  CalendarIcon, 
  UtensilsCrossedIcon,
  MessageCircleIcon, 
  X
} from 'lucide-react';
import { Scene } from '../types';
import { useChat } from '../contexts/ChatContext';

const sceneIcons = {
  '家庭聚会': UtensilsCrossedIcon,
  '周末闲聊': MessageCircleIcon,
  '节日活动': CalendarIcon,
  '生日': CakeIcon,
  '正式对话': HomeIcon
};

export function SceneSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { scene, setScene } = useChat();
  
  return (
    <div className="fixed bottom-24 right-4 z-10">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg p-3 w-64 animate-fadeIn">
          <div className="flex justify-between items-center mb-2 pb-2 border-b">
            <h3 className="font-medium text-gray-800">Select a Scene</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          <div className="space-y-2">
            {Object.entries(sceneIcons).map(([sceneName, Icon]) => {
              const isActive = scene === sceneName;
              return (
                <button
                  key={sceneName}
                  onClick={() => {
                    setScene(sceneName as Scene);
                    setIsOpen(false);
                  }}
                  className={`flex items-center w-full px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-purple-100 text-purple-700'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Icon className={`h-4 w-4 mr-2 ${isActive ? 'text-purple-600' : 'text-gray-500'}`} />
                  <span>{sceneName}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-colors flex items-center justify-center"
          aria-label="Select Scene"
        >
          <HomeIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}