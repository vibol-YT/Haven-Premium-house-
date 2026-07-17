import { useEffect, useState } from 'react';
import { X, Gift } from 'lucide-react';
import { useNavigate } from '../lib/router';

const DISMISS_KEY = 'haven_exit_dismissed_v1';

export function ExitIntentPopup() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY)) return;
    let armed = false;
    const arm = () => { armed = true; };
    const trigger = (e: MouseEvent) => {
      if (!armed || open) return;
      if (e.clientY <= 0) {
        setOpen(true);
        sessionStorage.setItem(DISMISS_KEY, '1');
      }
    };
    const timer = setTimeout(arm, 8000);
    document.addEventListener('mouseout', trigger);
    return () => { clearTimeout(timer); document.removeEventListener('mouseout', trigger); };
  }, [open]);

  if (!open) return null;

  const close = () => setOpen(false);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm animate-fade-in" onClick={close} />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-sand-50 shadow-lift animate-scale-in">
        <button onClick={close} className="absolute right-3 top-3 z-10 rounded-full p-2 text-ink-500 hover:bg-sand-100" aria-label="Close">
          <X size={18} />
        </button>
        <div className="grid gap-0 sm:grid-cols-2">
          <div className="hidden sm:block">
            <img src="https://images.pexels.com/photos/6207365/pexels-photo-6207365.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" className="h-full w-full object-cover" />
          </div>
          <div className="p-7">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-clay-500 text-white">
              <Gift size={20} />
            </div>
            <h3 className="mt-4 font-serif text-xl text-ink-900">Wait — take 15% off</h3>
            <p className="mt-2 text-sm text-ink-600">
              Before you go, here's a single-use 15% code for your first order. No expiry on your wishlist.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); close(); navigate({ name: 'shop' }); }} className="mt-4">
              <input type="email" required placeholder="Email address" className="input" />
              <button type="submit" className="btn-primary mt-3 w-full">Claim my 15% off</button>
            </form>
            <button onClick={close} className="mt-3 w-full text-center text-xs text-ink-400 hover:text-ink-700">No thanks, I'll pay full price</button>
          </div>
        </div>
      </div>
    </div>
  );
}
