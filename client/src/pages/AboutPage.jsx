import React from 'react';
import { 
  Code2, 
  Terminal, 
  Database, 
  Cpu, 
  Layers, 
  Zap, 
  Award, 
  CheckCircle2, 
  Github, 
  Globe, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  GitBranch,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  const techStack = [
    { category: 'Frontend', name: 'React 18 & Vite', desc: 'High performance Single Page Application framework with lightning fast Hot Module Replacement.' },
    { category: 'Editor', name: 'Monaco Editor', desc: 'The exact code editor powering Visual Studio Code with C++ and SQL syntax highlighting.' },
    { category: 'Styling', name: 'Tailwind CSS', desc: 'Modern responsive design system with dark/light themes, glassmorphism, and custom animations.' },
    { category: 'Backend', name: 'Node.js & Express', desc: 'RESTful API server orchestrating analysis engines, database execution, and history storage.' },
    { category: 'SQL Engine', name: 'SQLite (WebAssembly)', desc: 'Pure in-memory SQL database executing live relational queries on pre-seeded business schemas.' },
    { category: 'Database', name: 'MongoDB / Mongoose', desc: 'Document store for persistence of user analysis histories and saved algorithm snippets.' }
  ];

  const roadmapItems = [
    { phase: 'Phase 1 (Completed)', title: 'Core AST & Execution Engine', desc: 'Full C++ pattern analyzer, SQL query parser, Big-O inferencer, and in-memory database execution.' },
    { phase: 'Phase 2 (Completed)', title: 'Presentation IDE Studio', desc: 'Integrated Monaco Editor, dark/light theme switching, visual execution order stepper, and exportable reports.' },
    { phase: 'Phase 3 (Upcoming)', title: 'Interactive Graph & Tree Visualizer', desc: 'Interactive canvas rendering for Binary Trees, BSTs, and Graph BFS/DFS traversal steps.' },
    { phase: 'Phase 4 (Upcoming)', title: 'Multi-Language Expansion', desc: 'Extend analysis capabilities to Python, Java, and PostgreSQL dialect optimizations.' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 dark:bg-slate-950 light:bg-slate-50 transition-colors py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>Summer Training Project Presentation</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            About DSA & SQL Code Analyzer
          </h1>

          <p className="text-slate-400 text-base leading-relaxed">
            An advanced developer intelligence and learning platform engineered to bridge the gap between writing code and truly understanding its runtime complexity, AST structure, and execution flow.
          </p>
        </div>

        {/* Project Objectives & Problem Statement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Project Objective</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              To provide computer science students and engineers with an automated tool that evaluates C++ Data Structures & Algorithms and SQL queries in real-time, delivering Big-O complexity computations, structural insights, and plain English explanations without relying on opaque black-box tools.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Why It Matters for Beginners</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Traditional compilers only check for syntax correctness, leaving beginners in the dark about nested loop bottlenecks, hidden O(N) STL copies, and SQL logical execution order. This analyzer makes invisible execution mechanics intuitive and visual.
            </p>
          </div>
        </div>

        {/* System Architecture Diagram */}
        <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                System Design
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">
                Full-Stack Architecture Overview
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              Modular Micro-Engine
            </span>
          </div>

          {/* Architecture Visual Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {/* Box 1: Client UI */}
            <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/10 space-y-2">
              <span className="text-xs font-bold text-indigo-300 uppercase block font-sans">
                1. Presentation Client
              </span>
              <p className="text-white font-semibold font-sans">React 18 + Vite</p>
              <ul className="text-slate-300 space-y-1 text-[11px]">
                <li>• Monaco Editor Studio</li>
                <li>• Real-Time AST Visualizer</li>
                <li>• Big-O Complexity Badges</li>
                <li>• SQL Execution Flow Stepper</li>
              </ul>
            </div>

            {/* Box 2: API & Analysis Engines */}
            <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/10 space-y-2">
              <span className="text-xs font-bold text-purple-300 uppercase block font-sans">
                2. Backend Logic Core
              </span>
              <p className="text-white font-semibold font-sans">Express.js Analysis Engine</p>
              <ul className="text-slate-300 space-y-1 text-[11px]">
                <li>• C++ Lexical & AST Parser</li>
                <li>• Big-O Time/Space Deductor</li>
                <li>• SQL Query Clause Extractor</li>
                <li>• Beginner Explanation Generator</li>
              </ul>
            </div>

            {/* Box 3: Execution & DB Sandbox */}
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-2">
              <span className="text-xs font-bold text-emerald-300 uppercase block font-sans">
                3. Execution & Storage
              </span>
              <p className="text-white font-semibold font-sans">SQLite & Compiler Sandbox</p>
              <ul className="text-slate-300 space-y-1 text-[11px]">
                <li>• WebAssembly SQLite DB</li>
                <li>• Multi-table Pre-seeded Schemas</li>
                <li>• G++ Compiler Process Runner</li>
                <li>• MongoDB Analysis History</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tech Stack Matrix */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Technology Stack
            </span>
            <h3 className="text-2xl font-bold text-white">
              Tools & Technologies Powering the App
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStack.map((tech, i) => (
              <div key={i} className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10">
                  {tech.category}
                </span>
                <h4 className="text-base font-bold text-white">{tech.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Future Scope & Roadmap */}
        <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Evolution & Expansion
            </span>
            <h3 className="text-2xl font-bold text-white mt-1">
              Future Scope & Project Roadmap
            </h3>
          </div>

          <div className="space-y-4">
            {roadmapItems.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-400">{item.phase}</span>
                    <span className="text-sm font-bold text-white">{item.title}</span>
                  </div>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
                {item.phase.includes('Completed') ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold flex items-center gap-1 shrink-0 w-fit">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Delivered
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold shrink-0 w-fit">
                    Planned
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Presentation Ready CTA Card */}
        <div className="p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-900/60 to-purple-900/60 text-center space-y-4 shadow-2xl">
          <h3 className="text-2xl font-bold text-white">
            Summer Training Project 2026 &middot; Code Analyzer
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Built by SJR Ved Rupesh for academic evaluation and developer assistance. 
            Ready to test live C++ algorithms and SQL queries in action.
          </p>
          <div className="pt-2">
            <Link
              to="/analyzer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg hover:scale-105"
            >
              <span>Launch Analyzer Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
