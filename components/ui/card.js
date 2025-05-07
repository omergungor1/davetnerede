import { cn } from './utils';

export function Card({ children, className, ...props }) {
    return (
        <div
            className={cn(
                'bg-white rounded-lg shadow-md overflow-hidden',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className, ...props }) {
    return (
        <div
            className={cn('p-4 border-b', className)}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardContent({ children, className, ...props }) {
    return (
        <div className={cn('p-4', className)} {...props}>
            {children}
        </div>
    );
}

export function CardFooter({ children, className, ...props }) {
    return (
        <div
            className={cn('p-4 border-t flex justify-between items-center', className)}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardTitle({ children, className, ...props }) {
    return (
        <h3
            className={cn('text-xl font-semibold', className)}
            {...props}
        >
            {children}
        </h3>
    );
}

export function CardDescription({ children, className, ...props }) {
    return (
        <p
            className={cn('text-sm text-gray-500', className)}
            {...props}
        >
            {children}
        </p>
    );
} 