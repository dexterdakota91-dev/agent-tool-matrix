import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const KeyBadge = ({ children }: { children: React.ReactNode }) => (
  <kbd className="px-2 py-1 rounded bg-white/10 border border-white/10 font-mono text-xs font-semibold text-white">
    {children}
  </kbd>
);

interface KeyboardShortcutsModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function KeyboardShortcutsModal({ isOpen = true, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-zinc-950/90 border border-white/10 rounded-2xl backdrop-blur-xl p-6 shadow-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcuts-modal-title"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 id="shortcuts-modal-title" className="text-xl font-semibold text-white">Keyboard Shortcuts</h2>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wider">Navigation</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between items-center text-zinc-300">
                    <span>Canvas</span>
                    <KeyBadge>1</KeyBadge>
                  </li>
                  <li className="flex justify-between items-center text-zinc-300">
                    <span>Builder</span>
                    <KeyBadge>2</KeyBadge>
                  </li>
                  <li className="flex justify-between items-center text-zinc-300">
                    <span>Workflows</span>
                    <KeyBadge>3</KeyBadge>
                  </li>
                  <li className="flex justify-between items-center text-zinc-300">
                    <span>Settings</span>
                    <KeyBadge>4</KeyBadge>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wider">Actions</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between items-center text-zinc-300">
                    <span>Focus Search</span>
                    <KeyBadge>/</KeyBadge>
                  </li>
                  <li className="flex justify-between items-center text-zinc-300">
                    <span>Close Modals / Clear Selection</span>
                    <KeyBadge>Esc</KeyBadge>
                  </li>
                  <li className="flex justify-between items-center text-zinc-300">
                    <span>Show Shortcuts</span>
                    <KeyBadge>?</KeyBadge>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
