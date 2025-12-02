import { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function ImageWithSkeleton({ src, alt, className, ...props }) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    return (
        <div className={cn("relative overflow-hidden", className)}>
            {isLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
            <img
                src={error ? 'https://via.placeholder.com/400x300?text=Erro+ao+carregar' : src}
                alt={alt}
                className={cn(
                    "w-full h-full object-cover transition-opacity duration-300",
                    isLoading ? "opacity-0" : "opacity-100"
                )}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setIsLoading(false);
                    setError(true);
                }}
                {...props}
            />
        </div>
    );
}
