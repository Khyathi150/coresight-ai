import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { api } from "../lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "Why did revenue fall yesterday?",
  "Which products should I reorder?",
  "Show products likely to expire.",
  "Forecast next month's revenue.",
];

export default function Copilot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Ask me anything about your business — I'll compute the real numbers first, then explain them." },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(question: string) {
    if (!question.trim() || sending) return;
    setMessages((m) => [...m, { role: "user", content: question }]);
    setInput("");
    setSending(true);
    try {
      const res = await api.askCopilot(question);
      setMessages((m) => [...m, { role: "assistant", content: res.answer }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "I couldn't reach the analytics engine. Check that GROQ_API_KEY and Supabase are configured on the backend." }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-3xl mx-auto">
      <div className="mb-4">
        <span className="eyebrow">AI Copilot</span>
        <h1 className="font-display text-2xl font-semibold mt-1">Ask your business anything.</h1>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-4 pb-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] px-4 py-3 rounded-xl text-sm leading-relaxed whitespace-pre-wrap
                ${m.role === "user" ? "bg-signal-amber text-ink-950" : "panel text-mist-100"}`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {sending && <div className="panel px-4 py-3 rounded-xl text-sm text-mist-500 font-mono w-fit">computing → narrating…</div>}
        <div ref={bottomRef} />
      </div>

      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestions.map((s) => (
            <button key={s} onClick={() => send(s)} className="text-xs font-mono px-3 py-1.5 rounded-full border border-white/10 text-mist-500 hover:text-signal-amber hover:border-signal-amber/40 transition-colors">
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="flex items-center gap-2 panel px-3 py-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about revenue, inventory, forecasts…"
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-mist-700 py-2"
        />
        <button type="submit" disabled={sending} className="w-9 h-9 rounded-lg bg-signal-amber text-ink-950 flex items-center justify-center disabled:opacity-40">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
