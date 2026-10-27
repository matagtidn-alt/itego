import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Headphones, 
  ExternalLink, 
  Sparkles, 
  Check, 
  PhoneCall,
  User,
  Bot
} from 'lucide-react';
import { Language, ChatMessage } from '../types';
import { translations } from '../i18n/translations';
import { createWhatsAppLink } from '../utils/formatters';
import { ItegoLogo } from './ItegoLogo';

interface CustomerServiceChatProps {
  language: Language;
}

export const CustomerServiceChat: React.FC<CustomerServiceChatProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = translations[language];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'agent',
      text: t.csGreeting,
      timestamp: 'Baru saja',
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].sender === 'agent') {
        return [
          {
            id: 'msg-1',
            sender: 'agent',
            text: t.csGreeting,
            timestamp: language === 'id' ? 'Baru saja' : 'Just now',
          },
        ];
      }
      return prev;
    });
  }, [language]);

  const handleSendMessage = (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const lower = userText.toLowerCase();

      if (language === 'id') {
        if (lower.includes('sepeda') || lower.includes('sewa')) {
          reply = 'Untuk sewa sepeda kayuh di Gili Trawangan tarifnya Rp 50.000 / hari per unit. Kami menyediakan 10 unit sepeda yang siap diantar gratis ke hotel atau bisa diambil di Pelabuhan Utama Gili T. Sudah termasuk kunci gembok & keranjang.';
        } else if (lower.includes('bangsal') || lower.includes('pelabuhan') || lower.includes('driver') || lower.includes('mobil') || lower.includes('surf') || lower.includes('sembalun') || lower.includes('tetebatu') || lower.includes('pink') || lower.includes('korleko')) {
          reply = 'Penjemputan mobil driver kami khusus di gerbang keluar Pelabuhan Bangsal. Driver siap mengantar ke: Sembalun Rinjani (Rp 450rb), Tetebatu Green Valley & Air Terjun (Rp 450rb), Pantai Pink (Rp 500rb), Area Surf di Korleko & Labuhan Haji (Rp 400rb, muat surfboard), serta Trip Harian Bisa Request bebas rute seharian (Rp 650rb)!';
        } else if (lower.includes('ojek') || lower.includes('listrik') || lower.includes('tarif')) {
          reply = 'Ojek sepeda listrik ITEGO tarifnya Rp 20.000 untuk sekali jalan di seluruh area Gili Trawangan. Aman, legal, dan bebas lelah menyusuri jalan berpasir!';
        } else if (lower.includes('bayar') || lower.includes('tunai') || lower.includes('qris')) {
          reply = 'Anda bisa memilih bayar Tunai langsung di tempat (COD) saat serah terima unit, atau bayar non-tunai lewat QRIS Nasional (GoPay, OVO, Dana, BCA, Mandiri, BRI) dan transfer bank.';
        } else {
          reply = 'Terima kasih atas pesan Anda! Tim operasional ITEGO siap melayani. Untuk respons kilat langsung dari driver/pengelola kami, Anda juga bisa langsung chat kami via WhatsApp.';
        }
      } else {
        if (lower.includes('bike') || lower.includes('bicycle') || lower.includes('rent')) {
          reply = 'Our pedal bicycle rental on Gili Trawangan is only IDR 50,000/day. We have 10 quality bicycles with free hotel delivery, front basket, and padlock included!';
        } else if (lower.includes('bangsal') || lower.includes('port') || lower.includes('car') || lower.includes('driver') || lower.includes('surf') || lower.includes('rinjani')) {
          reply = 'Our private car pickup is exclusively at Bangsal Port arrival gate. We offer trips to: Sembalun Rinjani (IDR 450k), Tetebatu Green Valley (IDR 450k), Pink Beach (IDR 500k), Korleko Surfing Area & Labuhan Haji (IDR 400k, surfboard fit), and Custom All-Day Tour by Request (IDR 650k)!';
        } else if (lower.includes('taxi') || lower.includes('ojek') || lower.includes('electric')) {
          reply = 'Our electric bike taxi is IDR 20,000 flat per one-way trip anywhere in Gili Trawangan. Fast, eco-friendly, and convenient!';
        } else if (lower.includes('pay') || lower.includes('cash') || lower.includes('qris')) {
          reply = 'You can pay Cash on Delivery (COD) in person when you meet the driver or receive bikes, or pay instantly using QRIS and bank transfer.';
        } else {
          reply = 'Thank you for reaching out! Our team is available 24/7. You can also chat with our staff directly on WhatsApp for real-time dispatch.';
        }
      }

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, agentMsg]);
    }, 700);
  };

  const waEscalateLink = createWhatsAppLink(
    '+6281234567890',
    language === 'id'
      ? 'Halo CS ITEGO, saya ingin menanyakan informasi layanan transportasi di Gili Trawangan & Lombok.'
      : 'Hello ITEGO Customer Support, I have an inquiry about transport services on Gili Trawangan and Lombok.'
  );

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-3.5 bg-[#00AA13] text-white rounded-full shadow-[0_8px_25px_rgba(0,170,19,0.35)] hover:bg-[#009310] transition-all cursor-pointer flex items-center gap-2 transform hover:scale-105"
          title="Customer Service ITEGO"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 stroke-[2.2]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full"></span>
          </div>
          <span className="font-bold text-xs text-white hidden sm:inline pr-1">
            CS Online
          </span>
        </button>
      </div>

      {/* Chat Window Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[520px] max-h-[85vh] animate-in slide-in-from-bottom-5 duration-150">
          
          {/* Header */}
          <div className="bg-[#00AA13] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ItegoLogo size="sm" variant="dark-pill" />
              <div>
                <h3 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5 leading-none">
                  {t.csTitle}
                </h3>
                <p className="text-[10px] text-emerald-100 font-semibold mt-0.5">{t.csStatusOnline}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center transition-colors text-xs cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick FAQ Pills */}
          <div className="bg-gray-50 px-3.5 py-2.5 border-b border-gray-200 overflow-x-auto">
            <p className="font-mono text-[9px] uppercase tracking-wider text-gray-500 mb-1.5 font-bold">
              [?] {t.csQuickQuestions}
            </p>
            <div className="flex gap-1.5 whitespace-nowrap">
              {[t.csFaq1, t.csFaq2, t.csFaq3, t.csFaq4].map((faq, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendMessage(faq)}
                  className="px-3 py-1 bg-white text-gray-700 text-[11px] font-medium rounded-full border border-gray-200 hover:border-[#00AA13] hover:text-[#00AA13] hover:bg-[#E8F5E9] transition-colors cursor-pointer shadow-2xs"
                >
                  {faq}
                </button>
              ))}
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-[#F9F9F9]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl ${
                    m.sender === 'user'
                      ? 'bg-[#00AA13] text-white font-medium shadow-xs rounded-br-xs'
                      : 'bg-white text-gray-800 border border-gray-200 leading-relaxed shadow-2xs rounded-bl-xs'
                  }`}
                >
                  <p>{m.text}</p>
                </div>
                <span className="font-mono text-[9px] text-gray-400 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white p-3 rounded-2xl border border-gray-200 w-fit shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00AA13] animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00AA13] animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00AA13] animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Escalate to WhatsApp button */}
          <div className="p-3 bg-white border-t border-gray-200">
            <a
              href={waEscalateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 bg-[#E8F5E9] text-[#00AA13] border border-[#00AA13]/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#00AA13] hover:text-white transition-colors shadow-2xs"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              {t.csEscalateWA}
            </a>
          </div>

          {/* Input field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputVal);
            }}
            className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={t.csInputPlaceholder}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-black focus:outline-none focus:border-[#00AA13] focus:bg-white transition-colors"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="px-4 py-2.5 bg-[#00AA13] text-white text-xs font-bold rounded-xl hover:bg-[#009310] disabled:opacity-30 transition-colors cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
