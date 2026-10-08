import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-royal-600 text-white shadow-md shadow-royal-600/25 hover:bg-royal-700 hover:shadow-lg',
        secondary: 'bg-royal-50 text-royal-700 hover:bg-royal-100',
        outline: 'border border-line bg-white text-ink hover:border-royal-300 hover:bg-royal-50',
        ghost: 'text-ink/80 hover:bg-royal-50 hover:text-royal-700',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        glass: 'glass text-royal-800 hover:bg-white',
        white: 'bg-white text-royal-700 shadow-lg hover:bg-royal-50',
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-12 px-6 text-base',
        icon: 'size-10',
        'icon-sm': 'size-8 rounded-lg',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
});
Button.displayName = 'Button';
export { buttonVariants };
