import React, { useState } from 'react';
import { InternshipOpportunity } from '../types';
import { Target, Cpu, Calendar, Copy, Check, Code2, ChevronDown, ChevronUp, Award } from 'lucide-react';

interface ProjectCardProps {
  opportunity: InternshipOpportunity;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ opportunity, index }) => {
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [copiedBullet, setCopiedBullet] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyBullet = async () => {
    await navigator.clipboard.writeText(opportunity.resumeBullet);
    setCopiedBullet(true);
    setTimeout(() => setCopiedBullet(false), 2000);
  };

  const handleCopyCode = async () => {
    if (!opportunity.starterSkeleton) return;
    await navigator.clipboard.writeText(opportunity.starterSkeleton);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const difficultyColors = {
    'Beginner-Friendly': 'text-emerald-400 border-emerald-900/50 bg-emerald-950/20',
    'Intermediate': 'text-sky-400 border-sky-900/50 bg-sky-950/20',
    'Advanced': 'text-amber-400 border-amber-900/50 bg-amber-950/20',
  };

  return (
    <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition-colors flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-slate-400">
              0{index + 1}.
            </span>
            <h3 className="text-sm font-semibold text-slate-100 leading-snug">
              {opportunity.title}
            </h3>
          </div>
          <span
            className={`text-[11px] font-mono px-2 py-0.5 rounded border shrink-0 ${
              difficultyColors[opportunity.difficulty] || difficultyColors['Intermediate']
            }`}
          >
            {opportunity.difficulty}
          </span>
        </div>

        {/* 1. Exact Extension */}
        <div className="mb-3.5 space-y-1">
          <span className="text-[11px] font-mono font-medium text-sky-400 block tracking-wider">
            EXACT EXTENSION
          </span>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {opportunity.exactExtension}
          </p>
        </div>

        {/* 2. Targeted Performance Metric */}
        <div className="mb-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-emerald-400 tracking-wider">
            <Target className="w-3.5 h-3.5" />
            <span>TARGETED PERFORMANCE METRIC</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
            {opportunity.targetedPerformanceMetric}
          </p>
        </div>

        {/* 3. Recommended Tech Stack */}
        <div className="mb-4 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-indigo-400 tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            <span>RECOMMENDED TECH STACK</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {opportunity.recommendedTechStack.map((tech, idx) => (
              <span
                key={idx}
                className="text-[11px] font-mono text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Resume Bullet Point with Quick Copy */}
        <div className="mb-4 p-3 rounded-lg bg-sky-950/20 border border-sky-900/30">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="flex items-center gap-1 text-[11px] font-mono text-sky-400 font-medium">
              <Award className="w-3.5 h-3.5" />
              <span>RESUME BULLET GENERATOR</span>
            </span>
            <button
              onClick={handleCopyBullet}
              className="flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-sky-300 transition-colors"
            >
              {copiedBullet ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedBullet ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-300 italic leading-relaxed">
            "{opportunity.resumeBullet}"
          </p>
        </div>
      </div>

      {/* Card Footer: Timeline & Starter Code Toggle */}
      <div className="pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Scope: ~{opportunity.estimatedWeeks} weeks</span>
          </div>

          {opportunity.starterSkeleton && (
            <button
              onClick={() => setShowSkeleton(!showSkeleton)}
              className="flex items-center gap-1 text-sky-400 hover:text-sky-300 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{showSkeleton ? 'Hide Skeleton' : 'Starter Code'}</span>
              {showSkeleton ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>

        {/* Collapsible Starter Code Skeleton */}
        {showSkeleton && opportunity.starterSkeleton && (
          <div className="mt-3 relative p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono">
            <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-slate-800/60 text-slate-500">
              <span>PyTorch Module Scaffold</span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-200"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="text-sky-200/90 overflow-x-auto whitespace-pre leading-relaxed">
              {opportunity.starterSkeleton}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
