import React from 'react';
import type { DocChapter as DocChapterData } from '../../lib/docs-content';
import { CodeBlock } from './CodeBlock';

export interface DocChapterProps {
  chapter: DocChapterData;
}

export function DocChapter({ chapter }: DocChapterProps) {
  return (
    <article
      id={`chapter-${chapter.id}`}
      className="min-w-0 scroll-mt-28 border-t border-forest-fern/15 pt-14 first:border-t-0 first:pt-0"
    >
      <h3 className="font-display text-[clamp(1.7rem,3.4vw,2.6rem)] font-semibold leading-tight tracking-[-0.01em] text-forest-moonlight">
        {chapter.title}
      </h3>

      <p className="mt-4 max-w-[46rem] text-lg leading-relaxed text-forest-marigold/90">
        {chapter.lede}
      </p>

      <div className="mt-8 max-w-[42rem] space-y-5">
        {chapter.prose.map((paragraph, index) => (
          <p
            key={index}
            className="break-words text-base leading-[1.75] text-forest-mist"
          >
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-10 space-y-5">
        {chapter.snippets.map((snippet) => (
          <CodeBlock
            key={snippet.title}
            code={snippet.code}
            language={snippet.language}
            title={snippet.title}
          />
        ))}
      </div>
    </article>
  );
}
