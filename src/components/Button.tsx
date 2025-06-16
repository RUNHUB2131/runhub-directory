import Link from 'next/link';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export default function Button({ 
  children, 
  href, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  className = '',
  disabled = false 
}: ButtonProps) {
  
  // Size configurations
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  // Variant configurations
  const variantStyles = {
    primary: {
      borderColor: 'white',
      buttonStyle: {
        backgroundColor: 'white',
        color: '#021fdf'
      }
    },
    secondary: {
      borderColor: '#021fdf',
      buttonStyle: {
        backgroundColor: '#021fdf',
        color: 'white'
      }
    }
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeClasses[size];

  const buttonContent = (
    <div 
      className={`rounded-full border-2 p-1 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 transition-transform duration-200'}`}
      style={{ borderColor: currentVariant.borderColor }}
    >
      <div
        className={`block ${currentSize} font-black rounded-full transition-colors ${disabled ? 'cursor-not-allowed' : 'hover:opacity-90'} ${className}`}
        style={currentVariant.buttonStyle}
      >
        {children}
      </div>
    </div>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className="inline-block">
        {buttonContent}
      </Link>
    );
  }

  return (
    <button 
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className="inline-block"
    >
      {buttonContent}
    </button>
  );
} 