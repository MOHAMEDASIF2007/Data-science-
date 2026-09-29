import { useState, useEffect } from 'react';
import { Search, Bell, Microscope, Circle } from 'lucide-react';
import { getHealth } from '../services/api';

export default function Header() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    getHealth()
      .then(res => setIsOnline(res.data.status === 'healthy'))
      .catch(() => setIsOnline(false));
  }, []);

  return (
    <header className="h-20 flex items-center justify-between px-8 bg-brand-mainBg/80 backdrop-blur-md border-b border-brand-border z-10 sticky top-0">
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-textMuted" />
          <input 
            type="text" 
            placeholder="Explore system insights..." 
            className="w-full bg-brand-secondaryBg border border-brand-border rounded-full pl-10 pr-4 py-2 text-sm text-brand-textMain focus:outline-none focus:border-brand-amberDark transition-colors placeholder:text-brand-textMuted"
            readOnly
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <button className="text-brand-textMuted hover:text-brand-textMain transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        
        <div className="flex items-center space-x-2 bg-brand-amberDark/10 border border-brand-amberDark/20 px-4 py-1.5 rounded-full text-brand-amberMain">
          <Microscope className="w-4 h-4" />
          <span className="text-xs font-semibold tracking-wide">JURY TEST MODE</span>
        </div>
        
        <div className={`flex items-center space-x-2 bg-brand-secondaryBg border border-brand-border px-4 py-1.5 rounded-full ${isOnline ? '' : 'opacity-70'}`}>
          <Circle className={`w-2.5 h-2.5 ${isOnline ? 'text-brand-amberMain fill-brand-amberMain animate-pulse' : 'text-red-500 fill-red-500'}`} />
          <span className="text-xs text-brand-textMain font-medium tracking-wide">{isOnline ? 'System Online' : 'System Offline'}</span>
        </div>

        <div className="w-8 h-8 rounded-full bg-brand-elevated border border-brand-border flex items-center justify-center text-xs font-bold text-brand-amberLight">
          M
        </div>
      </div>
    </header>
  );
}
