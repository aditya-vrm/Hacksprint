import { useEffect, useRef, useState } from 'react';
import { X, Send, MessageCircle, Wifi, WifiOff } from 'lucide-react';
import { CURRENT_USER_ID } from '../../../community/state/communitySlice';

const STATUS_LABEL = {
  connected: { text: 'Connected', className: 'text-primary' },
  connecting: { text: 'Connecting...', className: 'text-text-muted' },
  disconnected: { text: 'Reconnecting...', className: 'text-orange-400' },
  offline: { text: 'Offline mode', className: 'text-text-muted' },
  idle: { text: 'Ready', className: 'text-text-muted' },
};

const ChatDialog = ({
  isOpen,
  activeUser,
  messages,
  connectionStatus,
  isTyping,
  onClose,
  onSend,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else {
      setInput('');
    }
  }, [isOpen, activeUser?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

  if (!isOpen || !activeUser) return null;

  const status = STATUS_LABEL[connectionStatus] || STATUS_LABEL.idle;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close chat"
      />

      <div className="relative w-full sm:max-w-md h-[85vh] sm:h-[520px] bg-surface border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-background/50 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <img
                src={activeUser.avatarUrl}
                alt={activeUser.name}
                className="w-10 h-10 rounded-full border border-border object-cover"
              />
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface ${
                  connectionStatus === 'connected' ? 'bg-primary' : 'bg-text-muted'
                }`}
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{activeUser.name}</p>
              <p className={`text-xs font-mono flex items-center gap-1 ${status.className}`}>
                {connectionStatus === 'connected' ? (
                  <Wifi className="w-3 h-3" />
                ) : (
                  <WifiOff className="w-3 h-3" />
                )}
                {status.text}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-text-muted hover:text-white hover:bg-surface-hover transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background/30">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <MessageCircle className="w-10 h-10 text-primary/50 mb-3" />
              <p className="text-sm text-text-muted">
                Say hello to {activeUser.name.split(' ')[0]}!
              </p>
              <p className="text-xs text-text-muted/70 mt-1 font-mono">
                Messages sync when the chat server is connected
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderId === CURRENT_USER_ID;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMine
                        ? 'bg-primary text-[#0B1120] rounded-br-md'
                        : 'bg-surface-hover text-text-main border border-border rounded-bl-md'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}

          {isTyping && (
            <div className="flex justify-start">
              <div className="px-4 py-2.5 rounded-2xl bg-surface-hover border border-border text-xs text-text-muted">
                typing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-3 border-t border-border/50 bg-surface shrink-0 flex gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="shrink-0 w-11 h-11 flex items-center justify-center rounded-xl bg-primary text-[#0B1120] hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(34,211,238,0.25)]"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatDialog;
