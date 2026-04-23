interface BarzaLogoProps {
  size?: 'sm' | 'md' | 'lg';
  hideText?: boolean;
}

export function BarzaLogo({ size = 'md', hideText = false }: BarzaLogoProps) {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const textSizeMap = {
    sm: 'text-sm',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className="flex items-center gap-3">
      <img src="/barza_logo.png" alt="BARZA Logo" className={sizeMap[size]} />
      {!hideText && (
        <span className={`${textSizeMap[size]} font-black tracking-tighter text-[#ff9156] uppercase font-headline`}>
          BARZA
        </span>
      )}
    </div>
  );
}
