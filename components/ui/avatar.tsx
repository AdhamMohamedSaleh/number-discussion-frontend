import { cn } from '@/lib/utils';

interface AvatarProps {
  username: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const COLORS = [
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-yellow-500',
  'bg-lime-500',
  'bg-green-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-sky-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-purple-500',
  'bg-fuchsia-500',
  'bg-pink-500',
  'bg-rose-500',
];

function getColorFromUsername(username: string): string {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

function getInitials(username: string): string {
  return username.slice(0, 2).toUpperCase();
}

export function Avatar({ username, className, size = 'md' }: AvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-12 w-12 text-sm',
    lg: 'h-16 w-16 text-base',
  };

  return (
    <div
      className={cn(
        'rounded-md flex items-center justify-center text-white font-semibold flex-shrink-0',
        getColorFromUsername(username),
        sizeClasses[size],
        className
      )}
      aria-label={`Avatar for ${username}`}
    >
      {getInitials(username)}
    </div>
  );
}
