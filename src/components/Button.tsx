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
  const baseClasses = "rounded-md font-medium transition-all duration-200 flex items-center justify-center shadow-sm";
  
  const variantClasses = {
    primary: "bg-navy text-white hover:opacity-90 hover:shadow-md",
    secondary: "bg-purple text-white hover:opacity-90 hover:shadow-md",
    gold: "bg-gold text-white hover:opacity-90 hover:shadow-md",
    outline: "border border-navy text-navy bg-transparent hover:bg-navy hover:text-white hover:shadow-sm"
  };
  
  const sizeClasses = {
    sm: "text-sm py-2 px-4",
    md: "text-base py-2.5 px-6",
    lg: "text-lg py-3 px-8"
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