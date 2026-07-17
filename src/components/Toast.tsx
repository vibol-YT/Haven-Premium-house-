import { useEffect, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle2 } from 'lucide-react';

type Toast = { id: number; message: string };

let listeners: ((t: Toast) => void)[] = [];
let counter = 0;

export function toast(message: string) {
  const t = { id: ++counter, message };
  listeners.forEach((l) => l(t));
}

export function ToastHost() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const listener = useCallback((t: Toast) => {
    setToasts((prev) => [...prev, t]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== t.id)), 2500);
  }, []);

  useEffect(() => {
    listeners.push(listener);
    return () => { listeners = listeners.filter((l) => l !== listener); };
  }, [listener]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-[100] flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center gap-2 rounded-full bg-ink-800 px-5 py-3 text-sm text-sand-50 shadow-lift animate-scale-in"
        >
          <CheckCircle2 size={16} className="text-moss-500" />
          {t.message}
        </div>
      ))}
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
