import React from 'react';
import { ChatProvider } from './contexts/ChatContext';
import { Header } from './components/Header';
import { ChatInterface } from './components/ChatInterface';
import { SceneSelector } from './components/SceneSelector';
import { TopicSelector } from './components/TopicSelector';

function App() {
  console.log('App component rendered');
  return (
    <ChatProvider>
      <div className="min-h-screen flex flex-col bg-white text-gray-900">
        <Header />
        <main className="pt-14 flex-grow flex flex-col h-[calc(100vh-3.5rem)]">
          <ChatInterface />
        </main>
        <SceneSelector />
        <TopicSelector />
      </div>
    </ChatProvider>
  );
}

export default App;