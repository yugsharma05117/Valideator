import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Loader2, Brain, Sparkles, Trash2,
  MessageSquare, Lightbulb, ArrowRight, Plus
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { sendChatMessage } from '../services/api';
import './BrainstormPage.css';

export default function BrainstormPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');

    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const data = await sendChatMessage(userMsg, sessionId);
      setSessionId(data.sessionId);
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Sorry, something went wrong: ${err.message}. Please try again.`,
        error: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setSessionId(null);
  };

  const suggestedPrompts = [
    "Help me brainstorm a startup idea for the education space",
    "What business model would work best for a food delivery app in a small city?",
    "How should I validate my SaaS idea before building it?",
    "What are the most common mistakes first-time founders make?",
    "Help me create a go-to-market strategy for my marketplace idea",
    "What makes a startup pitch compelling to investors?"
  ];

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="bs" id="brainstorm-page">
      <Navbar />

      <div className="bs__layout">
        {/* ── Main Chat ─────────────────────────────── */}
        <div className="bs__main">
          <div className="bs__chat" id="brainstorm-chat">
            {messages.length === 0 ? (
              <div className="bs__empty">
                <motion.div
                  className="bs__empty-icon"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <Brain size={48} />
                </motion.div>
                <h2 className="bs__empty-title">Brainstorm Startup Ideas</h2>
                <p className="bs__empty-desc">
                  Chat with Valideator AI exclusively about startup ideas and business concepts.
                  Brainstorm new ideas, refine existing ones, discuss business models, plan your MVP, 
                  or get advice on go-to-market strategy. <strong>Only startup-related topics</strong> — 
                  no general knowledge, science, or coding questions.
                </p>

                <div className="bs__suggestions">
                  {suggestedPrompts.map((prompt, i) => (
                    <motion.button
                      key={i}
                      className="bs__suggestion"
                      onClick={() => { setInput(prompt); inputRef.current?.focus(); }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                      id={`bs-suggestion-${i}`}
                    >
                      <Sparkles size={14} />
                      {prompt}
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bs__messages">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    className={`bs__message bs__message--${msg.role}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bs__message-avatar">
                      {msg.role === 'user' ? (
                        <MessageSquare size={16} />
                      ) : (
                        <Brain size={16} />
                      )}
                    </div>
                    <div className={`bs__message-bubble ${msg.error ? 'bs__message-bubble--error' : ''}`}>
                      {msg.role === 'assistant' ? (
                        <div
                          className="bs__message-content"
                          dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                        />
                      ) : (
                        <div className="bs__message-content">{msg.content}</div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {loading && (
                  <motion.div
                    className="bs__message bs__message--assistant"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="bs__message-avatar">
                      <Brain size={16} />
                    </div>
                    <div className="bs__message-bubble bs__message-bubble--typing">
                      <div className="bs__typing-dots">
                        <span /><span /><span />
                      </div>
                      <span>Thinking...</span>
                    </div>
                  </motion.div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* ── Input Area ─────────────────────────────── */}
          <form className="bs__input-area" onSubmit={handleSubmit} id="brainstorm-form">
            <div className="bs__input-wrapper">
              {messages.length > 0 && (
                <button
                  type="button"
                  className="bs__clear-btn"
                  onClick={clearChat}
                  title="Start new conversation"
                  id="bs-clear-btn"
                >
                  <Plus size={16} />
                  New
                </button>
              )}
              <input
                ref={inputRef}
                type="text"
                className="bs__input"
                placeholder="Brainstorm a startup idea, business model, or strategy..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                id="brainstorm-input"
              />
              <button
                type="submit"
                className="bs__send-btn"
                disabled={!input.trim() || loading}
                id="bs-send-btn"
              >
                {loading ? <Loader2 size={20} className="spin" /> : <Send size={20} />}
              </button>
            </div>
            <p className="bs__input-hint">
              🚀 Startup-only brainstorming — discuss ideas, business models, strategy, funding, and growth. Off-topic questions will be redirected.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
