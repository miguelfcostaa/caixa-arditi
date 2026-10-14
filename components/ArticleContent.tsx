interface ArticleContentProps {
  content: string[];
}

export function ArticleContent({ content }: ArticleContentProps) {
  if (!content || content.length === 0) {
    return null;
  }

  const fullContent = content.join("\n\n");
  const isHtml = /<[a-z][\s\S]*>/i.test(fullContent);

  if (isHtml) {
    return (
      <div
        className="article-rich-content mx-auto mt-10 text-base sm:text-lg leading-relaxed text-[#334155] [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#07213D] [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#07213D] [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:text-justify [&_p]:leading-relaxed [&_p]:mb-6 [&_strong]:text-[#07213D] [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:my-5 [&_li]:leading-relaxed [&_blockquote]:border-l-4 [&_blockquote]:border-[#F85308] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#07213D]/80 [&_blockquote]:my-6 [&_a]:text-[#F85308] [&_a]:underline hover:[&_a]:text-[#d64505]"
        dangerouslySetInnerHTML={{ __html: fullContent }}
      />
    );
  }

  return (
    <div className="mx-auto mt-10 space-y-6 text-base sm:text-lg leading-relaxed text-[#334155]">
      {content.map((p, idx) => (
        <p key={idx} className="text-justify leading-relaxed">
          {p}
        </p>
      ))}
    </div>
  );
}

