export interface Message {
  id: string;
  text: string;
  sender: '用户' | '祖先' | '系统'; // 添加 "系统"
  timestamp: Date;
}

export interface Ancestor {
  id: string;
  name: string; // 姓名
  avatar: string; // 头像
  relationship: string; // 关系
  description: string; // 描述
}

export type Scene = 
  | '家庭晚餐' // Family Dinner
  | '周末闲聊' // Weekend Chat
  | '节日活动' // Holiday Event
  | '生日聚会' // Birthday
  | '日常对话'; // Casual Conversation

export type Topic = 
  | '气候变化' // Climate Change
  | '职场文化' // Workplace Culture
  | '浪漫关系' // Romantic Relationships
  | '政治局势' // Political Situation
  | '科技' // Technology
  | '家庭关系'; // Family Relationships