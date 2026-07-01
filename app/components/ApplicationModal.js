"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";

export default function ApplicationModal({ isOpen, onClose, courseTitle, courseImage }) {
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Auto close after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3000);
    }, 1500);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-dark/80 backdrop-blur-sm transition-all duration-300">
      
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row transform transition-all animate-in fade-in zoom-in-95 duration-300 my-auto">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 hover:bg-white/40 md:bg-dark/5 md:hover:bg-dark/10 rounded-full flex items-center justify-center transition-colors text-white md:text-dark"
          aria-label="Close modal"
        >
          <i className="fas fa-times text-xl" />
        </button>

        {/* Sidebar Image Area */}
        <div className="md:w-1/3 relative h-48 md:h-auto bg-dark flex-shrink-0">
          <Image
            src={courseImage || "/program-certification.png"}
            alt={courseTitle || "Certification"}
            fill
            className="object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-primary/90 to-dark/90" />
          
          <div className="absolute inset-0 p-8 flex flex-col justify-end md:justify-center">
            <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full mb-4 uppercase tracking-wider w-fit backdrop-blur-md">
              Application
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white font-[var(--font-heading)] leading-tight mb-4 shadow-sm">
              {courseTitle}
            </h3>
            <p className="text-white/80 text-sm hidden md:block leading-relaxed">
              Take the next step in your career. Submit your application and our admissions team will contact you within 24 hours.
            </p>
          </div>
        </div>

        {/* Form Area */}
        <div className="md:w-2/3 p-8 md:p-10 max-h-[80vh] overflow-y-auto custom-scrollbar bg-white">
          {isSuccess ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12 animate-in fade-in duration-500">
              <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-check text-4xl" />
              </div>
              <h3 className="text-2xl font-bold text-dark">Application Received!</h3>
              <p className="text-[var(--color-text-muted)] max-w-sm">
                Thank you for applying. We have sent a confirmation email and will be in touch shortly.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-dark mb-6 font-[var(--font-heading)]">Personal Details</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-dark mb-2">First Name <span className="text-red-500">*</span></label>
                    <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-dark" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-dark mb-2">Last Name <span className="text-red-500">*</span></label>
                    <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-dark" required />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-dark mb-2">Email Address <span className="text-red-500">*</span></label>
                    <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-dark" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-dark mb-2">Phone Number <span className="text-red-500">*</span></label>
                    <input type="tel" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-dark" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-dark mb-2">Why are you interested in this certification? <span className="text-red-500">*</span></label>
                  <textarea rows={3} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-dark resize-none" required />
                </div>

                <div>
                  <label className="block text-sm font-bold text-dark mb-2">Resume / CV (Optional)</label>
                  <div className="w-full border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-primary hover:bg-slate-50 transition-all cursor-pointer group">
                    <i className="fas fa-cloud-upload-alt text-2xl text-slate-400 group-hover:text-primary mb-2 transition-colors" />
                    <p className="text-sm font-medium text-dark">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-500 mt-1">PDF, DOC up to 5MB</p>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-4 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={onClose}
                    className="px-6 py-3 text-sm font-bold text-dark hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-primary text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-primary/30 hover:bg-primary-light hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:pointer-events-none flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <><i className="fas fa-circle-notch fa-spin" /> Submitting...</>
                    ) : (
                      <><i className="fas fa-paper-plane" /> Submit Application</>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
