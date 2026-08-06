import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  Terminal, 
  Database, 
  Zap, 
  Clock, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  FileCode, 
  Share2, 
  ShieldCheck, 
  Award, 
  TrendingUp, 
  GitBranch,
  Play
} from 'lucide-react';
import ComplexityBadge from '../components/ComplexityBadge';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('cpp');

  const heroCppSnippet = `// Binary Search in C++
int binarySearch(const vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`;

  const heroSqlSnippet = `-- Department Average Salary Join
SELECT d.dept_name, COUNT(e.emp_id) AS total_emps, AVG(e.salary) AS avg_salary
FROM employees e
INNER JOIN departments d ON e.dept_id = d.dept_id
WHERE e.salary >= 80000
GROUP BY d.dept_name
ORDER BY avg_salary DESC;`;

  const features = [
    {
      icon: Cpu,
      title: 'Deep AST & Structural Analysis',
      description: 'Parses variables, data types, function signatures, loop nesting depth, STL containers, and recursion trees with high precision.',
      color: 'from-blue-500 to-indigo-500',
      badge: 'C++ & SQL'
    },
    {
      icon: Zap,
      title: 'Big-O Complexity Computation',
      description: 'Calculates exact Time Complexity (O(1), O(log n), O(n log n), O(n²)) and Space Complexity with mathematical explanations.',
      color: 'from-amber-500 to-orange-500',
      badge: 'Mathematical Big-O'
    },
    {
      icon: Play,
      title: 'Live Sandbox & SQLite Execution',
      description: 'Run C++ with custom stdin input and execute SQL queries on live multi-table HR & E-commerce databases with instant tabular results.',
      color: 'from-emerald-500 to-teal-500',
      badge: 'Real-Time Run'
    },
    {
      icon: Layers,
      title: 'SQL Execution Order Visualizer',
      description: 'Visualizes the true logical order of SQL operations (FROM & JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT).',
      color: 'from-purple-500 to-pink-500',
      badge: 'Visual Stepper'
    },
    {
      icon: TrendingUp,
      title: 'Optimization & Best Practices',
      description: 'Receive proactive tips on Fast I/O, const references, hash map vs tree map lookups, database indexing, and 3NF normalization.',
      color: 'from-cyan-500 to-blue-500',
      badge: 'Performance Tips'
    },
    {
      icon: Sparkles,
      title: 'Beginner-Friendly Explanations',
      description: 'Translates complex algorithms and intricate nested queries into clear, crystal-simple English steps suitable for college beginners.',
      color: 'from-rose-500 to-red-500',
      badge: 'Simple English'
    }
  ];

  const algorithms = [
    { name: 'Binary Search', time: 'O(log n)', space: 'O(1)', category: 'Searching' },
    { name: 'Two Pointer Technique', time: 'O(n)', space: 'O(1)', category: 'Optimization' },
    { name: 'Sliding Window', time: 'O(n)', space: 'O(1)', category: 'Subarrays' },
    { name: 'Merge Sort', time: 'O(n log n)', space: 'O(n)', category: 'Divide & Conquer' },
    { name: 'Breadth-First Search (BFS)', time: 'O(V + E)', space: 'O(V)', category: 'Graph / Tree' },
    { name: 'Depth-First Search (DFS)', time: 'O(V + E)', space: 'O(V)', category: 'Graph / Tree' },
    { name: '0/1 Knapsack DP', time: 'O(n * W)', space: 'O(n * W)', category: 'Dynamic Programming' },
    { name: 'Dijkstra Shortest Path', time: 'O((V + E) log V)', space: 'O(V + E)', category: 'Greedy' },
    { name: 'Multi-table INNER JOIN', time: 'O(N * M)', space: 'O(Result)', category: 'SQL Relational' },
    { name: 'GROUP BY & Aggregates', time: 'O(N)', space: 'O(Groups)', category: 'SQL Analytics' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 dark:bg-slate-950 light:bg-slate-50 transition-colors">
      {/* Background Gradients & Mesh */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-600/10 blur-[120px] pointer-events-none -z-10" />
        
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & Value Prop */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Summer Training Project Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                <Award className="w-3.5 h-3.5" />
                <span>Summer Training Capstone Project</span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                <span className="text-slate-400 font-normal">Presentation Ready</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white dark:text-white light:text-slate-900 leading-[1.15]">
                Instant Logic & Complexity Analysis for{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 light:from-indigo-600 light:to-purple-600">
                  C++ DSA & SQL Queries
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
                Write or paste your code. Get instant <span className="text-indigo-300 font-semibold">Big-O Time & Space Complexity</span>, 
                structural AST breakdown, live compilation & execution output, and crystal-clear explanations in simple English for college students.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 justify-center lg:justify-start">
                <Link
                  to="/analyzer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch Code Analyzer Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/about"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all"
                >
                  <FileCode className="w-4 h-4 text-indigo-400" />
                  <span>Project Overview & Architecture</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>C++17 AST Parser</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>SQLite In-Memory DB</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Monaco Editor Powered</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Mini Preview */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur-xl">
                {/* Code Header with Language Tabs */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/70">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  </div>

                  <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                    <button
                      onClick={() => setActiveTab('cpp')}
                      className={`px-3 py-1 rounded-md font-semibold transition-all ${
                        activeTab === 'cpp'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      C++ DSA
                    </button>
                    <button
                      onClick={() => setActiveTab('sql')}
                      className={`px-3 py-1 rounded-md font-semibold transition-all ${
                        activeTab === 'sql'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      SQL Query
                    </button>
                  </div>
                </div>

                {/* Code Preview Body */}
                <div className="p-4 font-mono text-xs text-indigo-200 bg-slate-950/90 overflow-x-auto max-h-56 leading-relaxed">
                  <pre className="text-slate-300">
                    <code>{activeTab === 'cpp' ? heroCppSnippet : heroSqlSnippet}</code>
                  </pre>
                </div>

                {/* Instant Analysis Output Preview */}
                <div className="p-4 border-t border-slate-800 bg-slate-900/95 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      Live Analysis Preview
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Auto-Detected
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <ComplexityBadge
                      type="time"
                      complexity={activeTab === 'cpp' ? 'O(log n)' : 'O(N)'}
                      rating={{ level: activeTab === 'cpp' ? 'Very Fast' : 'Linear (Good)' }}
                    />
                    <ComplexityBadge
                      type="space"
                      complexity={activeTab === 'cpp' ? 'O(1)' : 'O(Result)'}
                      rating={{ level: 'Optimal' }}
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                    <p className="font-semibold text-indigo-300 mb-1">
                      {activeTab === 'cpp' ? '💡 Binary Search Algorithm' : '💡 Relational Aggregation & Join'}
                    </p>
                    <p className="text-slate-400">
                      {activeTab === 'cpp'
                        ? 'Repeatedly divides the search range in half, achieving logarithmic O(log n) time complexity on sorted collections.'
                        : 'Joins employees with departments table, applies salary threshold filter, groups data by department, and sorts by average salary.'}
                    </p>
                  </div>

                  <Link
                    to="/analyzer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all"
                  >
                    <span>Open in Full IDE Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* Features Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Comprehensive Analysis Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built from the ground up for DSA & SQL Mastery
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Everything you need to understand algorithmic behavior, evaluate performance, run test queries, and ace your technical interviews and project evaluations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="group relative p-6 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900/90 transition-all hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5 backdrop-blur-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-tr ${f.color} text-white shadow-md group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {f.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800/80 bg-slate-950/40">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Pipeline Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How The Analyzer Works
          </h2>
          <p className="text-slate-400 text-sm">
            Four simple steps from raw code to complete algorithmic and query intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Write or Select Code', desc: 'Paste your C++ code or SQL query, or choose from pre-built DSA & SQL algorithm templates in Monaco Editor.' },
            { step: '02', title: 'AST & Pattern Parse', desc: 'The engine parses lexical tokens, identifies loops, recursion, STL containers, JOIN clauses, and aggregates.' },
            { step: '03', title: 'Complexity & Sandbox', desc: 'Computes Big-O Time & Space Complexity, checks edge-case risks, and runs code against live SQLite tables or compiler.' },
            { step: '04', title: 'Plain English Insights', desc: 'Generates step-by-step beginner explanation, execution order flow, optimization advice, and exportable reports.' }
          ].map((item, idx) => (
            <div key={idx} className="relative p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md">
              <span className="text-3xl font-black text-indigo-500/40 font-mono block mb-2">
                {item.step}
              </span>
              <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Algorithms & SQL Operations Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Coverage Matrix
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Supported Algorithms & Query Types
            </h2>
          </div>
          <Link
            to="/analyzer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-400 hover:text-indigo-300"
          >
            <span>Try these in the IDE</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/60 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/60 text-slate-300 text-xs uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-4">Algorithm / Operation</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Time Complexity</th>
                  <th className="p-4">Space Complexity</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                {algorithms.map((algo, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-sans font-semibold text-white">
                      {algo.name}
                    </td>
                    <td className="p-4 font-sans text-slate-400">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px]">
                        {algo.category}
                      </span>
                    </td>
                    <td className="p-4 text-emerald-400 font-bold">{algo.time}</td>
                    <td className="p-4 text-indigo-300">{algo.space}</td>
                    <td className="p-4 text-right font-sans">
                      <Link
                        to="/analyzer"
                        className="px-3 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 transition-colors text-xs font-medium"
                      >
                        Analyze
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-indigo-500/30 bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-slate-900 shadow-2xl text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to analyze your C++ & SQL code?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Launch the interactive Monaco Editor studio now. Write, run, and discover instant performance bottlenecks and step-by-step explanations.
            </p>
            <div className="pt-2">
              <Link
                to="/analyzer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-xl shadow-indigo-600/40 transition-all hover:scale-105"
              >
                <Sparkles className="w-5 h-5" />
                <span>Open Code Analyzer Studio</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
