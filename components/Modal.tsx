import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  isError?: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, isError = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div 
        className={`
          relative w-full max-w-sm rounded-3xl shadow-2xl transform transition-all scale-100
          ${isError ? 'bg-white border-2 border-red-100' : 'bg-white dark:bg-gray-800 dark:border-gray-700'}
        `}
      >
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isError ? 'border-red-50' : 'border-gray-100 dark:border-gray-700'}`}>
          <h3 className={`font-bold ${isError ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
            {title}
          </h3>
          <button 
            onClick={onClose}
            className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${isError ? 'text-red-400' : 'text-gray-500 dark:text-gray-400'}`}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;