import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'gold' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  onClick
}) => {
  const baseClasses = "rounded-xl font-medium transition-all duration-200 flex items-center justify-center shadow-soft hover:shadow-hover";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-navy to-purple text-white hover:opacity-90 hover:shadow-hover",
    secondary: "bg-gradient-to-r from-purple to-navy text-white hover:opacity-90 hover:shadow-hover",
    gold: "bg-gradient-to-r from-gold to-yellow-500 text-white hover:opacity-90 hover:shadow-hover",
    outline: "border-2 border-gray-300 text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-soft"
  };
  
  const sizeClasses = {
    sm: "text-sm py-2.5 px-5",
    md: "text-base py-3 px-7",
    lg: "text-lg py-4 px-9"
  };
  
  const widthClass = fullWidth ? "w-full" : "";
  const loadingClass = isLoading ? "opacity-70 cursor-wait" : "";
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${loadingClass} ${disabledClass}`}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button; 