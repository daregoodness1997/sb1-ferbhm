import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-100/50 shadow-sm hover:shadow-md transition-shadow duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn("px-6 py-4 border-b border-gray-100/50", className)}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Content = function CardContent({ className, children, ...props }: CardProps) {
  return (
    <div className={cn("px-6 py-4", className)} {...props}>
      {children}
    </div>
  );
};