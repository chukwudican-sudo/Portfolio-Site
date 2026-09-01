import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { posts, type PostBlock } from "@/lib/data";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.id === slug);
  if (!post) return {};
  return { title: `${post.title} — Chukwudi Ndubuisi`, description: post.excerpt };
}

function Block({ block }: { block: PostBlock }) {
  switch (block.kind) {
    case "h2":
      return (
        <h2 className="m-0 mt-[42px] mb-[14px] text-[24px] font-semibold tracking-[-0.025em] text-text-primary max-[700px]:text-[21px]">
          {block.text}
        </h2>
      );
    case "code":
      return (
        <pre className="m-0 overflow-x-auto rounded-[10px] border border-[rgba(242,237,228,0.09)] bg-[rgba(0,0,0,0.32)] px-[18px] py-4 font-mono text-[13px] leading-[1.65] text-text-secondary">
          <code>{block.text}</code>
        </pre>
      );
    case "list":
      return (
        <ul className="m-0 flex list-none flex-col gap-[10px] p-0">
          {block.items.map((item) => (
            <li key={item} className="flex gap-[11px] text-[16.5px] leading-[1.7] text-text-muted">
              <span className="font-mono text-[12.5px] text-accent">→</span>
              {item}
            </li>
          ))}
        </ul>
      );
    default:
      return (
        <p className="text-pretty m-0 text-[16.5px] leading-[1.75] text-text-muted max-[700px]:text-[15.5px]">
          {block.text}
        </p>
      );
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.id === slug);
  if (!post) notFound();

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-bg"
      style={{
        backgroundImage:
          "radial-gradient(1300px 760px at 50% -14%, rgba(224,138,92,0.085), transparent 64%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.2]"
        style={{
          backgroundImage: "radial-gradient(rgba(242,237,228,0.085) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />

      <main className="relative mx-auto w-full max-w-[min(740px,calc(100%-48px))] pt-[clamp(60px,10vh,110px)] pb-[clamp(80px,12vh,140px)]">
        <Link
          href="/#writing"
          className="inline-flex items-center gap-2 font-mono text-[11.5px] tracking-[0.07em] text-accent-light uppercase"
        >
          <span className="text-[15px] leading-none">←</span>All writing
        </Link>

        <p className="m-0 mt-[38px] mb-[14px] font-mono text-[11px] tracking-[0.12em] text-text-faint uppercase">
          {post.date}
          <span className="mx-[7px]">·</span>
          {post.readTime}
        </p>

        <h1 className="m-0 text-[clamp(30px,4vw,42px)] leading-[1.12] font-semibold tracking-[-0.035em] text-balance">
          {post.title}
        </h1>

        <p className="text-pretty m-0 mt-[18px] text-[18px] leading-[1.65] text-text-secondary max-[700px]:text-[16.5px]">
          {post.excerpt}
        </p>

        <div className="mt-[36px] mb-[44px] h-px bg-[rgba(242,237,228,0.09)]" />

        <article className="flex flex-col gap-[22px]">
          {post.body.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </article>

        <div className="mt-[56px] border-t border-[rgba(242,237,228,0.09)] pt-7">
          <Link
            href="/#writing"
            className="font-mono text-[11.5px] tracking-[0.06em] text-accent-light uppercase"
          >
            ← More writing
          </Link>
        </div>
      </main>
    </div>
  );
}
