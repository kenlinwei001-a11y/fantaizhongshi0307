import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';

export function CopilotPanel() {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; content: string }[]>([
    { role: 'model', content: "您好！我是您的仿真助手。我可以帮您设置物理模型、优化网格参数或分析结果。请问有什么可以帮您？" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API Key not found");
      }
      
      const ai = new GoogleGenAI({ apiKey });
      const model = "gemini-2.5-flash-lite-preview"; // Using a fast model for chat
      
      const response = await ai.models.generateContent({
        model,
        contents: [
          { role: 'user', parts: [{ text: "You are an expert in metallurgical fire process numerical simulation. Please answer in Chinese. Answer the following question: " + userMessage }] }
        ]
      });

      const text = response.text || "我无法生成回答。";
      setMessages(prev => [...prev, { role: 'model', content: text }]);
    } catch (error) {
      console.error("Copilot Error:", error);
      setMessages(prev => [...prev, { role: 'model', content: "抱歉，遇到错误。请检查您的 API 密钥。" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-zinc-900 border-l border-white/10 flex flex-col w-80">
      <div className="p-3 border-b border-white/10 font-medium text-zinc-400 text-xs uppercase tracking-wider flex items-center gap-2">
        <Sparkles className="w-3 h-3 text-purple-400" />
        AI 助手
      </div>
      
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'model' ? 'bg-purple-500/20' : 'bg-zinc-700'}`}>
              {msg.role === 'model' ? <Sparkles className="w-4 h-4 text-purple-400" /> : <span className="text-xs font-medium text-white">U</span>}
            </div>
            <div className={`rounded-lg p-3 text-sm max-w-[85%] ${msg.role === 'model' ? 'bg-white/5 text-zinc-300' : 'bg-blue-500/20 text-blue-100'}`}>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
           <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
               <Sparkles className="w-4 h-4 text-purple-400" />
             </div>
             <div className="bg-white/5 rounded-lg p-3 text-sm text-zinc-300 flex items-center">
               <Loader2 className="w-4 h-4 animate-spin mr-2" />
               思考中...
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-white/10">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="询问 AI 助手..." 
            className="w-full bg-zinc-800 border-none rounded-md py-2 pl-3 pr-10 text-sm text-white placeholder-zinc-500 focus:ring-1 focus:ring-purple-500 outline-none"
            disabled={loading}
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
