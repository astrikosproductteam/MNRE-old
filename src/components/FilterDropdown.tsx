import React, { useState } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}

export default function FilterDropdown({ label, options, value, onChange, icon }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-700 border border-cyan-500/30 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 min-w-[150px] justify-between filter-glow"
      >
        <div className="flex items-center space-x-2">
          {icon || <MapPin className="w-4 h-4 text-cyan-400" />}
          <span className="text-sm font-medium">{selectedOption.label}</span>
          {selectedOption.count && (
            <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full">
              {selectedOption.count}
            </span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 w-full bg-gradient-to-b from-slate-800 to-slate-900 border border-cyan-500/30 rounded-lg shadow-2xl z-20 overflow-hidden"
            >
              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-all duration-200 flex items-center justify-between ${
                      option.value === value
                        ? 'bg-cyan-500/20 text-cyan-300 border-l-4 border-cyan-500'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }`}
                  >
                    <span>{option.label}</span>
                    {option.count && (
                      <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded-full">
                        {option.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}