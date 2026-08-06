import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Code2, 
  Terminal, 
  Database, 
  Info, 
  Sun, 
  Moon, 
  Github, 
  Menu, 
  X, 
  Sparkles,
  Award
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/', icon: Code2 },
    { name: 'Code Analyzer', path: '/analyzer', icon: Terminal },
    { name: 'About Project', path: '/about', icon: Info },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 dark:bg-slate-950/80 light:bg-white/80 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 dark:bg-slate-950 light:bg-white rounded-[10px] flex items-center justify-center">
                <Code2 className="w-5 h-5 text-indigo-400 dark:text-indigo-400 light:text-indigo-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 light:from-indigo-600 light:to-purple-700">
                  DSA & SQL
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Analyzer
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:block">
                AST & Logic Engine
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-indigo-600/15 text-indigo-400 dark:text-indigo-400 light:text-indigo-600 font-semibold border border-indigo-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 light:hover:text-slate-900 hover:bg-slate-800/40 light:hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Summer Training Project Tag */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium">
              <Award className="w-3.5 h-3.5" />
              <span>Summer Training 2026</span>
            </div>

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 border border-slate-800 light:border-slate-200 transition-all"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* GitHub Repo */}
            <a
              href="https://github.com/SJRVedRupesh/CodeAnalizer"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800 transition-colors"
              title="View on GitHub"
            >
              <Github className="w-4 h-4" />
            </a>

            {/* CTA Open Studio */}
            <Link
              to="/analyzer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Studio</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 dark:bg-slate-950/95 light:bg-white p-4 space-y-3 animate-in slide-in-from-top-4">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-indigo-600/20 text-indigo-400 font-semibold border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
            <Link
              to="/analyzer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              <Sparkles className="w-4 h-4" />
              Launch Code Analyzer
            </Link>
            <a
              href="https://github.com/SJRVedRupesh/CodeAnalizer"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-slate-400 bg-slate-900 border border-slate-800"
            >
              <Github className="w-4 h-4" />
              GitHub Repository
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
