import React, { useState } from 'react';

export default function LiveSupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'سلام! به میز پشتیبانی ۲۴ ساعته پلتفرم نیل خوش آمدید. چگونه می‌توانیم به شما کمک کنیم؟' }
  ]);
  const [inputVal, setInputVal] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg = { sender: 'user', text: inputVal };
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: 'پیام شما دریافت شد. در صورت فوریت، با خط پشتیبانی مستقیم ما به شماره +447552847468 تماس حاصل فرمایید یا به support@nileecosystem.com ایمیل بزنید.'
        }
      ]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-6 z-40">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-nile-accent to-emerald-400 text-nile-950 flex items-center justify-center text-2xl shadow-xl shadow-nile-accent/30 hover:scale-105 transition-transform"
          title="پشتیبانی ۲۴ ساعته نیل"
        >
          💬
        </button>
      )}

      {isOpen && (
        <div className="glass-panel w-80 sm:w-96 h-[460px] rounded-3xl border border-white/20 shadow-2xl flex flex-col overflow-hidden bg-slate-950">
          {/* Header */}
          <div className="p-4 bg-slate-900 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                🐊
              </div>
              <div>
                <div className="text-xs font-bold text-white">پشتیبانی ۲۴/۷ نیل اینوستمنت</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  اپراتور آنلاین
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white text-xs font-bold">
              ✕
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl ${
                  m.sender === 'user'
                    ? 'bg-nile-accent text-nile-950 font-medium'
                    : 'bg-slate-900 text-slate-200 border border-white/5'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-slate-900/80 flex gap-2">
            <input
              type="text"
              placeholder="پیام خود را بنویسید..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
            <button type="submit" className="px-4 py-2 bg-nile-accent text-nile-950 font-bold rounded-xl text-xs">
              ارسال
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
