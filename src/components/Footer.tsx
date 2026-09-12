import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-white/10 py-6 px-4 md:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Attribution & Links */}
        <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-slate-400">
          <span className="font-semibold text-slate-300">Agent Tool Matrix</span>
          <div className="hidden md:block h-4 w-px bg-white/10" />
          <nav className="flex items-center gap-4">
            <Link href="/api/openapi.json" className="hover:text-cyan-400 transition-colors">
              OpenAPI
            </Link>
            <Link href="#" className="hover:text-purple-400 transition-colors">
              GitHub
            </Link>
            <Link href="#" className="hover:text-cyan-400 transition-colors">
              Documentation
            </Link>
          </nav>
        </div>

        {/* Status & Shortcuts */}
        <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-2 group cursor-default">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="group-hover:text-slate-300 transition-colors">All systems operational</span>
          </div>
          <div className="hidden md:block h-4 w-px bg-white/10" />
          <div className="flex items-center gap-1.5 cursor-default">
            <span>Press</span>
            <kbd className="px-2 py-0.5 text-xs font-mono bg-white/5 rounded-md border border-white/10 text-slate-300 shadow-sm">
              ?
            </kbd>
            <span>for shortcuts</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
