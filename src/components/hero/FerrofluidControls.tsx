import React, { useState } from 'react';
import { Sliders, RefreshCw, ChevronDown, ChevronUp, Sparkles, Move, Zap } from 'lucide-react';
import { FerrofluidPreset } from '../../types';
import { ferrofluidPresets } from '../../data/portfolioData';

interface FerrofluidControlsProps {
  currentPreset: FerrofluidPreset;
  onSelectPreset: (preset: FerrofluidPreset) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  scale: number;
  onScaleChange: (scale: number) => void;
  turbulence: number;
  onTurbulenceChange: (turbulence: number) => void;
  mouseInteraction: boolean;
  mouseInteractionChange?: () => void;
  onToggleMouse: () => void;
  onReset: () => void;
}

export const FerrofluidControls: React.FC<FerrofluidControlsProps> = ({
  currentPreset,
  onSelectPreset,
  speed,
  onSpeedChange,
  scale,
  onScaleChange,
  turbulence,
  onTurbulenceChange,
  mouseInteraction,
  onToggleMouse,
  onReset
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-20">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono bg-white/90 hover:bg-white border border-sky-200 text-blue-900 backdrop-blur-md transition-all shadow-md cursor-pointer hover:border-sky-400"
        title="Adjust Fluid & Shimmer Parameters"
      >
        <Sliders className="w-3.5 h-3.5 text-blue-600" />
        <span className="hidden sm:inline font-normal text-slate-600">Style:</span>
        <span className="font-semibold text-blue-800">{currentPreset.name}</span>
        {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-blue-600" /> : <ChevronDown className="w-3.5 h-3.5 text-blue-600" />}
      </button>

      {/* Expanded Controls Drawer */}
      {isOpen && (
        <div className="absolute right-0 sm:right-auto sm:left-0 top-10 w-72 sm:w-80 p-4 rounded-2xl bg-white/95 border border-sky-200 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-sky-100 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-950 font-display">
                Fluid Visual Controls
              </span>
            </div>
            <button
              onClick={onReset}
              className="text-[11px] font-mono text-slate-500 hover:text-blue-700 flex items-center gap-1 transition-colors cursor-pointer"
              title="Reset to default preset"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Presets List */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-600 block font-medium">
              Fluid Styles (Azure &amp; Royal Blue):
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {ferrofluidPresets.map((preset) => {
                const isActive = currentPreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => onSelectPreset(preset)}
                    className={`text-left px-2.5 py-2 rounded-xl text-xs transition-all flex flex-col justify-between cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-md'
                        : 'bg-white hover:bg-sky-50 text-slate-700 border border-sky-100 shadow-sm'
                    }`}
                  >
                    <span>{preset.name.split(' (')[0]}</span>
                    <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                      {preset.colors.map((c, i) => (
                        <span
                          key={i}
                          className="w-2 h-2 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-3 pt-1 border-t border-sky-100">
            {/* Speed */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-600 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-blue-600" /> Flow Speed
                </span>
                <span className="text-blue-800 font-semibold">{speed.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.5"
                step="0.05"
                value={speed}
                onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Scale */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-600 flex items-center gap-1">
                  <Move className="w-3 h-3 text-blue-600" /> Fluid Scale
                </span>
                <span className="text-blue-800 font-semibold">{scale.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="2.5"
                step="0.1"
                value={scale}
                onChange={(e) => onScaleChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Turbulence */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-600 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-blue-600" /> Turbulence
                </span>
                <span className="text-blue-800 font-semibold">{turbulence.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.0"
                step="0.1"
                value={turbulence}
                onChange={(e) => onTurbulenceChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          {/* Mouse toggle */}
          <div className="pt-2 border-t border-sky-100 flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-600">Pointer Ripple:</span>
            <button
              onClick={onToggleMouse}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-colors cursor-pointer ${
                mouseInteraction
                  ? 'bg-blue-600 text-white font-medium shadow-sm'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {mouseInteraction ? 'Active' : 'Disabled'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
