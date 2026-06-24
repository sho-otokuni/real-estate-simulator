'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/tools/surface-yield', label: '表面利回り計算' },
  { href: '/tools/net-yield', label: '実質利回り計算' },
  { href: '/tools/cashflow', label: 'ローン・CF計算' },
  { href: '/guide', label: '不動産投資の基礎' },
  { href: '/articles', label: 'コラム' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-base sm:text-lg text-white hover:text-blue-300 transition-colors flex items-center gap-2"
        >
          <span className="text-blue-400">🏠</span>
          <span>不動産投資シミュレーター</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                pathname === link.href
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded hover:bg-slate-700 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'メニューを閉じる' : 'メニューを開く'}
        >
          <div className="space-y-1.5">
            <span
              className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
            />
            <span className={`block w-6 h-0.5 bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
            <span
              className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
            />
          </div>
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="md:hidden bg-slate-800 border-t border-slate-700">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-3 text-sm border-b border-slate-700 transition-colors ${
                pathname === link.href
                  ? 'bg-blue-700 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
