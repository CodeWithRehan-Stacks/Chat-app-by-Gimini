import React, { useRef, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { 
  Hash, 
  Send, 
  Settings, 
  LogOut, 
  Plus, 
  Search,
  Bell,
  MessageSquare,
  MoreVertical,
  Users
} from 'lucide-react';
import { cn, formatDate } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Dashboard() {
  const { profile, logout } = useAuth();
  const { 
    channels, 
    messages, 
    activeChannel, 
    setActiveChannel, 
    sendMessage,
    createChannel
  } = useChat();

  const [message, setMessage] = useState('');
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDesc, setNewChannelDesc] = useState('');
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    const currentMsg = message;
    setMessage('');
    try {
      await sendMessage(currentMsg);
    } catch (err) {
      console.error('Send error:', err);
    }
  };

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    await createChannel(newChannelName, newChannelDesc);
    setShowChannelModal(false);
    setNewChannelName('');
    setNewChannelDesc('');
  };

  return (
    <div className="flex h-screen bg-chat text-zinc-400 font-sans overflow-hidden">
      {/* Workspace Rail */}
      <div className="w-16 bg-workspace border-r border-theme-border flex flex-col items-center py-4 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-accent-indigo flex items-center justify-center text-white font-bold shadow-[0_0_12px_rgba(99,102,241,0.3)] mb-4">
          SC
        </div>
        <div className="w-10 h-10 rounded-xl bg-theme-border flex items-center justify-center text-text-muted font-bold hover:bg-input-border transition-colors cursor-pointer mb-3">
          DS
        </div>
        <div className="w-10 h-10 rounded-xl bg-theme-border flex items-center justify-center text-text-muted font-bold hover:bg-input-border transition-colors cursor-pointer mb-3">
          MK
        </div>
        <div className="mt-auto w-10 h-10 rounded-xl border border-dashed border-input-border flex items-center justify-center text-text-muted hover:text-white transition-colors cursor-pointer text-xl">
          +
        </div>
      </div>

      {/* Sidebar - Channels */}
      <div className="w-60 bg-sidebar border-r border-theme-border flex flex-col shrink-0">
        <div className="p-5 border-b border-theme-border flex items-center justify-between">
          <h1 className="font-semibold text-text-zinc">SyncChat</h1>
          <button className="text-text-muted hover:text-white">
            <Search size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          <div className="px-4 pt-6 pb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Channels
          </div>

          <nav className="space-y-0.5 px-0">
            {channels.map(channel => (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2 text-sm transition-all relative group",
                  activeChannel?.id === channel.id 
                    ? "bg-workspace/50 text-text-zinc" 
                    : "hover:bg-workspace/30 text-zinc-400 hover:text-text-zinc"
                )}
              >
                {activeChannel?.id === channel.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent-indigo" />
                )}
                <span className="text-text-muted group-hover:text-zinc-300">#</span>
                <span className="truncate">{channel.name}</span>
              </button>
            ))}
            <button 
              onClick={() => setShowChannelModal(true)}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-text-muted hover:text-text-zinc hover:bg-workspace/30 transition-all font-medium"
            >
              <Plus size={14} />
              <span>Add channel</span>
            </button>
          </nav>
        </div>

        {/* Profile */}
        <div className="p-4 bg-workspace/20 border-t border-theme-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-input-border rounded-lg flex items-center justify-center font-bold text-white shrink-0 overflow-hidden">
               {profile?.photoURL ? (
                  <img src={profile.photoURL} alt="" referrerPolicy="no-referrer" />
                ) : (
                  profile?.displayName?.[0].toUpperCase()
                )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-zinc truncate">{profile?.displayName}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-text-muted">Online</span>
              </div>
            </div>
            <button onClick={logout} className="text-text-muted hover:text-red-400">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-chat">
        {/* Chat Header */}
        <header className="h-16 px-6 border-b border-theme-border flex items-center justify-between shrink-0">
          <div>
            <div className="chat-header-title text-lg font-semibold text-text-zinc">
              {activeChannel ? `# ${activeChannel.name}` : 'Select a channel'}
            </div>
            {activeChannel && (
              <div className="text-xs text-text-muted">
                18 members • {activeChannel.description || 'Channel collaboration'}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 text-text-muted">
            <button className="hover:text-white"><Bell size={18} /></button>
            <button className="hover:text-white"><MoreVertical size={18} /></button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar flex flex-col" ref={scrollRef}>
          <div className="flex-1" />
          {activeChannel ? (
            <div className="space-y-6">
              {messages.map((msg, idx) => {
                const isConsecutive = idx > 0 && messages[idx-1].senderId === msg.senderId && 
                  (new Date(msg.createdAt as any).getTime() - new Date(messages[idx-1].createdAt as any).getTime() < 300000);

                return (
                  <div key={msg.id} className={cn("flex group", isConsecutive ? "mt-[-1.25rem]" : "mt-0")}>
                    {!isConsecutive ? (
                      <div className="w-10 h-10 rounded-lg bg-input-border flex items-center justify-center font-bold text-white shrink-0 mt-1 mr-3">
                        {msg.senderName[0].toUpperCase()}
                      </div>
                    ) : (
                      <div className="w-10 mr-3 shrink-0" />
                    )}
                    <div className="flex-1">
                      {!isConsecutive && (
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-semibold text-text-zinc">{msg.senderName}</span>
                          {/* Role badge simulation */}
                          {msg.senderName.includes('Admin') && (
                             <span className="text-[9px] bg-indigo-900/50 text-indigo-300 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Admin</span>
                          )}
                          <span className="text-[11px] text-text-muted">{formatDate(new Date(msg.createdAt as any))}</span>
                        </div>
                      )}
                      <div className="text-zinc-300 text-sm leading-relaxed">{msg.text}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-50">
               <Hash size={48} className="text-text-muted mb-4" />
               <p className="text-text-muted">Start a conversation in a channel</p>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 pt-2">
          <div className="bg-input-wrapper border border-input-border rounded-xl p-3 focus-within:border-accent-indigo transition-colors shadow-lg">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder={activeChannel ? `Message #${activeChannel.name}` : "Join a channel to chat"}
              className="w-full bg-transparent border-none text-zinc-100 text-sm outline-none resize-none h-12 py-1 placeholder-text-muted"
            />
            <div className="flex items-center justify-between border-t border-theme-border/50 pt-2 mt-2">
              <div className="flex items-center gap-4 text-text-muted">
                <button type="button" className="hover:text-white transition-colors"><Plus size={16} /></button>
                <button type="button" className="hover:text-white transition-colors font-bold text-xs">B</button>
                <button type="button" className="hover:text-white transition-colors italic text-xs">I</button>
                <div className="w-[1px] h-3 bg-theme-border" />
                <button type="button" className="hover:text-white transition-colors">@</button>
                <button type="button" className="hover:text-white transition-colors">☺</button>
              </div>
              <button 
                onClick={handleSendMessage}
                disabled={!message.trim() || !activeChannel}
                className="bg-accent-indigo text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/10"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showChannelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowChannelModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-sidebar rounded-2xl border border-theme-border p-8 shadow-2xl relative z-10"
            >
              <h2 className="text-2xl font-bold text-text-zinc mb-2">Create a channel</h2>
              <p className="text-text-muted mb-8 text-sm">Channels are where your team communicates. They’re best when organized around a topic — #marketing, for example.</p>
              
              <form onSubmit={handleCreateChannel} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Name</label>
                  <div className="relative">
                    <Hash size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="text"
                      required
                      value={newChannelName}
                      onChange={(e) => setNewChannelName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                      className="w-full bg-workspace border border-theme-border rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-accent-indigo transition-all"
                      placeholder="e.g. project-apollo"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Description (optional)</label>
                  <input
                    type="text"
                    value={newChannelDesc}
                    onChange={(e) => setNewChannelDesc(e.target.value)}
                    className="w-full bg-workspace border border-theme-border rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-accent-indigo transition-all"
                    placeholder="What's this channel about?"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowChannelModal(false)}
                    className="px-6 py-2.5 text-text-muted hover:text-white font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-accent-indigo hover:opacity-90 text-white rounded-lg font-bold transition-all shadow-lg"
                  >
                    Create Channel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #303236;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #404246;
        }
      `}} />
    </div>
  );
}
