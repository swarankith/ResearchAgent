import React, { useState } from 'react';
import { Copy, Check, Terminal, FileDown } from 'lucide-react';

interface RawTerminalViewProps {
  text: string;
  paperTitle?: string;
}

export const RawTerminalView: React.FC<RawTerminalViewProps> = ({ text, paperTitle }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(paperTitle || 'research-agent-analysis').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950 font-mono">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-medium text-slate-300">
            STRICT AGENT OUTPUT STREAM (SPECIFICATION FORMAT)
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            · Pure Text / No Markdown wrappers in [FLOWCHART]
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 rounded border border-slate-700 transition-colors"
            title="Download plain text file"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>.txt</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 text-xs text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied All' : 'Copy All Output'}</span>
          </button>
        </div>
      </div>

      {/* Terminal Text Body */}
      <div className="p-4 max-h-[550px] overflow-auto text-xs leading-relaxed text-slate-300 whitespace-pre-wrap select-text selection:bg-sky-500/30">
        {text}
      </div>
    </div>
  );
};
