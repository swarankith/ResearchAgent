import React, { useState } from 'react';
import { CoreConcept, PaperInfo } from '../types';
import { BookOpen, Copy, Check, Volume2, VolumeX, ArrowRight, BrainCircuit, Lightbulb, Sigma } from 'lucide-react';

interface CoreConceptViewProps {
  paper: PaperInfo;
  concept: CoreConcept;
}

export const CoreConceptView: React.FC<CoreConceptViewProps> = ({ paper, concept }) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Compute total word count of core concept sections
  const totalWords = React.useMemo(() => {
    const text = `${concept.problemStatement} ${concept.primaryMethodology} ${concept.mathematicalBreakthroughs}`;
    return text.trim().split(/\s+/).filter(Boolean).length;
  }, [concept]);

  const handleCopy = async () => {
    const fullText = `1. CORE CONCEPT EXTRACTION:\n\nPROBLEM STATEMENT:\n${concept.problemStatement}\n\nPRIMARY METHODOLOGY:\n${concept.primaryMethodology}\n\nMATHEMATICAL & ALGORITHMIC BREAKTHROUGHS:\n${concept.mathematicalBreakthroughs}\n\nPLAIN LANGUAGE SUMMARY:\n${concept.plainSummary}`;
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const narration = `Problem Statement: ${concept.problemStatement}. Methodology: ${concept.primaryMethodology}. Mathematical breakthroughs: ${concept.mathematicalBreakthroughs}. Summary: ${concept.plainSummary}`;
    const utterance = new SpeechSynthesisUtterance(narration);
    utterance.rate = 1.05;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <div className="space-y-4">
      {/* Header bar with word count compliance */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
            <BookOpen className="w-4 h-4" />
            <span>STEP 1: CORE CONCEPT EXTRACTION</span>
          </div>
          <h2 className="text-lg font-semibold text-slate-100 tracking-tight mt-0.5">
            Theoretical Foundations & Methodology
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <span>Word count:</span>
            <span className={`font-semibold ${totalWords <= 300 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {totalWords} / 300 words
            </span>
            {totalWords <= 300 && (
              <span className="text-[10px] text-emerald-500 font-mono">
                (Verified)
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleToggleSpeech}
              className={`p-1.5 rounded-md border text-xs transition-colors ${
                isSpeaking
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border-slate-700'
              }`}
              title={isSpeaking ? 'Stop narration' : 'Listen to 300-word synthesis (TTS)'}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors"
              title="Copy Section 1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Key Conceptual Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Problem Statement */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400/90 font-medium">
            <BrainCircuit className="w-4 h-4" />
            <span>PROBLEM STATEMENT</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {concept.problemStatement}
          </p>
        </div>

        {/* Primary Methodology */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400 font-medium">
            <ArrowRight className="w-4 h-4" />
            <span>PRIMARY METHODOLOGY</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {concept.primaryMethodology}
          </p>
        </div>

        {/* Mathematical & Algorithmic Breakthroughs */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-medium">
            <Sigma className="w-4 h-4" />
            <span>MATHEMATICAL BREAKTHROUGHS</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans font-mono text-[11.5px]">
            {concept.mathematicalBreakthroughs}
          </p>
        </div>
      </div>

      {/* Plain Language Accessible Summary */}
      <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/20">
        <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1.5 font-medium">
          <Lightbulb className="w-4 h-4" />
          <span>PLAIN-LANGUAGE EXECUTIVE INTUITION</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {concept.plainSummary}
        </p>
      </div>

      {/* Key Reported Metrics */}
      {paper.keyMetrics && paper.keyMetrics.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 text-xs font-mono text-slate-400">
          <span className="text-slate-500">Key empirical results:</span>
          {paper.keyMetrics.map((metric, idx) => (
            <React.Fragment key={idx}>
              <span className="text-slate-300">{metric}</span>
              {idx < paper.keyMetrics.length - 1 && <span className="text-slate-600">·</span>}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
