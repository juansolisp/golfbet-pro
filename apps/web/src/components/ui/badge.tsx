import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-golf-600/20 text-golf-400 border border-golf-600/30',
        secondary: 'bg-dark-700 text-dark-300 border border-dark-600',
        gold: 'bg-gold-500/20 text-gold-400 border border-gold-500/30',
        destructive: 'bg-red-600/20 text-red-400 border border-red-600/30',
        outline: 'border border-dark-600 text-dark-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
