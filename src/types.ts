export type UserRole = 'admin' | 'member';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  status: 'online' | 'offline';
  role: UserRole;
  createdAt: string;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  type: 'public' | 'private';
}

export interface Message {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
  updatedAt?: string;
}
