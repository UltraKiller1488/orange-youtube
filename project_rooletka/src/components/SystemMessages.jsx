import { motion, AnimatePresence } from 'framer-motion';
import '../styles/SystemMessages.css';

const SystemMessages = ({ messages = [] }) => {
  if (messages.length === 0) {
    return (
      <div className="system-messages-panel">
        <div className="messages-header">
          <span>СИСТЕМНЫЙ ЖУРНАЛ</span>
          <span className="message-count">0</span>
        </div>
        <div className="messages-container">
          <div className="system-message info">
            <span className="message-timestamp">[--:--:--]</span>
            <span className="message-text">ОЖИДАНИЕ СОБЫТИЙ...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="system-messages-panel">
      <div className="messages-header">
        <span>СИСТЕМНЫЙ ЖУРНАЛ</span>
        <span className="message-count">{messages.length}</span>
      </div>
      
      <div className="messages-container">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={`system-message ${message.type}`}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.8 }}
              transition={{ 
                duration: 0.3,
                ease: "easeOut"
              }}
            >
              <span className="message-timestamp">[{message.timestamp}]</span>
              <span className="message-text">{message.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SystemMessages;