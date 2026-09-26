import React from 'react';
import { TelemetryData } from '../types';
import { Gauge, CheckCircle2, Search, Zap } from 'lucide-react';

interface TokenGaugeProps {
  telemetry: TelemetryData;
}

export const TokenGauge: React.FC<TokenGaugeProps> = ({ telemetry }) => {
  const percentUsed = Math.min(100, Math.max(0, (telemetry.totalTokens / telemetry.tokenBudget) * 100));
  const isWellUnder = telemetry.totalTokens < 10000;

  return (
    <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-medium text-slate-300">
            TOKEN EFFICIENCY & BUDGET AUDIT
          </span>
          <span className="text-xs text-slate-500 font-mono hidden md:inline">
            · Strict Ceiling: 25,000 Tokens
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className={`inline-flex items-center gap-1.5 ${isWellUnder ? 'text-emerald-400' : 'text-amber-400'}`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{telemetry.efficiencyRating}</span>
          </span>
        </div>
      </div>

      {/* Progress Bar with 25k Ceiling Markers */}
      <div className="space-y-1.5 mb-3">
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${Math.max(percentUsed, 3)}%` }}
            className={`h-full transition-all duration-500 ${
              isWellUnder ? 'bg-gradient-to-r from-emerald-500 to-sky-500' : 'bg-amber-500'
            }`}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] font-mono text-slate-500">
          <span>0 tokens</span>
          <span className="text-slate-400 font-medium">
            Consumed: {telemetry.totalTokens.toLocaleString()} / {telemetry.tokenBudget.toLocaleString()}
          </span>
          <span>25k ceiling</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 text-xs font-mono">
        <div>
          <span className="text-slate-500 block text-[11px]">Prompt & Ingest</span>
          <span className="text-slate-200 font-medium">{telemetry.estimatedPromptTokens.toLocaleString()} tokens</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[11px]">Generation</span>
          <span className="text-slate-200 font-medium">{telemetry.estimatedCompletionTokens.toLocaleString()} tokens</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[11px]">Budget Headroom</span>
          <span className="text-emerald-400 font-medium">+{telemetry.tokenBudgetRemaining.toLocaleString()} tokens</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[11px]">Latency & Tool Exec</span>
          <span className="text-slate-200 font-medium flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400 inline" />
            {(telemetry.executionDurationMs / 1000).toFixed(2)}s
          </span>
        </div>
      </div>

      {/* Search Grounding Details if queries were run */}
      {telemetry.searchQueries && telemetry.searchQueries.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-start gap-2 text-[11px] font-mono text-slate-400">
          <Search className="w-3.5 h-3.5 text-sky-400 mt-0.5 shrink-0" />
          <div className="flex-1">
            <span className="text-slate-500 mr-1.5">Grounded Web Search executed:</span>
            <span className="text-sky-300">
              {telemetry.searchQueries.join(' · ')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
