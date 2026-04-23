'use client';

import { useState } from 'react';

export function DownloadModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Button - Used by other components */}
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-primary-container text-on-primary-container px-6 py-2.5 font-bold rounded-lg active:scale-95 transition-transform"
      >
        Get the App
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 overflow-hidden bg-surface-container-lowest/40 backdrop-blur-md">
          {/* Modal Container */}
          <div className="glass-panel refractive-highlight obsidian-shadow relative w-full max-w-4xl rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
            {/* Close Button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 z-50 text-on-surface/60 hover:text-primary-container transition-colors p-2 hover:bg-white/5 rounded-full"
            >
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>

            {/* Visual Section */}
            <div className="w-full md:w-5/12 relative hidden md:block">
              <div className="absolute inset-0 volcanic-gradient opacity-10"></div>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuANLh5-eRpQT6gi90wKCpWUsrbpJLginRE7iORN-PdQHND3JuBXFUrdsaVsIuK1m8iGFTqKg9LLCb5JNK21RJVYIKwDvRyMOh86O8C2l6UTHYqiVghX9I4KKd6-nvmAVVc_aMRAVBw6P3Fo3v6XzKeVRLiFicbyd3HZxhH2c2svMorvuwWBAn54Cisy5e6ac4yl4byeeMjI6NyxzVCe0v16O4B_0aULYEwcFX4SYMKzaSv1qr-EA4-y_WivwkkLtiNNNUQvWZ4OPxI" 
                alt="Barza App on smartphone"
                className="w-full h-full object-cover brightness-75" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent opacity-80"></div>
              <div className="absolute bottom-12 left-12 right-12 space-y-2">
                <span className="font-label text-[10px] tracking-[0.2em] text-primary-container font-bold uppercase">Versão 2.4.0</span>
                <p className="font-headline text-2xl font-bold tracking-tight text-on-surface">Experience the glow.</p>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
              <div className="space-y-12 max-w-md mx-auto md:mx-0">
                <div className="space-y-4">
                  <h2 className="font-headline text-4xl md:text-5xl font-black tracking-tighter text-on-surface leading-none">
                    Leva a Barza contigo
                  </h2>
                  <div className="h-1 w-12 volcanic-gradient rounded-full"></div>
                  <p className="font-body text-xl text-on-surface-variant font-light leading-relaxed">
                    A próxima versão da beleza no teu bolso.
                  </p>
                </div>

                {/* App Download Buttons */}
                <div className="flex flex-col gap-4">
                  {/* App Store */}
                  <a 
                    href="https://apps.apple.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative flex items-center gap-5 p-5 rounded-xl border border-outline-variant/10 bg-surface-container-low hover:bg-surface-container-high transition-all duration-300"
                  >
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 volcanic-gradient -z-10 blur-xl"></div>
                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-surface-container text-on-surface group-hover:text-primary-container transition-colors">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.1 2.48-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.24-1.99 1.1-3.15-1.04.04-2.3.69-3.05 1.56-.67.77-1.26 1.97-1.1 3.1 1.16.09 2.32-.68 3.05-1.51z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-label text-[10px] tracking-widest text-on-surface-variant uppercase font-semibold">Download on the</p>
                      <p className="font-headline text-xl font-bold tracking-tight text-on-surface">App Store</p>
                    </div>
                  </a>

                  {/* Google Play */}
                  <a 
                    href="https://play.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative flex items-center gap-5 p-5 rounded-xl border border-outline-variant/10 bg-surface-container-low hover:bg-surface-container-high transition-all duration-300"
                  >
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 volcanic-gradient -z-10 blur-xl"></div>
                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-surface-container text-on-surface group-hover:text-primary-container transition-colors">
                      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 20.5v-17c0-.4.3-.7.7-.8l10.2 10.3-10.2 10.2c-.4-.1-.7-.4-.7-.7zm11.7-6.7l3.6 3.7c.4.2.8.2 1.1-.1.1-.1.2-.2.2-.3l-3.9-2.1-1 1.2v-2.4zm-1.1-1.1l-10-10.1c.3-.1.6 0 .9.1l11.4 6.2-2.3 3.8zm2.3-3.8l3.9-2.1c.3-.1.5-.4.5-.7 0-.3-.2-.5-.5-.7l-15.3-8.3c-.4-.2-.9-.1-1.2.2L13.9 8.9z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-label text-[10px] tracking-widest text-on-surface-variant uppercase font-semibold">Get it on</p>
                      <p className="font-headline text-xl font-bold tracking-tight text-on-surface">Google Play</p>
                    </div>
                  </a>
                </div>

                <p className="font-label text-[9px] tracking-[0.3em] text-on-surface/30 uppercase text-center md:text-left">
                  © 2024 Barza Digital • Crafted in obsidian
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
