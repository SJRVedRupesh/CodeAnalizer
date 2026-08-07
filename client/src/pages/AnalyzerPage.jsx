import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  Sparkles, 
  RotateCcw, 
  Copy, 
  Check, 
  Database, 
  Terminal, 
  Code2, 
  Download, 
  Layers, 
  BookOpen, 
  AlertTriangle, 
  Cpu, 
  Table, 
  HelpCircle, 
  Sliders, 
  FileText, 
  RefreshCw, 
  ChevronRight, 
  Zap,
  ShieldAlert,
  Share2,
  CheckCircle2,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../context/ThemeContext';
import { 
  analyzeCppApi, 
  analyzeSqlApi, 
  runCppApi, 
  runSqlApi, 
  getTemplatesApi, 
  saveHistoryApi 
} from '../services/api';
import ComplexityBadge from '../components/ComplexityBadge';
import SchemaExplorerModal from '../components/SchemaExplorerModal';

const DEFAULT_CPP_BASE = `#include <iostream>
using namespace std;

int main() {
    // This statement prints "Hello World"
    cout << "Hello World";

    return 0;
}`;

const DEFAULT_SQL_BASE = `-- Write your SQL query here
SELECT * FROM employees LIMIT 5;`;

export default function AnalyzerPage() {
  const { isDark } = useTheme();

  // Core State
  const [language, setLanguage] = useState('cpp'); // 'cpp' | 'sql'
  const [code, setCode] = useState(DEFAULT_CPP_BASE);
  const [customInput, setCustomInput] = useState('');
  const [showInputPanel, setShowInputPanel] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [templates, setTemplates] = useState({ cpp: [], sql: [] });

  // Processing & State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [runResult, setRunResult] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'explanation' | 'ast' | 'executionOrder' | 'optimizations' | 'output'
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Modals
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);

  // Load Templates on Mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await getTemplatesApi();
      if (res.templates) {
        setTemplates(res.templates);
      }
    } catch (e) {
      console.warn('Unable to load templates from server, using local default');
    }
  };

  // Switch Language
  const handleLanguageChange = (newLang) => {
    if (newLang === language) return;
    setLanguage(newLang);
    setAnalysisResult(null);
    setRunResult(null);
    setErrorMsg(null);
    setActiveTab('overview');
    setCode(newLang === 'cpp' ? DEFAULT_CPP_BASE : DEFAULT_SQL_BASE);
  };

  // Load a selected template
  const handleSelectTemplate = (templateId) => {
    const list = templates[language] || [];
    const found = list.find(t => t.id === templateId);
    if (found) {
      setCode(found.code);
      setAnalysisResult(null);
      setRunResult(null);
      setErrorMsg(null);
    }
  };

  // Trigger Code Analysis
  const handleAnalyze = async () => {
    if (!code || !code.trim()) {
      setErrorMsg('Please write or paste code before analyzing.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      let res;
      if (language === 'cpp') {
        res = await analyzeCppApi(code);
      } else {
        res = await analyzeSqlApi(code);
      }

      if (res.success) {
        setAnalysisResult(res.analysis);
        setActiveTab('overview');

        // Trigger celebratory confetti
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.8 }
        });

        // Silently save analysis to history
        saveHistoryApi({
          language,
          code,
          summary: res.analysis.summary,
          complexity: res.analysis.complexity,
          explanationSteps: res.analysis.explanationSteps,
          suggestions: res.analysis.suggestions || res.analysis.optimizationTips
        }).catch(() => {});
      } else {
        setErrorMsg(res.error || 'Failed to analyze code.');
      }
    } catch (err) {
      if (err.message === 'Network Error' || !err.response) {
        setErrorMsg('Network Error: Unable to connect to the backend server (http://localhost:5000). Please ensure the backend is running with "npm start --prefix server".');
      } else {
        setErrorMsg(err.response?.data?.error || err.message || 'Error communicating with analysis engine.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Trigger Code Run
  const handleRun = async () => {
    if (!code || !code.trim()) {
      setErrorMsg('Please write or paste code before running.');
      return;
    }

    setIsRunning(true);
    setErrorMsg(null);

    try {
      let res;
      if (language === 'cpp') {
        res = await runCppApi(code, customInput);
      } else {
        res = await runSqlApi(code);
      }

      setRunResult(res);
      setActiveTab('output');
    } catch (err) {
      if (err.message === 'Network Error' || !err.response) {
        setErrorMsg('Network Error: Unable to connect to the backend server (http://localhost:5000). Please ensure the backend is running with "npm start --prefix server".');
      } else {
        setErrorMsg(err.response?.data?.error || err.message || 'Error running code.');
      }
    } finally {
      setIsRunning(false);
    }
  };

  // Copy Code to Clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Clear Code
  const handleClear = () => {
    setCode('');
    setAnalysisResult(null);
    setRunResult(null);
    setErrorMsg(null);
  };

  // Export Analysis as Markdown Report
  const handleExportReport = () => {
    if (!analysisResult) return;

    let md = `# DSA & SQL Code Analyzer Report\n`;
    md += `**Language:** ${language.toUpperCase()}\n`;
    md += `**Date:** ${new Date().toLocaleString()}\n\n`;
    
    md += `## 1. Code Analyzed\n\`\`\`${language}\n${code}\n\`\`\`\n\n`;

    if (language === 'cpp' && analysisResult.complexity) {
      md += `## 2. Complexity Analysis\n`;
      md += `- **Time Complexity:** ${analysisResult.complexity.time} (${analysisResult.complexity.timeReason})\n`;
      md += `- **Space Complexity:** ${analysisResult.complexity.space} (${analysisResult.complexity.spaceReason})\n\n`;
    }

    if (analysisResult.explanationSteps) {
      md += `## 3. Step-by-Step Explanation\n`;
      analysisResult.explanationSteps.forEach(step => {
        md += `### ${step.title}\n${step.content}\n\n`;
      });
    }

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code_analysis_${language}_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-slate-950 dark:bg-slate-950 light:bg-slate-50 transition-colors">
      {/* Top Toolbar */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: Language Tabs & Template Selector */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
              <button
                onClick={() => handleLanguageChange('cpp')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  language === 'cpp'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>C++ DSA</span>
              </button>

              <button
                onClick={() => handleLanguageChange('sql')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  language === 'sql'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>SQL Query</span>
              </button>
            </div>

            {/* Template Selector Dropdown */}
            <div className="relative">
              <select
                onChange={(e) => handleSelectTemplate(e.target.value)}
                className="bg-slate-950 text-xs font-medium text-slate-300 border border-slate-800 rounded-xl px-3 py-2 pr-8 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>Load Algorithm / Query Template...</option>
                {(templates[language] || []).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.paradigm || t.timeComplexity || 'Template'})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <ChevronRight className="w-3.5 h-3.5 rotate-90" />
              </div>
            </div>

            {/* SQL Schema Explorer Trigger */}
            {language === 'sql' && (
              <button
                onClick={() => setIsSchemaModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-colors"
                title="Browse Database Tables & Sample Data"
              >
                <Table className="w-3.5 h-3.5" />
                <span>Schema Explorer</span>
              </button>
            )}

            {/* Custom Stdin Input Trigger for C++ */}
            {language === 'cpp' && (
              <button
                onClick={() => setShowInputPanel(!showInputPanel)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                  showInputPanel
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Custom Input (stdin)</span>
              </button>
            )}
          </div>

          {/* Right: Actions (Analyze, Run, Copy, Clear, Export) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-950 border border-slate-800 transition-colors"
              title="Copy Code"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handleClear}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 bg-slate-950 border border-slate-800 transition-colors"
              title="Clear Editor"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {analysisResult && (
              <button
                onClick={handleExportReport}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition-colors"
                title="Export Analysis Report as Markdown"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Export Report</span>
              </button>
            )}

            {/* Run Code Button */}
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
            >
              {isRunning ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-white" />
              )}
              <span>Run Code</span>
            </button>

            {/* Analyze Code Button */}
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50"
            >
              {isAnalyzing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>Analyze Code</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Workspace Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Pane: Code Editor & Input Drawer */}
        <div className="w-full lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950">
          
          {/* Monaco Editor Container */}
          <div className="flex-1 min-h-[380px] lg:min-h-[500px] relative">
            <Editor
              height="100%"
              language={language === 'cpp' ? 'cpp' : 'sql'}
              theme={isDark ? 'vs-dark' : 'light'}
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                fontSize: fontSize,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
                cursorBlinking: 'smooth',
                lineNumbers: 'on',
                bracketPairColorization: { enabled: true },
                formatOnPaste: true,
              }}
            />
          </div>

          {/* Stdin Custom Input Drawer (Optional for C++) */}
          {showInputPanel && language === 'cpp' && (
            <div className="border-t border-slate-800 bg-slate-900/90 p-3 space-y-1.5 animate-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>Standard Input (stdin)</span>
                <span className="text-[11px] text-slate-500">Provide input values separated by spaces or newlines</span>
              </div>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="e.g. 5 10 20 30 40 50"
                rows={2}
                className="w-full bg-slate-950 text-xs font-mono text-slate-200 border border-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {/* Editor Status Footer */}
          <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-3">
              <span>Lines: {code.split('\n').length}</span>
              <span>Chars: {code.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setFontSize(prev => Math.max(11, prev - 1))}
                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-xs"
                title="Decrease Font Size"
              >
                A-
              </button>
              <span>{fontSize}px</span>
              <button 
                onClick={() => setFontSize(prev => Math.min(22, prev + 1))}
                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-xs"
                title="Increase Font Size"
              >
                A+
              </button>
            </div>
          </div>
        </div>

        {/* Right Pane: Analysis & Execution Studio */}
        <div className="w-full lg:w-1/2 flex flex-col bg-slate-950/60 overflow-hidden">
          
          {/* Studio Navigation Tabs */}
          <div className="border-b border-slate-800 bg-slate-900/70 px-4 flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-1.5 px-3 py-3 border-b-2 text-xs font-bold whitespace-nowrap transition-colors ${
                activeTab === 'overview'
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Overview & Complexity</span>
            </button>

            <button
              onClick={() => setActiveTab('explanation')}
              className={`flex items-center gap-1.5 px-3 py-3 border-b-2 text-xs font-bold whitespace-nowrap transition-colors ${
                activeTab === 'explanation'
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Plain English Breakdown</span>
            </button>

            <button
              onClick={() => setActiveTab('ast')}
              className={`flex items-center gap-1.5 px-3 py-3 border-b-2 text-xs font-bold whitespace-nowrap transition-colors ${
                activeTab === 'ast'
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Structure & AST</span>
            </button>

            {language === 'sql' && (
              <button
                onClick={() => setActiveTab('executionOrder')}
                className={`flex items-center gap-1.5 px-3 py-3 border-b-2 text-xs font-bold whitespace-nowrap transition-colors ${
                  activeTab === 'executionOrder'
                    ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Execution Order</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('optimizations')}
              className={`flex items-center gap-1.5 px-3 py-3 border-b-2 text-xs font-bold whitespace-nowrap transition-colors ${
                activeTab === 'optimizations'
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Optimizations & Safety</span>
            </button>

            <button
              onClick={() => setActiveTab('output')}
              className={`flex items-center gap-1.5 px-3 py-3 border-b-2 text-xs font-bold whitespace-nowrap transition-colors ${
                activeTab === 'output'
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Live Output {runResult && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}</span>
            </button>
          </div>

          {/* Studio Content Body */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {/* Error Banner */}
            {errorMsg && (
              <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Analysis Notice</p>
                  <p className="mt-0.5">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* TAB 1: OVERVIEW & COMPLEXITY */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in">
                {analysisResult ? (
                  <>
                    {/* Complexity Cards */}
                    {language === 'cpp' && analysisResult.complexity && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-indigo-400" />
                          Theoretical Big-O Complexity
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <ComplexityBadge
                            type="time"
                            complexity={analysisResult.complexity.time}
                            rating={analysisResult.complexity.rating}
                            reason={analysisResult.complexity.timeReason}
                          />
                          <ComplexityBadge
                            type="space"
                            complexity={analysisResult.complexity.space}
                            rating={{ level: 'Memory Allocation' }}
                            reason={analysisResult.complexity.spaceReason}
                          />
                        </div>
                      </div>
                    )}

                    {language === 'sql' && (
                      <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                            SQL Query Classification
                          </span>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200">
                            {analysisResult.estimatedComplexity}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white mb-1">{analysisResult.queryType}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{analysisResult.complexityReason}</p>
                      </div>
                    )}

                    {/* Structural Metrics Grid */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                        Code Structure Metrics
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {language === 'cpp' ? (
                          <>
                            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                              <span className="text-xs text-slate-400 block">Functions</span>
                              <span className="text-xl font-bold font-mono text-white mt-1 block">
                                {analysisResult.summary?.functionsCount ?? 0}
                              </span>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                              <span className="text-xs text-slate-400 block">Total Loops</span>
                              <span className="text-xl font-bold font-mono text-white mt-1 block">
                                {analysisResult.summary?.loopsCount ?? 0}
                              </span>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                              <span className="text-xs text-slate-400 block">Nesting Depth</span>
                              <span className="text-xl font-bold font-mono text-indigo-400 mt-1 block">
                                {analysisResult.summary?.loopDepth ?? 0}
                              </span>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                              <span className="text-xs text-slate-400 block">STL Containers</span>
                              <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
                                {analysisResult.summary?.stlCount ?? 0}
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                              <span className="text-xs text-slate-400 block">Tables Used</span>
                              <span className="text-xl font-bold font-mono text-white mt-1 block">
                                {analysisResult.queryStats?.tablesCount ?? 0}
                              </span>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                              <span className="text-xs text-slate-400 block">Joins</span>
                              <span className="text-xl font-bold font-mono text-indigo-400 mt-1 block">
                                {analysisResult.queryStats?.joinsCount ?? 0}
                              </span>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                              <span className="text-xs text-slate-400 block">Columns</span>
                              <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
                                {analysisResult.queryStats?.columnsCount ?? 0}
                              </span>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                              <span className="text-xs text-slate-400 block">Execution Steps</span>
                              <span className="text-xl font-bold font-mono text-purple-400 mt-1 block">
                                {analysisResult.executionOrder?.length ?? 0}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Algorithmic Paradigms & Detected Concepts */}
                    {analysisResult.conceptsUsed?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                          Algorithmic Paradigms & Key Concepts
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.conceptsUsed.map((concept, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold"
                            >
                              {concept}
                            </span>
                          ))}
                          {(analysisResult.paradigms || []).map((paradigm, i) => (
                            <span
                              key={`p-${i}`}
                              className="px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold"
                            >
                              {paradigm}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">No Analysis Generated Yet</h4>
                      <p className="text-xs text-slate-400 max-w-sm mt-1">
                        Click the <span className="text-indigo-400 font-semibold">"Analyze Code"</span> button above to trigger full AST parsing and complexity calculation.
                      </p>
                    </div>
                    <button
                      onClick={handleAnalyze}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-all"
                    >
                      Run Static Analysis
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PLAIN ENGLISH BREAKDOWN */}
            {activeTab === 'explanation' && (
              <div className="space-y-4 animate-in fade-in">
                {analysisResult?.explanationSteps?.length > 0 ? (
                  analysisResult.explanationSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-800 bg-slate-900/70 backdrop-blur-md space-y-2"
                    >
                      <h5 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs text-indigo-400 font-mono">
                          {idx + 1}
                        </span>
                        {step.title}
                      </h5>
                      <p className="text-xs text-slate-300 leading-relaxed pl-8">
                        {step.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-12">
                    Click "Analyze Code" to generate step-by-step plain English explanations.
                  </p>
                )}
              </div>
            )}

            {/* TAB 3: STRUCTURE & AST DETAILS */}
            {activeTab === 'ast' && (
              <div className="space-y-6 animate-in fade-in">
                {analysisResult ? (
                  <>
                    {language === 'cpp' ? (
                      <>
                        {/* Functions List */}
                        <div>
                          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                            Functions Defined ({analysisResult.functions?.length || 0})
                          </h5>
                          <div className="space-y-2">
                            {(analysisResult.functions || []).map((fn, i) => (
                              <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs flex items-center justify-between">
                                <div>
                                  <span className="text-indigo-400 font-semibold">{fn.returnType}</span>{' '}
                                  <span className="text-white font-bold">{fn.name}</span>
                                  <span className="text-slate-400">({fn.parameters.join(', ')})</span>
                                </div>
                                {fn.isRecursive && (
                                  <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                                    Recursive
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* STL Containers */}
                        {analysisResult.stlUsed?.length > 0 && (
                          <div>
                            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                              Standard Template Library (STL) Containers
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {analysisResult.stlUsed.map((stl, i) => (
                                <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center justify-between">
                                  <span className="font-mono font-bold text-emerald-400">std::{stl.name}</span>
                                  <span className="text-[11px] text-slate-400">{stl.category}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Variables Detected */}
                        {analysisResult.variables?.length > 0 && (
                          <div>
                            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                              Declared Variables ({analysisResult.variables.length})
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {analysisResult.variables.map((v, i) => (
                                <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300">
                                  <span className="text-indigo-400 font-semibold">{v.type}</span> {v.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {/* SQL Tables & Joins */}
                        <div>
                          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                            Target Tables & Aliases
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {(analysisResult.tables || []).map((t, i) => (
                              <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white">
                                📁 {t.name} {t.alias && <span className="text-indigo-400">(AS {t.alias})</span>}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Joins Detail */}
                        {analysisResult.joins?.length > 0 && (
                          <div>
                            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                              Joins Configured
                            </h5>
                            <div className="space-y-2">
                              {analysisResult.joins.map((j, i) => (
                                <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
                                  <div className="text-purple-400 font-bold">{j.type} ➔ {j.table}</div>
                                  <div className="text-slate-400 text-[11px] mt-1">ON {j.condition}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-12">
                    Click "Analyze Code" to view structural AST components.
                  </p>
                )}
              </div>
            )}

            {/* TAB 4: SQL EXECUTION ORDER */}
            {activeTab === 'executionOrder' && language === 'sql' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
                  <p className="font-semibold">💡 Did you know?</p>
                  <p className="text-slate-400 mt-0.5">
                    SQL queries are NOT executed in written order (SELECT first). Databases evaluate FROM and JOIN first to assemble records before filtering, grouping, and finally projecting columns!
                  </p>
                </div>

                {analysisResult?.executionOrder?.length > 0 ? (
                  <div className="relative pl-6 border-l-2 border-indigo-500/30 space-y-6 my-4">
                    {analysisResult.executionOrder.map((step, idx) => (
                      <div key={idx} className="relative">
                        {/* Step Marker Dot */}
                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-indigo-600 border-2 border-slate-950 flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-white">{step.title}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">
                              PHASE: {step.phase}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed mt-1">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-12">
                    Analyze a SQL query to see its logical execution order flowchart.
                  </p>
                )}
              </div>
            )}

            {/* TAB 5: OPTIMIZATIONS & SAFETY */}
            {activeTab === 'optimizations' && (
              <div className="space-y-6 animate-in fade-in">
                {analysisResult ? (
                  <>
                    {/* Optimization Suggestions */}
                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        Performance & Optimization Advice
                      </h5>
                      <div className="space-y-3">
                        {(analysisResult.suggestions || analysisResult.optimizationTips || []).map((sug, i) => (
                          <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white">{sug.title}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                                {sug.category || 'Optimization'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed mt-1">
                              {sug.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Edge Cases & Safety Warnings */}
                    {analysisResult.edgeCases?.length > 0 && (
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          Critical Edge Cases & Pitfalls to Check
                        </h5>
                        <ul className="space-y-2">
                          {analysisResult.edgeCases.map((ec, i) => (
                            <li key={i} className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2">
                              <span className="font-bold">•</span>
                              <span>{ec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* SQL Indexing Recommendations */}
                    {analysisResult.indexingSuggestions?.length > 0 && (
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                          Database Indexing Recommendations
                        </h5>
                        <div className="space-y-2">
                          {analysisResult.indexingSuggestions.map((idxRec, i) => (
                            <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                              <span className="font-mono font-bold text-indigo-400">{idxRec.table}</span>
                              <p className="text-slate-300 text-xs">{idxRec.recommendation}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-12">
                    Click "Analyze Code" to see performance improvements and safety suggestions.
                  </p>
                )}
              </div>
            )}

            {/* TAB 6: LIVE OUTPUT */}
            {activeTab === 'output' && (
              <div className="space-y-4 animate-in fade-in">
                {runResult ? (
                  <>
                    {/* Execution Meta Bar */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${runResult.success ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                        <span className="font-bold text-white">
                          {runResult.success ? 'Execution Succeeded' : (runResult.type || 'Execution Error')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-400 font-mono">
                        {runResult.rowCount !== undefined && (
                          <span>{runResult.rowCount} rows returned</span>
                        )}
                        <span>{runResult.executionTimeMs} ms</span>
                      </div>
                    </div>

                    {/* Output Viewer: SQL Table or Terminal stdout */}
                    {language === 'sql' && runResult.columns && runResult.columns.length > 0 ? (
                      <div className="border border-slate-800 rounded-xl overflow-x-auto bg-slate-950/80 max-h-96">
                        <table className="w-full text-left text-xs font-mono">
                          <thead className="bg-slate-800/60 text-indigo-300 border-b border-slate-800 font-semibold sticky top-0">
                            <tr>
                              {runResult.columns.map((col, idx) => (
                                <th key={idx} className="p-3 whitespace-nowrap">
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 text-slate-200">
                            {runResult.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-800/20">
                                {row.map((val, cIdx) => (
                                  <td key={cIdx} className="p-3 whitespace-nowrap">
                                    {val === null ? <span className="text-slate-500 italic">NULL</span> : String(val)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 whitespace-pre-wrap overflow-x-auto min-h-[160px] leading-relaxed">
                        {runResult.output || runResult.error || runResult.message || 'No output produced.'}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Play className="w-7 h-7 fill-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">No Execution Results Yet</h4>
                      <p className="text-xs text-slate-400 max-w-sm mt-1">
                        Click the <span className="text-emerald-400 font-semibold">"Run Code"</span> button above to compile C++ or query live SQLite tables.
                      </p>
                    </div>
                    <button
                      onClick={handleRun}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all"
                    >
                      Run Now
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Schema Explorer Modal */}
      <SchemaExplorerModal
        isOpen={isSchemaModalOpen}
        onClose={() => setIsSchemaModalOpen(false)}
        onSelectTable={(tableName) => {
          setCode(prev => `SELECT * FROM ${tableName} LIMIT 10;`);
        }}
      />
    </div>
  );
}
