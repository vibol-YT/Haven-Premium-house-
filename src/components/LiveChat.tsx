import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

type Msg = { from: 'bot' | 'me'; text: string };

const QUICK = ['Where is my order?', 'What is your return policy?', 'Do you ship internationally?'];

const ANSWERS: Record<string, string> = {
  'Where is my order?': "You'll get a tracking link by email as soon as your order ships — usually within 1 business day. You can also check under Account → Orders.",
  'What is your return policy?': "We accept returns within 60 days of delivery, no questions asked. Items must be unused and in original packaging. We cover return shipping for orders over $75.",
  'Do you ship internationally?': "Yes! We ship to Canada, the UK, the EU, and Australia. International shipping is calculated at checkout. Duties may apply on delivery.",
};

export function LiveChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: 'bot', text: "Hi! I'm Haven's concierge. How can I help you today?" },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { from: 'me', text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply = ANSWERS[text] ?? "Great question! A teammate will follow up by email shortly. In the meantime, our FAQ at the bottom of the page covers most topics.";
      setTyping(false);
      setMsgs((m) => [...m, { from: 'bot', text: reply }]);
    }, 900);
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-[95] grid h-14 w-14 place-items-center rounded-full bg-ink-800 text-sand-50 shadow-lift transition hover:bg-ink-900"
        aria-label="Open chat"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-[95] flex h-[28rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl bg-sand-50 shadow-lift animate-scale-in">
          <div className="flex items-center gap-3 border-b border-ink-100 bg-ink-800 px-4 py-3 text-sand-50">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-sand-50/15">
              <MessageCircle size={16} />
            </div>
            <div>
              <p className="text-sm font-medium">Haven Concierge</p>
              <p className="text-xs text-sand-200/80">Typically replies in a minute</p>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-sand-100/50 p-4">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
                  m.from === 'me' ? 'bg-ink-800 text-sand-50' : 'bg-white text-ink-800 shadow-soft'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white px-4 py-3 shadow-soft">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-300 [animation-delay:-0.2s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-300 [animation-delay:-0.1s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-300" />
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {msgs.length <= 2 && (
            <div className="flex flex-wrap gap-2 px-3 pb-2 pt-1">
              {QUICK.map((q) => (
                <button key={q} onClick={() => send(q)} className="rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-700 hover:border-ink-400">
                  {q}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-center gap-2 border-t border-ink-100 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-full border border-ink-200 bg-white px-4 py-2.5 text-sm focus:border-ink-700 focus:outline-none"
            />
            <button type="submit" className="grid h-10 w-10 place-items-center rounded-full bg-ink-800 text-sand-50 hover:bg-ink-900" aria-label="Send">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
