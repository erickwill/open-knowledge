import { BookOpen, Code, type LucideIcon, Sparkle } from 'lucide-react';
import SectionHeading from '../section-heading';

type UseCaseCard = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const cards: UseCaseCard[] = [
  {
    icon: Sparkle,
    title: 'Agent brain',
    description:
      'A shared knowledge base your agents read from and write to — the persistent memory behind every session.',
  },
  {
    icon: Code,
    title: 'Engineering specs',
    description:
      'Specs, RFCs and runbooks living next to the code, edited by humans and coding agents in the same loop.',
  },
  {
    icon: BookOpen,
    title: 'Knowledge base',
    description:
      'A living wiki for your team — docs, notes and decisions in plain markdown, kept current by everyone who works on them.',
  },
];

function CornerSquare({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute hidden size-1.5 bg-border lg:block ${className}`}
    />
  );
}

const dashedExtensions: React.CSSProperties = {
  backgroundImage:
    'repeating-linear-gradient(to right, var(--border) 0 8px, transparent 8px 14px), repeating-linear-gradient(to right, var(--border) 0 8px, transparent 8px 14px)',
  backgroundPosition: 'top left, bottom left',
  backgroundSize: '100% 1px, 100% 1px',
  backgroundRepeat: 'no-repeat, no-repeat',
};

export function PutItToWork() {
  return (
    <section className="w-full py-16 lg:py-28">
      <div className="container px-4 sm:px-11">
        <SectionHeading tag="Use cases">Put it to work.</SectionHeading>
      </div>
      <div className="relative mt-16 w-full" style={dashedExtensions}>
        <div className="container px-4 sm:px-11">
          <div className="relative border border-border">
            <div className="grid grid-cols-1 divide-y divide-border lg:grid-cols-3 lg:divide-x lg:divide-y-0">
              {cards.map(({ icon: Icon, title, description }) => (
                <article
                  key={title}
                  className="flex min-h-[320px] flex-col justify-between gap-16 p-8 md:p-10"
                >
                  <Icon className="size-6 text-slide-muted" strokeWidth={1.5} aria-hidden="true" />
                  <p className="text-lg leading-relaxed text-slide-muted">
                    <span className="font-semibold text-primary">{title}.</span> {description}
                  </p>
                </article>
              ))}
            </div>
            <CornerSquare className="left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
            <CornerSquare className="left-1/3 top-0 -translate-x-1/2 -translate-y-1/2" />
            <CornerSquare className="left-2/3 top-0 -translate-x-1/2 -translate-y-1/2" />
            <CornerSquare className="right-0 top-0 translate-x-1/2 -translate-y-1/2" />
            <CornerSquare className="left-0 bottom-0 -translate-x-1/2 translate-y-1/2" />
            <CornerSquare className="left-1/3 bottom-0 -translate-x-1/2 translate-y-1/2" />
            <CornerSquare className="left-2/3 bottom-0 -translate-x-1/2 translate-y-1/2" />
            <CornerSquare className="right-0 bottom-0 translate-x-1/2 translate-y-1/2" />
          </div>
        </div>
      </div>
    </section>
  );
}
