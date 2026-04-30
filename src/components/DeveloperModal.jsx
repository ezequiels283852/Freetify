import React from 'react';
import { X, Hammer, Clock } from 'lucide-react';

const DeveloperModal = ({ isOpen, onClose, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-[2.5rem] bg-[#121212] border border-white/10 p-8 shadow-2xl transition-all animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-6 rounded-full bg-brand/20 p-5 text-brand shadow-[0_0_30px_rgba(34,211,238,0.2)]">
            <Hammer size={48} className="animate-pulse" />
          </div>
          
          <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">
            {title}
          </h2>
          
          <div className="flex items-center gap-2 text-cyan-400 mb-6 bg-cyan-400/10 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest">
            <Clock size={14} />
            En Desarrollo
          </div>

          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            Estamos trabajando intensamente para traerte la mejor experiencia de usuario. 
            Esta funcionalidad estará disponible muy pronto.
          </p>

          <button 
            onClick={onClose}
            className="w-full bg-brand text-white font-bold py-4 rounded-2xl hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all transform hover:scale-[1.02] active:scale-95 text-lg"
          >
            Entendido
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-brand/10 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl opacity-50"></div>
      </div>
    </div>
  );
};

export default DeveloperModal;
