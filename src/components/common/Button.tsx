import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-200 active:scale-[0.97] focus:outline-none focus:ring-1 focus:ring-[#7FE3C0]/40 disabled:opacity-40 disabled:pointer-events-none cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5 min-h-[36px]',
    md: 'text-sm px-5 py-2.5 gap-2 min-h-[44px]',
    lg: 'text-base px-6 py-3.5 gap-2.5 min-h-[50px]',
  };

  const variantStyles = {
    primary:
      'bg-[#7FE3C0] text-[#0A0A0C] font-semibold hover:bg-[#6edbb6] shadow-[0_2px_12px_rgba(127,227,192,0.25)]',
    secondary:
      'bg-[#1A1A1F] text-[#F2F2F0] border border-white/[0.08] hover:bg-[#222228] hover:border-white/[0.14] shadow-[-1px_-1px_2px_rgba(255,255,255,0.03),2px_4px_12px_rgba(0,0,0,0.5)]',
    ghost:
      'bg-transparent text-[#8A8A93] hover:text-[#F2F2F0] hover:bg-white/[0.04]',
    destructive:
      'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20',
    accent:
      'bg-[#131316] text-[#7FE3C0] border border-[#7FE3C0]/30 hover:border-[#7FE3C0]/60 hover:bg-[#7FE3C0]/5',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
