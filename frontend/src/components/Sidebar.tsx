import { Link, useLocation } from 'react-router-dom';
import { Home, HeartPulse, BrainCircuit, BarChart3, Zap, ArrowRight, FileText } from 'lucide-react';
import clsx from 'clsx';

import uyirnadiLogo from '../assets/uyirnadi-logo.jpg';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: Home, 
    activeBg: 'bg-brand-amberMain/10', activeBorder: 'border-brand-amberMain', activeText: 'text-brand-amberMain' },
  { name: 'Risk Prediction', path: '/prediction', icon: HeartPulse, 
    activeBg: 'bg-brand-coralMain/10', activeBorder: 'border-brand-coralMain', activeText: 'text-brand-coralMain' },
  { name: 'Model Intelligence', path: '/model', icon: BrainCircuit, 
    activeBg: 'bg-brand-purpleMain/10', activeBorder: 'border-brand-purpleMain', activeText: 'text-brand-purpleMain' },
  { name: 'EDA & Analytics', path: '/eda', icon: BarChart3, 
    activeBg: 'bg-brand-cyanMain/10', activeBorder: 'border-brand-cyanMain', activeText: 'text-brand-cyanMain' },
  { name: 'Feature Insights', path: '/insights', icon: Zap, 
    activeBg: 'bg-brand-explainAmberMain/10', activeBorder: 'border-brand-explainAmberMain', activeText: 'text-brand-explainAmberMain' },
  { name: 'Documentation', path: '/documentation', icon: FileText, 
    activeBg: 'bg-brand-violetMain/10', activeBorder: 'border-brand-violetMain', activeText: 'text-brand-violetMain' }
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-72 shrink-0 bg-brand-mainBg border-r border-brand-border flex flex-col z-20 h-screen">
      <div className="h-40 flex flex-col items-center justify-center pt-8 pb-4 border-b border-brand-border">
        <img 
          src={uyirnadiLogo} 
          alt="UYIRNADI Heart Risk Intelligence Logo" 
          className="w-[180px] h-auto object-contain drop-shadow-md"
          style={{ mixBlendMode: 'lighten' }}
        />
      </div>
      
      <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'flex items-center px-4 py-3.5 text-sm font-medium rounded-r-xl transition-all duration-300 group border-l-4',
                isActive 
                  ? `${item.activeBg} ${item.activeBorder} text-brand-textMain` 
                  : 'text-brand-textSecondary hover:text-brand-textMain hover:bg-brand-secondaryBg border-transparent'
              )}
            >
              <Icon className={clsx(
                "w-5 h-5 mr-4 transition-colors", 
                isActive ? item.activeText : "text-brand-textMuted group-hover:text-brand-textSecondary"
              )} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 mb-4">
        <div className="bg-brand-elevated rounded-2xl p-5 relative overflow-hidden group border border-brand-border/50 hover:border-brand-border transition-all flex flex-col justify-between">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-20 h-20 bg-brand-amberMain/10 rounded-full blur-xl group-hover:bg-brand-amberMain/20 transition-colors pointer-events-none"></div>
          <div>
            <h3 className="text-sm font-bold text-brand-textMain leading-snug relative z-10 mb-1">
              AI for Healthier<br />Tomorrows
            </h3>
            <p className="text-[10px] text-brand-textSecondary relative z-10">Advanced risk intelligence</p>
          </div>
          <Link to="/documentation" className="mt-4 w-full py-2 rounded-lg bg-brand-secondaryBg border border-brand-border flex items-center justify-center text-xs font-medium text-brand-textMuted hover:text-brand-amberMain hover:border-brand-amberMain transition-colors relative z-10 group/btn">
            View Documentation <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
