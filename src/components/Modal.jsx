// src/components/Modal.jsx
import React from 'react';

function Modal({ isOpen, onClose, title, children, animation = 'fade' }) {
  if (!isOpen) return null;

  const animationClasses = {
    'fade': 'opacity-0 scale-95',
    'slide-up': 'translate-y-10 opacity-0',
    'slide-down': '-translate-y-10 opacity-0'
  };

  const animationEnterClasses = {
    'fade': 'opacity-100 scale-100',
    'slide-up': 'translate-y-0 opacity-100',
    'slide-down': 'translate-y-0 opacity-100'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>
        
        {/* Modal panel */}
        <div className={`inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl ${animationClasses[animation]} ${animationEnterClasses[animation]}`}>
          {/* Header */}
          <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Content */}
            <div className="mt-2">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;