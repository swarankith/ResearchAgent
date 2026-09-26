import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2, Download, Copy, Check, Code, Eye } from 'lucide-react';

interface MermaidViewerProps {
  code: string;
  paperTitle?: string;
}

// Initialize mermaid once with clean modern dark slate styling
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    darkMode: true,
    background: '#090d16',
    primaryColor: '#1e293b',
    primaryTextColor: '#f1f5f9',
    primaryBorderColor: '#38bdf8',
    lineColor: '#64748b',
    secondaryColor: '#1e293b',
    tertiaryColor: '#0f172a',
    edgeLabelBackground: '#0f172a',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    fontSize: '13px',
  },
  flowchart: {
    useMaxWidth: false,
    htmlLabels: true,
    curve: 'basis',
  },
});

export const MermaidViewer: React.FC<MermaidViewerProps> = ({ code, paperTitle }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [renderError, setRenderError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'diagram' | 'code'>('diagram');
  const [copied, setCopied] = useState<boolean>(false);

  // Clean code to ensure syntactically correct mermaid
  const cleanCode = React.useMemo(() => {
    let sanitized = code.trim();
    if (sanitized.startsWith('```mermaid')) {
      sanitized = sanitized.replace(/^```mermaid\s*/i, '').replace(/```\s*$/i, '');
    } else if (sanitized.startsWith('```')) {
      sanitized = sanitized.replace(/^```\s*/i, '').replace(/```\s*$/i, '');
    }
    return sanitized.trim();
  }, [code]);

  useEffect(() => {
    let isMounted = true;
    const renderDiagram = async () => {
      if (!cleanCode) return;
      try {
        setRenderError(null);
        const uniqueId = `mermaid-svg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(uniqueId, cleanCode);
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err: any) {
        console.warn('Mermaid render error:', err);
        if (isMounted) {
          setRenderError(err?.message || 'Diagram syntax parse error. Viewing raw code.');
        }
      }
    };

    renderDiagram();
    return () => {
      isMounted = false;
    };
  }, [cleanCode]);

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.2, 3));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.2, 0.4));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (viewMode !== 'diagram') return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(cleanCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSvg = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(paperTitle || 'architecture-flowchart').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`border border-slate-800 bg-slate-950 flex flex-col transition-all duration-200 ${
        isFullscreen
          ? 'fixed inset-0 z-50 p-6 bg-slate-950/98 backdrop-blur-md'
          : 'rounded-xl h-[560px] overflow-hidden'
      }`}
    >
      {/* Viewer Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800/80 bg-slate-900/60 select-none">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-medium text-sky-400 tracking-wider">
            [FLOWCHART] ARCHITECTURE AST
          </span>
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            graph TD · {cleanCode.split('\n').length} lines
          </span>
        </div>

        {/* View Controls & Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Segmented View Mode Toggle */}
          <div className="flex items-center bg-slate-800/70 p-0.5 rounded-lg border border-slate-700/60 mr-2">
            <button
              onClick={() => setViewMode('diagram')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'diagram'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Rendered visual diagram"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Visual</span>
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'code'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Raw Mermaid source text"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Syntax</span>
            </button>
          </div>

          {viewMode === 'diagram' && (
            <>
              <button
                onClick={handleZoomIn}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
                title="Reset View"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <div className="h-4 w-px bg-slate-800 mx-1" />
              <button
                onClick={handleDownloadSvg}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
                title="Export as Vector SVG"
              >
                <Download className="w-4 h-4" />
              </button>
            </>
          )}

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors"
            title="Copy Mermaid.js source"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Canvas'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Viewer Body Area */}
      <div className="relative flex-1 overflow-hidden bg-[#070b13]">
        {viewMode === 'code' ? (
          <div className="p-4 h-full overflow-auto">
            <div className="text-xs font-mono text-slate-500 mb-2">
              // Header tag required by specification: [FLOWCHART]
            </div>
            <pre className="font-mono text-xs text-sky-200/90 leading-relaxed select-text whitespace-pre-wrap">
              {`[FLOWCHART]\n${cleanCode}`}
            </pre>
          </div>
        ) : (
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`w-full h-full flex items-center justify-center p-8 select-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {renderError ? (
              <div className="max-w-md p-4 rounded-lg bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs font-mono">
                <div className="font-semibold text-amber-400 mb-1">Mermaid Parsing Notice</div>
                <div className="text-slate-300 mb-3">{renderError}</div>
                <button
                  onClick={() => setViewMode('code')}
                  className="px-3 py-1.5 bg-amber-900/60 hover:bg-amber-800 text-amber-100 rounded text-xs transition-colors"
                >
                  Inspect Raw Graph Syntax
                </button>
              </div>
            ) : svgContent ? (
              <div
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                }}
                className="max-w-none flex items-center justify-center pointer-events-none select-none"
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-500 text-xs font-mono">
                <div className="w-5 h-5 border-2 border-sky-500/30 border-t-sky-400 rounded-full animate-spin" />
                <span>Compiling Architectural Graph TD...</span>
              </div>
            )}
          </div>
        )}

        {/* Canvas Status & Zoom Indicator */}
        {viewMode === 'diagram' && (
          <div className="absolute bottom-3 left-4 flex items-center gap-2 text-[11px] font-mono text-slate-500 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800 pointer-events-none">
            <span>Zoom: {Math.round(zoom * 100)}%</span>
            <span>·</span>
            <span>Drag to pan</span>
          </div>
        )}
      </div>
    </div>
  );
};
