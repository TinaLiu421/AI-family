import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Ancestor, Message, Scene, Topic } from '../types';
import { segmentMessage, generateMessageId } from '../utils/messageUtils';
import { sendMessageToBackend } from '../utils/api'; // 引入后端 API 调用函数

// Sample ancestor data
const defaultAncestor: Ancestor = {
  id: '1',
  name: '你奶奶',
  avatar: 'https://images.pexels.com/photos/2050994/pexels-photo-2050994.jpeg',
  relationship: '奶奶',
  description: '你的奶奶，她很关心你。',
};

interface ChatContextType {
  messages: Message[];
  isTyping: boolean;
  sendMessage: (text: string) => void;
  ancestor: Ancestor;
  scene: Scene;
  setScene: (scene: Scene) => void;
  topic: Topic | null;
  setTopic: (topic: Topic | null) => void;
  waitingForReply: boolean;
  currentTopicHint: string | null;
  currentInput: string; // 添加 currentInput
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [ancestor] = useState<Ancestor>(defaultAncestor);
  const [scene, setScene] = useState<Scene>('日常对话');
  const [topic, setTopic] = useState<Topic | null>(null);
  const [waitingForReply, setWaitingForReply] = useState(false);
  const [currentTopicHint, setCurrentTopicHint] = useState<string | null>(null);
  const [currentInput, setCurrentInput] = useState<string>(''); // 当前输入的内容
  const [inputBuffer, setInputBuffer] = useState<string[]>([]); // 消息缓冲区
  const inputBufferRef = useRef<string[]>([]); // 用于存储最新的缓冲区内容
  const inputTimerRef = useRef<NodeJS.Timeout | null>(null); // 定时器引用
  const hasGreetedRef = useRef(false); // 使用 ref 避免重新渲染
  const aiCareTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 获取后端响应并结合现有逻辑
  const getAncestorResponse = useCallback(async (userMessage: string, currentTopic: Topic | null, currentScene: Scene) => {
    try {
      // 调用后端 API 获取响应
      const backendResponse = await sendMessageToBackend(userMessage);

      // 如果后端返回了有效响应，直接使用
      if (backendResponse) {
        return backendResponse;
      }
    } catch (error) {
      console.error('Error fetching response from backend:', error);
    }

    // 如果后端不可用或无响应，使用本地逻辑生成默认响应
    const lowercaseMessage = userMessage.toLowerCase();

    if (lowercaseMessage.includes('miss you')) {
      return "我也很想你，亲爱的。能这样和你说话真好。";
    }

    if (lowercaseMessage.includes('how are you')) {
      return "我很平静。别担心我。你最近怎么样？我想听听你的生活。";
    }

    // 默认响应
    return "很高兴和你聊天。还有什么想告诉我的吗？";
  }, []);

  const addAncestorResponse = useCallback(async (userMessage: string) => {
    setIsTyping(true);

    // 获取响应文本
    const responseText = await getAncestorResponse(userMessage, topic, scene);

    // 分段消息
    const segments = segmentMessage(responseText);

    // 按顺序发送分段消息
    segments.forEach((segment, index) => {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: generateMessageId(),
            text: segment,
            sender: '祖先',
            timestamp: new Date(),
          },
        ]);

        // 最后一段消息时，停止打字状态
        if (index === segments.length - 1) {
          setIsTyping(false);
          setWaitingForReply(false);

          if (aiCareTimerRef.current) {
            clearTimeout(aiCareTimerRef.current);
          }
          aiCareTimerRef.current = setTimeout(() => {
            // 2分钟后自动触发
            addAncestorResponse('（你发现孙女很久没有回复你，关心地问孙女还在吗这一类的话）');
          }, 2 * 60 * 1000); 
        }
      }, 1000 + index * 3500); // 第一段延迟 1 秒，后续每段延迟 3.5 秒
    });
  }, [getAncestorResponse, topic, scene]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    // 将消息添加到消息列表以立即显示
    const userMessage = {
      id: generateMessageId(),
      text: text.trim(),
      sender: '用户' as const,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // 将消息追加到缓冲区
    setInputBuffer((prev) => {
      const updatedBuffer = [...prev, text.trim()];
      inputBufferRef.current = updatedBuffer; // 更新最新的缓冲区内容
      return updatedBuffer;
    });

    // 如果已有计时器，清除它
    if (inputTimerRef.current) {
      clearTimeout(inputTimerRef.current);
    }

    // 设置新的计时器
    inputTimerRef.current = setTimeout(() => {
      // 使用最新的缓冲区内容
      const combinedMessage = inputBufferRef.current.join(' ');
      setInputBuffer([]); // 清空缓冲区
      inputBufferRef.current = []; // 清空最新的缓冲区内容
      inputTimerRef.current = null; // 清除计时器引用

      if (combinedMessage.trim()) {
        // 调用祖先响应逻辑
        setWaitingForReply(true);
        addAncestorResponse(combinedMessage);
      }
    }, 5000); // 5 秒后汇总消息并发送
  }, [addAncestorResponse]);

  const [lastTopic, setLastTopic] = useState<Topic | null>(null);
  const [lastScene, setLastScene] = useState<Scene | null>(null);
  
  // 初始问候和话题/场景切换逻辑
  useEffect(() => {
    const handleInitialGreeting = async () => {
      if (!hasGreetedRef.current) {
        hasGreetedRef.current = true;
        const initialResponse = await sendMessageToBackend('我想你啦，你想我了没有？');
        addAncestorResponse(initialResponse);
        setLastTopic(topic);
        setLastScene(scene);
      }
    };

    const handleTopicChange = async () => {
      if (topic !== lastTopic) {
        setLastTopic(topic); // 更新 lastTopic
        if (topic) {
          // 更新提示信息
          setCurrentTopicHint(`奶奶想和你聊聊 ${topic}`);
          
          // 延迟清除提示信息（例如 3 秒后消失）
          setTimeout(() => {
            setCurrentTopicHint(null);
          }, 3000);

          const topicResponse = await sendMessageToBackend(`奶奶，我们来聊聊${topic}吧。`);
          addAncestorResponse(topicResponse);
        }
      }
    };

    const handleSceneChange = async () => {
      if (scene !== lastScene) {
        setLastScene(scene); // 更新 lastScene
        const sceneResponse = await sendMessageToBackend(`（现在进入了${scene}场景，这是我们聊天的背景，你可以说一些符合这个场景的话，结合正在聊的话题）。`);
        addAncestorResponse(sceneResponse);
      }
    };

    if (!hasGreetedRef.current) {
      setTimeout(() => {
        handleInitialGreeting();
      }, 1000);
    } else {
      handleTopicChange();
      handleSceneChange();
    }
  }, [topic, scene, lastTopic, lastScene, addAncestorResponse]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        isTyping,
        sendMessage,
        ancestor,
        scene,
        setScene,
        topic,
        setTopic,
        waitingForReply,
        currentTopicHint, // 添加到上下文
        currentInput,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}    