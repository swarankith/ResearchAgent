import React from 'react';
import { BENCHMARK_PAPERS, BenchmarkPaper } from '../data/benchmarks';
import { Sparkles, ArrowRight } from 'lucide-react';

interface BenchmarkSelectorProps {
  onSelect: (paper: BenchmarkPaper) => void;
  selectedId?: string;
  disabled?: boolean;
}

export const BenchmarkSelector: React.FC<BenchmarkSelectorProps> = ({
  onSelect,
  selectedId,
  disabled,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
        <span className="flex items-center gap-1.5 text-slate-300 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>Curated Peer-Reviewed Benchmarks (1-Click Instant Analysis)</span>
        </span>
        <span className="text-slate-500 hidden sm:inline">Select to inspect decomposed architecture</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {BENCHMARK_PAPERS.map(paper => {
          const isSelected = selectedId === paper.id;
          return (
            <button
              key={paper.id}
              onClick={() => onSelect(paper)}
              disabled={disabled}
              className={`p-3 rounded-xl border text-left transition-all relative group flex flex-col justify-between ${
                isSelected
                  ? 'border-sky-500 bg-sky-950/20 shadow-xs'
                  : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/80'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5 text-[11px] font-mono">
                  <span className="text-sky-400 font-medium">{paper.badge}</span>
                  <span className="text-slate-500">{paper.year}</span>
                </div>
                <h4 className="text-xs font-semibold text-slate-200 group-hover:text-white line-clamp-1 mb-1">
                  {paper.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  {paper.authors.join(', ')}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-500">
                <span>arXiv:{paper.arxivId}</span>
                <span className="flex items-center gap-1 text-slate-400 group-hover:text-sky-400 transition-colors">
                  <span>Deconstruct</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
