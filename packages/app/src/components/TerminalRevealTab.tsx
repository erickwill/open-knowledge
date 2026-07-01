import { useLingui } from '@lingui/react/macro';
import { ChevronLeftIcon, ChevronUpIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { TerminalDockPosition } from '@/lib/terminal-dock-store';
import { cn } from '@/lib/utils';

interface TerminalRevealTabProps {
  /** Where the terminal was docked — decides the chevron direction, the edge the
   *  tab is flush against, and the tooltip side so it sits right where the
   *  collapse control was. */
  readonly dockPosition: TerminalDockPosition;
  readonly onReveal: () => void;
  /** Absolute-placement offsets from the call site (which edge/corner it pins to).
   *  The caller owns placement because the two dock positions attach to different
   *  containers — the right column edge vs. the bottom of the editor column. */
  readonly className?: string;
}

export function TerminalRevealTab({ dockPosition, onReveal, className }: TerminalRevealTabProps) {
  const { t } = useLingui();
  const rightDocked = dockPosition === 'right';
  const label = t`Show terminal`;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={label}
          data-terminal-reveal={dockPosition}
          onClick={onReveal}
          className={cn(
            'absolute z-20 shrink-0 bg-background text-muted-foreground shadow-sm hover:text-foreground',
            rightDocked ? 'rounded-r-none border-r-0' : 'rounded-b-none border-b-0',
            className,
          )}
        >
          {rightDocked ? (
            <ChevronLeftIcon aria-hidden="true" />
          ) : (
            <ChevronUpIcon aria-hidden="true" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side={rightDocked ? 'left' : 'top'} sideOffset={8}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
