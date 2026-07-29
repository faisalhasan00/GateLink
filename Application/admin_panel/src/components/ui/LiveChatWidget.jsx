import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Phone, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LiveChatWidget({ onOpenDemo }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! 👋 Welcome to SocietySphere. How can I help you today?' }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInputText('');

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: 'Thanks for reaching out! Our society onboarding team is online. Tap "Book Live Demo" below or call +91 98765 43210 for immediate assistance.' }
      ]);
    }, 800);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Live Chat Concierge"
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '90px',
          height: '48px',
          padding: '0 20px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.6)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          zIndex: 9000,
          fontWeight: 800,
          fontSize: '13px'
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageSquare size={20} />
        <span>Live Support</span>
      </motion.button>

      {/* Floating Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: 'fixed',
              bottom: '90px',
              right: '32px',
              width: '360px',
              height: '480px',
              background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
              zIndex: 9500,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ padding: '16px 20px', background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={18} color="white" />
                </div>
                <div>
                  <div style={{ color: 'white', fontWeight: 800, fontSize: '14px' }}>SocietySphere Support</div>
                  <div style={{ color: '#34D399', fontSize: '11px', fontWeight: 700 }}>● Online Now</div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} aria-label="Close Live Chat" style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {/* Chat Body */}
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    background: m.sender === 'user' ? '#4F46E5' : 'rgba(30, 41, 59, 0.8)',
                    color: 'white',
                    padding: '10px 14px',
                    borderRadius: m.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  {m.text}
                </div>
              ))}
            </div>

            {/* Quick Actions Bar */}
            <div style={{ padding: '8px 16px', background: 'rgba(15, 23, 42, 0.6)', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '8px' }}>
              <button
                onClick={() => { setIsOpen(false); window.location.href = '/book-demo'; }}
                style={{ flex: 1, padding: '6px 10px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.2)', color: '#818CF8', border: '1px solid rgba(99, 102, 241, 0.4)', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
              >
                <Calendar size={12} /> Book Demo
              </button>
              <a
                href="tel:+919876543210"
                style={{ flex: 1, padding: '6px 10px', borderRadius: '8px', background: 'rgba(52, 211, 153, 0.2)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.4)', fontSize: '11px', fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
              >
                <Phone size={12} /> Call Sales
              </a>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} style={{ padding: '12px 16px', background: '#0F172A', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Type your question..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(30, 41, 59, 0.8)', color: 'white', fontSize: '13px', outline: 'none' }}
              />
              <button type="submit" aria-label="Send Message" style={{ padding: '10px', borderRadius: '10px', background: '#4F46E5', color: 'white', border: 'none', cursor: 'pointer' }}>
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
