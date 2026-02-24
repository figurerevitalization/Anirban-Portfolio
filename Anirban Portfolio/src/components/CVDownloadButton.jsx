import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';

const CVDownloadButton = () => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="fixed top-20 sm:top-24 left-4 sm:left-6 z-40"
        >
            <a
                href="https://drive.google.com/file/d/1ILFuua0b5hnRgmYGELPRHr7oe_3iYAWf/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-sm hover:border-white/40 hover:bg-black/60 transition-all duration-300"
            >
                {/* Scanline Effect */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-sm">
                    <div className="w-full h-[1px] bg-white/5 absolute top-0 animate-scanline" />
                </div>

                <div className="relative flex items-center justify-center">
                    <FileText size={14} className="text-white/40 group-hover:text-white transition-colors" />
                    <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <span className="font-mono text-[9px] tracking-[0.3em] text-white/60 uppercase group-hover:text-white transition-colors">
                    Get_CV.sys
                </span>

                {/* Corner Accents */}
                <div className="absolute -top-[1px] -left-[1px] w-1 h-1 border-t border-l border-white/20" />
                <div className="absolute -bottom-[1px] -right-[1px] w-1 h-1 border-b border-r border-white/20" />
            </a>
        </motion.div>
    );
};

export default CVDownloadButton;
