import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div
      className={cn(
        'prose prose-slate max-w-none prose-headings:font-display prose-headings:text-ink prose-a:text-royal-600 prose-blockquote:border-royal-300 prose-blockquote:bg-royal-50/60 prose-blockquote:py-1 prose-blockquote:not-italic prose-strong:text-ink',
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
