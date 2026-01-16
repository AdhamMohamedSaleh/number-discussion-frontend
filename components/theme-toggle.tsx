'use client';

import { IconSun, IconMoon, IconDeviceDesktop } from '@tabler/icons-react';
import { useTheme } from '@/lib/theme-context';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={cycleTheme}
      aria-label={`Current theme: ${theme}. Click to change.`}
      className="h-9 w-9 p-0"
    >
      {theme === 'light' && <IconSun className="h-4 w-4" />}
      {theme === 'dark' && <IconMoon className="h-4 w-4" />}
      {theme === 'system' && <IconDeviceDesktop className="h-4 w-4" />}
    </Button>
  );
}
