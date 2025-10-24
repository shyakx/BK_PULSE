import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  padding = 'md',
  shadow = 'soft',
  hover = false,
  variant = 'default',
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-lg border border-gray-200 transition-all duration-300';
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };
  
  const shadowClasses = {
    none: '',
    soft: 'shadow-sm',
    medium: 'shadow-md',
    strong: 'shadow-lg',
  };
  
  const variantClasses = {
    default: 'bg-white border-gray-200',
    primary: 'bg-white border-gray-200',
    success: 'bg-white border-gray-200',
    warning: 'bg-white border-gray-200',
    danger: 'bg-white border-red-200',
    info: 'bg-white border-gray-200',
    corporate: 'bg-white border-gray-200',
    executive: 'bg-white border-gray-200',
  };
  
  const hoverClasses = hover ? 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer hover:border-gray-300' : '';
  
  const classes = `${baseClasses} ${paddingClasses[padding]} ${shadowClasses[shadow]} ${variantClasses[variant]} ${hoverClasses} ${className}`;
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '', variant = 'default' }) => {
  const headerClasses = {
    default: 'mb-6 pb-4 border-b border-gray-200',
    primary: 'mb-6 pb-4 border-b border-gray-200',
    success: 'mb-6 pb-4 border-b border-gray-200',
    warning: 'mb-6 pb-4 border-b border-gray-200',
    danger: 'mb-6 pb-4 border-b border-gray-200',
    info: 'mb-6 pb-4 border-b border-gray-200',
    corporate: 'mb-6 pb-4 border-b border-gray-200',
    executive: 'mb-6 pb-4 border-b border-gray-200',
  };
  
  return (
    <div className={`${headerClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

const CardTitle = ({ children, className = '', variant = 'default' }) => {
  const titleClasses = {
    default: 'text-xl font-bold text-gray-900 leading-tight',
    primary: 'text-xl font-bold text-gray-900 leading-tight',
    success: 'text-xl font-bold text-gray-900 leading-tight',
    warning: 'text-xl font-bold text-gray-900 leading-tight',
    danger: 'text-xl font-bold text-gray-900 leading-tight',
    info: 'text-xl font-bold text-gray-900 leading-tight',
    corporate: 'text-xl font-bold text-gray-900 leading-tight',
    executive: 'text-xl font-bold text-gray-900 leading-tight',
  };
  
  return (
    <h3 className={`${titleClasses[variant]} ${className}`}>
      {children}
    </h3>
  );
};

const CardDescription = ({ children, className = '', variant = 'default' }) => {
  const descriptionClasses = {
    default: 'text-sm text-gray-600 mt-2 leading-relaxed',
    primary: 'text-sm text-gray-600 mt-2 leading-relaxed',
    success: 'text-sm text-gray-600 mt-2 leading-relaxed',
    warning: 'text-sm text-gray-600 mt-2 leading-relaxed',
    danger: 'text-sm text-gray-600 mt-2 leading-relaxed',
    info: 'text-sm text-gray-600 mt-2 leading-relaxed',
    corporate: 'text-sm text-gray-600 mt-2 leading-relaxed',
    executive: 'text-sm text-gray-600 mt-2 leading-relaxed',
  };
  
  return (
    <p className={`${descriptionClasses[variant]} ${className}`}>
      {children}
    </p>
  );
};

const CardContent = ({ children, className = '' }) => (
  <div className={`${className}`}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '', variant = 'default' }) => {
  const footerClasses = {
    default: 'mt-6 pt-4 border-t border-gray-200',
    primary: 'mt-6 pt-4 border-t border-gray-200',
    success: 'mt-6 pt-4 border-t border-gray-200',
    warning: 'mt-6 pt-4 border-t border-gray-200',
    danger: 'mt-6 pt-4 border-t border-gray-200',
    info: 'mt-6 pt-4 border-t border-gray-200',
    corporate: 'mt-6 pt-4 border-t border-gray-200',
    executive: 'mt-6 pt-4 border-t border-gray-200',
  };
  
  return (
    <div className={`${footerClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export { Card };
export default Card;
