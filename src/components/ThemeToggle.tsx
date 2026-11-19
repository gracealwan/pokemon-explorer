import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { toggleTheme } from '@/lib/theme'
import { cn } from '@/lib/utils'

const ICON_MOTION =
  'size-5 transition-[rotate,scale,opacity] duration-500 ease-out-back motion-reduce:transition-none'

// Icons swap via the `dark` class in CSS, so no React state mirrors the theme.
export default function ThemeToggle() {
  return (
    <Button
      aria-label="Toggle dark mode"
      // No hover fill or colour transition: the button's own 150ms colour
      // transition lags behind the 400ms theme fade and looks stuck.
      className="relative size-10 cursor-pointer rounded-full transition-none hover:bg-transparent dark:hover:bg-transparent"
      onClick={toggleTheme}
      size="icon"
      title="Toggle dark mode"
      variant="ghost"
    >
      <Sun
        className={cn(
          ICON_MOTION,
          'scale-100 rotate-0 opacity-100 dark:scale-0 dark:-rotate-90 dark:opacity-0'
        )}
      />
      <Moon
        className={cn(
          ICON_MOTION,
          'absolute scale-0 rotate-90 opacity-0 dark:scale-100 dark:rotate-0 dark:opacity-100'
        )}
      />
    </Button>
  )
}
