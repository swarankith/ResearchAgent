import React, { useState } from 'react';
import { AnalysisResponseData, TelemetryData } from './types';
import { BENCHMARK_PAPERS, BenchmarkPaper } from './data/benchmarks';
import { MermaidViewer } from './components/MermaidViewer';
import { TokenGauge } from './components/TokenGauge';
import { CoreConceptView } from './components/CoreConceptView';
import { ProjectCard } from './components/ProjectCard';
import { RawTerminalView } from './components/RawTerminalView';
import { BenchmarkSelector } from './components/BenchmarkSelector';
import {
  Search,
  ExternalLink,
  BookOpen,
  GitBranch,
  GraduationCap,
  Terminal,
  Layers,
  ArrowRight,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  FileText,
  Clock,
} from 'lucide-react';

export default function App() {
  const [urlInput, setUrlInput] = useState<string>('https://arxiv.org/abs/2312.00752');
  const [rawTextInput, setRawTextInput] = useState<string>('');
  const [showAdvancedInput, setShowAdvancedInput] = useState<boolean>(false);
  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState<string>('mamba');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStage, setLoadingStage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Active view tab in main display
  const [activeTab, setActiveTab] = useState<'synthesis' | 'flowchart' | 'internships' | 'raw'>('synthesis');

  // Initial state with Mamba benchmark pre-loaded
  const [analysisData, setAnalysisData] = useState<AnalysisResponseData>(BENCHMARK_PAPERS[0].data);
  const [telemetry, setTelemetry] = useState<TelemetryData>(BENCHMARK_PAPERS[0].telemetry);

  // Select a pre-computed benchmark
  const handleSelectBenchmark = (paper: BenchmarkPaper) => {
    setSelectedBenchmarkId(paper.id);
    setUrlInput(paper.url);
    setAnalysisData(paper.data);
    setTelemetry(paper.telemetry);
    setError(null);
  };

  // Submit live paper URL to backend agent
  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim() && !rawTextInput.trim()) {
      setError('Please provide a research paper URL, arXiv ID, or title.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSelectedBenchmarkId('');

    try {
      setLoadingStage('Ingesting paper metadata & checking arXiv API (token-efficient mode)...');

      // Stage progression simulation while fetch runs
      const stageTimer1 = setTimeout(() => {
        setLoadingStage('Executing Grounded Web Search for GitHub implementations & architectures...');
      }, 1500);

      const stageTimer2 = setTimeout(() => {
        setLoadingStage('Generating Mermaid.js architectural graph AST & student opportunities...');
      }, 3500);

      const response = await fetch('/api/analyze-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: urlInput.trim(),
          rawText: rawTextInput.trim(),
        }),
      });

      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }

      const resJson = await response.json();
      if (!resJson.success || !resJson.data) {
        throw new Error(resJson.error || 'Failed to decompose paper.');
      }

      setAnalysisData(resJson.data);
      setTelemetry(resJson.telemetry);
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setError(err?.message || 'Error executing research agent. Please verify the URL or try a benchmark paper.');
    } finally {
      setIsLoading(false);
      setLoadingStage('');
    }
  };

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-white">
      {/* Top Academic Agent Navigation Header */}
      <header className="border-b border-slate-800 bg-[#090e1a]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold tracking-tight text-white text-sm sm:text-base">
                  PaperDeconstruct
                </span>
                <span className="text-[11px] font-mono text-sky-400 bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-800/50">
                  CS Research Agent
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                <span>Concepts</span>
                <span>·</span>
                <span>Mermaid.js Flowchart</span>
                <span>·</span>
                <span>Student Projects</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="hidden sm:inline text-slate-500">Constraint:</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              &lt;25k Token Budget
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Research Paper Input Section */}
        <section className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xs space-y-4">
          <form onSubmit={handleAnalyze} className="space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  placeholder="Paste research paper URL (e.g., https://arxiv.org/abs/2312.00752), arXiv ID, or title..."
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs sm:text-sm font-mono text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors disabled:opacity-60"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-slate-950 font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-xs shrink-0"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Deconstruct Paper</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Advanced Input Option for local notes or raw text */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <button
                type="button"
                onClick={() => setShowAdvancedInput(!showAdvancedInput)}
                className="hover:text-slate-300 transition-colors flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{showAdvancedInput ? 'Hide additional text excerpt' : '+ Add custom abstract or excerpt'}</span>
              </button>

              <span className="hidden sm:inline">Supports arXiv, OpenReview, IEEE, Hugging Face, GitHub</span>
            </div>

            {showAdvancedInput && (
              <textarea
                value={rawTextInput}
                onChange={e => setRawTextInput(e.target.value)}
                rows={3}
                placeholder="Paste paper abstract, key formulas, or excerpt here to enrich token-efficient analysis..."
                className="w-full p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-hidden focus:border-sky-500"
              />
            )}
          </form>

          {/* Curated Benchmark Papers for 1-Click Exploration */}
          <BenchmarkSelector
            onSelect={handleSelectBenchmark}
            selectedId={selectedBenchmarkId}
            disabled={isLoading}
          />
        </section>

        {/* Loading Progress State */}
        {isLoading && (
          <div className="p-6 rounded-2xl border border-sky-800/40 bg-sky-950/20 backdrop-blur-xs flex flex-col items-center justify-center space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-sky-500/20 border-t-sky-400 rounded-full animate-spin" />
              <span className="text-sm font-mono text-sky-200">{loadingStage}</span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Operating within &lt;25,000 token constraint · Leveraging web search & abstract extraction
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-xl border border-red-800/60 bg-red-950/30 flex items-start gap-3 text-red-200 text-xs font-mono">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold text-red-300">Analysis Error: </span>
              {error}
            </div>
          </div>
        )}

        {/* Paper Metadata Banner */}
        {analysisData && analysisData.paper && (
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                  <span className="text-sky-400 font-medium">{analysisData.paper.primaryDomain}</span>
                  <span>·</span>
                  <span>{analysisData.paper.yearOrVenue}</span>
                  {analysisData.paper.arxivId && (
                    <>
                      <span>·</span>
                      <a
                        href={`https://arxiv.org/abs/${analysisData.paper.arxivId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-300 hover:text-sky-400 underline underline-offset-2 flex items-center gap-1"
                      >
                        <span>arXiv:{analysisData.paper.arxivId}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </>
                  )}
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {analysisData.paper.title}
                </h1>

                <p className="text-xs sm:text-sm text-slate-400 font-mono">
                  {analysisData.paper.authors.join(', ')}
                </p>
              </div>

              {/* Quick Status Badges */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/80">
                  3rd-Year CS Student Blueprint Ready
                </span>
              </div>
            </div>

            {/* Token Efficiency Gauge Bar */}
            {telemetry && <TokenGauge telemetry={telemetry} />}
          </div>
        )}

        {/* View Selection Segmented Tabs */}
        {analysisData && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 self-start">
              <button
                onClick={() => setActiveTab('synthesis')}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'synthesis'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Full Synthesis (All Steps)</span>
              </button>

              <button
                onClick={() => setActiveTab('flowchart')}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'flowchart'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>[FLOWCHART] Architecture</span>
              </button>

              <button
                onClick={() => setActiveTab('internships')}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'internships'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student Projects ({analysisData.internshipOpportunities.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('raw')}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'raw'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Raw Agent Output</span>
              </button>
            </div>

            <div className="text-xs font-mono text-slate-500">
              Generated by CS Research Agent · Validated Mermaid AST
            </div>
          </div>
        )}

        {/* Tab 1: Full Synthesis View */}
        {analysisData && activeTab === 'synthesis' && (
          <div className="space-y-8">
            {/* Step 1: Core Concept Extraction */}
            <section className="space-y-3">
              <CoreConceptView paper={analysisData.paper} concept={analysisData.coreConcept} />
            </section>

            {/* Step 2: Architectural Flowchart (Mermaid.js) */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
                    <GitBranch className="w-4 h-4" />
                    <span>STEP 2: ARCHITECTURAL FLOWCHART</span>
                  </div>
                  <h2 className="text-lg font-semibold text-slate-100 tracking-tight mt-0.5">
                    Data Flow, Model Layers & Hardware Kernels
                  </h2>
                </div>
                <div className="text-xs font-mono text-slate-400 hidden sm:block">
                  {analysisData.flowchart.description}
                </div>
              </div>

              <MermaidViewer
                code={analysisData.flowchart.mermaidCode}
                paperTitle={analysisData.paper.title}
              />
            </section>

            {/* Step 3: Future Work & Internship Opportunities */}
            <section className="space-y-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
                  <GraduationCap className="w-4 h-4" />
                  <span>STEP 3: FUTURE WORK & INTERNSHIP OPPORTUNITIES</span>
                </div>
                <h2 className="text-lg font-semibold text-slate-100 tracking-tight mt-0.5">
                  Resume-Grade Extension Projects for 3rd-Year CS Students
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Concrete, benchmarkable extensions with targeted metrics, recommended tech stacks, and resume bullets.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {analysisData.internshipOpportunities.map((opp, idx) => (
                  <ProjectCard key={opp.id || idx} opportunity={opp} index={idx} />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Tab 2: Architectural Flowchart Dedicated Canvas */}
        {analysisData && activeTab === 'flowchart' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-100">
                  System Architecture Flowchart (Mermaid.js graph TD)
                </h2>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  Charts data inputs, tensor transformations, model subgraphs, and outputs.
                </p>
              </div>
            </div>

            <MermaidViewer
              code={analysisData.flowchart.mermaidCode}
              paperTitle={analysisData.paper.title}
            />
          </div>
        )}

        {/* Tab 3: Student Internship Projects Dedicated View */}
        {analysisData && activeTab === 'internships' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-100">
                  3rd-Year CS Student Resume Portfolio Blueprints
                </h2>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  Engineered to showcase architectural understanding, profiling, and open-source implementation skills.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {analysisData.internshipOpportunities.map((opp, idx) => (
                <ProjectCard key={opp.id || idx} opportunity={opp} index={idx} />
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Raw Terminal View */}
        {analysisData && activeTab === 'raw' && (
          <div className="space-y-4">
            <RawTerminalView
              text={analysisData.rawRequiredText}
              paperTitle={analysisData.paper.title}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#090d16] py-5 mt-12 text-xs font-mono text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>PaperDeconstruct · Computer Science Research Decomposition Engine</span>
          <div className="flex items-center gap-3 text-slate-400">
            <span>&lt;25,000 Token Efficiency Verified</span>
            <span>·</span>
            <span>Mermaid.js Flowchart Generator</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
