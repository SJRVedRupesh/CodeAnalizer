import React, { useState, useEffect } from 'react';
import { Database, Table, X, RefreshCw, Key, ChevronRight, Hash, Type } from 'lucide-react';
import { getSchemasApi } from '../services/api';

export default function SchemaExplorerModal({ isOpen, onClose, onSelectTable }) {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchSchemas();
    }
  }, [isOpen]);

  const fetchSchemas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getSchemasApi();
      if (res.tables && res.tables.length > 0) {
        setTables(res.tables);
        setSelectedTable(res.tables[0]);
      }
    } catch (err) {
      setError('Unable to load database schemas. Backend might be starting.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl border border-slate-700/60 bg-slate-900 shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Live Database Schema Explorer
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  SQLite In-Memory
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Explore pre-seeded tables, column types, and sample records for your SQL queries
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchSchemas}
              title="Refresh Schema"
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Table List Sidebar */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/40 p-4 overflow-y-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 block mb-2">
              Available Tables ({tables.length})
            </span>

            <div className="space-y-1">
              {tables.map((t) => (
                <button
                  key={t.tableName}
                  onClick={() => setSelectedTable(t)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all ${
                    selectedTable?.tableName === t.tableName
                      ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Table className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="truncate">{t.tableName}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    {t.columns.length} cols
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Table Detail View */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {selectedTable ? (
              <>
                {/* Table Header Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-mono font-bold text-white flex items-center gap-2">
                      <Table className="w-5 h-5 text-indigo-400" />
                      {selectedTable.tableName}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {selectedTable.columns.length} columns &middot; Ready for SELECT, JOIN, & Aggregations
                    </p>
                  </div>

                  {onSelectTable && (
                    <button
                      onClick={() => {
                        onSelectTable(selectedTable.tableName);
                        onClose();
                      }}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all flex items-center gap-1.5"
                    >
                      Insert `FROM {selectedTable.tableName}`
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Columns Definition */}
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Column Structure & Data Types
                  </h5>
                  <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-800/60 text-slate-300 border-b border-slate-800 font-semibold">
                        <tr>
                          <th className="p-3">Column Name</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Primary Key</th>
                          <th className="p-3">Nullable</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono">
                        {selectedTable.columns.map((col) => (
                          <tr key={col.name} className="hover:bg-slate-800/30">
                            <td className="p-3 font-semibold text-indigo-300 flex items-center gap-2">
                              {col.isPk ? <Key className="w-3.5 h-3.5 text-amber-400" /> : <Hash className="w-3.5 h-3.5 text-slate-500" />}
                              {col.name}
                            </td>
                            <td className="p-3 text-slate-400">{col.type || 'ANY'}</td>
                            <td className="p-3">
                              {col.isPk ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  PRIMARY KEY
                                </span>
                              ) : (
                                <span className="text-slate-600">-</span>
                              )}
                            </td>
                            <td className="p-3 text-slate-400">
                              {col.notnull ? 'NO (Required)' : 'YES'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Sample Rows Data Preview */}
                {selectedTable.sampleRows?.rows?.length > 0 && (
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Sample Data (First {selectedTable.sampleRows.rows.length} Rows)
                    </h5>
                    <div className="border border-slate-800 rounded-xl overflow-x-auto bg-slate-950/60">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-slate-800/40 text-slate-300 border-b border-slate-800">
                          <tr>
                            {selectedTable.sampleRows.columns.map((c) => (
                              <th key={c} className="p-2.5 whitespace-nowrap">
                                {c}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40 text-slate-300">
                          {selectedTable.sampleRows.rows.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-800/20">
                              {row.map((val, colIdx) => (
                                <td key={colIdx} className="p-2.5 whitespace-nowrap text-slate-300">
                                  {val === null ? <span className="text-slate-500 italic">NULL</span> : String(val)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                <Table className="w-8 h-8 opacity-40 mb-2" />
                <p className="text-sm">Select a table to preview structure and records</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
}
