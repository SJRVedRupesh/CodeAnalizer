import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Heart, Github, Terminal, Database, Sparkles, BookOpen, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                DSA & SQL Code Analyzer
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              A comprehensive code analysis platform built for computer science students and developers. 
              Analyze C++ Data Structures & Algorithms and SQL relational queries with instant Big-O complexity calculations, 
              AST structure decomposition, live sandbox execution, and simple English explanations.
            </p>

            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
              <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Summer Training Project 2026
              </span>
              <span>&middot;</span>
              <span>Full Stack Web Application</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 dark:text-slate-300 light:text-slate-800 mb-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/analyzer" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  C++ DSA Analyzer
                </Link>
              </li>
              <li>
                <Link to="/analyzer" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  SQL Query Analyzer
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  About & Tech Stack
                </Link>
              </li>
            </ul>
          </div>

          {/* Technologies & Source */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 dark:text-slate-300 light:text-slate-800 mb-4">
              Tech Stack & Source
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>React 18 & Vite & Tailwind</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Node.js & Express API</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Monaco Code Editor</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                <span>SQLite WebAssembly & MongoDB</span>
              </li>
              <li className="pt-2">
                <a
                  href="https://github.com/SJRVedRupesh/CodeAnalizer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  <Github className="w-3.5 h-3.5" />
                  View GitHub Repository
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 DSA & SQL Code Analyzer. Built for Academic & Technical Training Presentation.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>by SJR Ved Rupesh</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
