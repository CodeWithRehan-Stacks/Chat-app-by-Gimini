import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  where
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Channel, Message } from '../types';
import { useAuth } from './AuthContext';

interface ChatContextType {
  channels: Channel[];
  messages: Message[];
  activeChannel: Channel | null;
  setActiveChannel: (channel: Channel) => void;
  sendMessage: (text: string) => Promise<void>;
  createChannel: (name: string, description: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user, profile } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'channels'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const channelData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Channel));
      setChannels(channelData);
      if (channelData.length > 0 && !activeChannel) {
        setActiveChannel(channelData[0]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!activeChannel) {
      setMessages([]);
      return;
    }

    const q = query(
      collection(db, 'channels', activeChannel.id, 'messages'),
      orderBy('createdAt', 'asc')
    );
    
    const unsubscribe = onSnapshot(q, (snap) => {
      const messageData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(messageData);
    });

    return () => unsubscribe();
  }, [activeChannel]);

  const sendMessage = async (text: string) => {
    if (!user || !activeChannel || !profile) return;

    await addDoc(collection(db, 'channels', activeChannel.id, 'messages'), {
      channelId: activeChannel.id,
      senderId: user.uid,
      senderName: profile.displayName || user.email,
      text,
      createdAt: serverTimestamp()
    });
  };

  const createChannel = async (name: string, description: string) => {
    if (!user) return;
    await addDoc(collection(db, 'channels'), {
      name,
      description,
      createdBy: user.uid,
      createdAt: serverTimestamp(),
      type: 'public'
    });
  };

  return (
    <ChatContext.Provider value={{ 
      channels, 
      messages, 
      activeChannel, 
      setActiveChannel, 
      sendMessage,
      createChannel 
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};
