import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, Sparkles, User } from "lucide-react";
import { useStore } from "../store/uiStore";
import { cn } from "../lib/utils";
import { toast } from "sonner";

export const AISidebar = () => {
  const { isAiOpen, closeAi } = useStore();
  const [messages, setMessages] = useState([{ role: "ai", text: "Hello! I'm connected to your live data. Ask me about your revenue, clients, or traffic." }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsTyping(true);

    // Simulated AI Logic
    setTimeout(() => {
      let reply = "I can help with that.";
      const lower = userMsg.toLowerCase();
      
      if (lower.includes("revenue") || lower.includes("money")) reply = "Your revenue is up 20.1% this week, totaling $45,231. The main driver is the 'TechCorp' contract.";
      else if (lower.includes("client") || lower.includes("who")) reply = "You have 4 active high-value clients. 'Design Studio' recently cancelled, which I've flagged as a risk.";
      else if (lower.includes("hello")) reply = "Hi Aayush! Ready to optimize your workflow today?";
      else reply = "I've analyzed the request. Based on current trends, I recommend increasing server capacity by 15% to handle the load.";

      setMessages(prev => [...prev, { role: "ai", text: reply }]);
      setIsTyping(false);
      toast.success("AI Insight Generated");
    }, 1500);
  };

  return (
    <>
      {isAiOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={closeAi} />}
      <div className={cn(
        "fixed right-0 top-0 h-full w-[380px] bg-slate-900 border-l border-white/10 z-50 transition-transform duration-300 shadow-2xl flex flex-col",
        isAiOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-slate-800/50">
          <div className="flex items-center gap-2">
            <Sparkles className="text-indigo-400 w-5 h-5" />
            <h3 className="text-white font-semibold">Nebula Assistant</h3>
          </div>
          <button onClick={closeAi}><X className="text-slate-400 hover:text-white" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={cn("flex gap-3", m.role === "user" ? "flex-row-reverse" : "")}>
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", m.role === "ai" ? "bg-indigo-500/20 text-indigo-400" : "bg-slate-700 text-white")}>
                {m.role === "ai" ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className={cn("p-3 rounded-xl text-sm max-w-[80%]", m.role === "ai" ? "bg-slate-800 text-slate-200" : "bg-indigo-600 text-white")}>
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && <div className="text-xs text-slate-500 animate-pulse pl-12">Nebula is thinking...</div>}
          <div ref={scrollRef} />
        </div>

        <div className="p-4 border-t border-white/5">
          <div className="relative">
            <input 
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-indigo-500"
              placeholder="Ask AI..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="absolute right-2 top-2 p-1.5 bg-indigo-600 rounded-md text-white hover:bg-indigo-500"><Send size={14} /></button>
          </div>
        </div>
      </div>
    </>
  );
};