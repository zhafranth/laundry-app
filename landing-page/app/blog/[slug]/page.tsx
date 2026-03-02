import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { compileMDX } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";
import { mdxComponents } from "@/components/blog/MDXComponents";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not Found" };

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { content: mdxContent } = await compileMDX({
    source: post.content,
    components: mdxComponents,
  });

  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 transition-colors hover:opacity-70"
          style={{
            fontFamily: "Manrope, system-ui",
            fontWeight: 700,
            fontSize: "0.85rem",
            color: "#00B4D8",
          }}
        >
          <ArrowLeft size={16} />
          Kembali ke Blog
        </Link>

        {/* Category badge */}
        <span
          className="mb-4 inline-block rounded-full px-3 py-1"
          style={{
            fontFamily: "Manrope, system-ui",
            fontWeight: 700,
            fontSize: "0.7rem",
            color: "#00B4D8",
            background: "rgba(0,180,216,0.1)",
            border: "1px solid rgba(0,180,216,0.15)",
          }}
        >
          {post.frontmatter.category}
        </span>

        {/* Title */}
        <h1
          style={{
            fontFamily: "Manrope, system-ui",
            fontWeight: 800,
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            color: "#0B1D35",
            lineHeight: 1.25,
            marginBottom: 16,
          }}
        >
          {post.frontmatter.title}
        </h1>

        {/* Meta row */}
        <div
          className="mb-10 flex flex-wrap items-center gap-5 pb-8"
          style={{ borderBottom: "1.5px solid #E8EDF2" }}
        >
          <span
            className="flex items-center gap-1.5"
            style={{
              fontFamily: "Nunito Sans, system-ui",
              fontSize: "0.85rem",
              color: "#8899AA",
            }}
          >
            <User size={14} />
            {post.frontmatter.author}
          </span>
          <span
            className="flex items-center gap-1.5"
            style={{
              fontFamily: "Nunito Sans, system-ui",
              fontSize: "0.85rem",
              color: "#8899AA",
            }}
          >
            <Calendar size={14} />
            {formatDate(post.frontmatter.date)}
          </span>
          <span
            className="flex items-center gap-1.5"
            style={{
              fontFamily: "Nunito Sans, system-ui",
              fontSize: "0.85rem",
              color: "#8899AA",
            }}
          >
            <Clock size={14} />
            {post.frontmatter.readTime}
          </span>
        </div>

        {/* MDX Content */}
        <article>{mdxContent}</article>
      </div>
    </section>
  );
}
