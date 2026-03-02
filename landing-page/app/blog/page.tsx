import type { Metadata } from "next";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { BlogCard } from "@/components/blog/BlogCard";
import { getAllPosts } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tips, panduan, dan insight untuk mengelola bisnis laundry lebih cerdas bersama LaundryKu.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <SectionWrapper>
      <div className="mx-auto max-w-2xl text-center mb-14">
        <p
          className="mb-3"
          style={{
            fontFamily: "Manrope, system-ui",
            fontWeight: 700,
            fontSize: "0.85rem",
            color: "#00B4D8",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Blog
        </p>
        <h1
          style={{
            fontFamily: "Manrope, system-ui",
            fontWeight: 800,
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            color: "#0B1D35",
            lineHeight: 1.2,
          }}
        >
          Tips & Insight{" "}
          <span style={{ color: "#00B4D8" }}>Bisnis Laundry</span>
        </h1>
        <p
          className="mx-auto mt-4 max-w-xl"
          style={{
            fontFamily: "Nunito Sans, system-ui",
            fontSize: "1.05rem",
            lineHeight: 1.7,
            color: "#5A6B80",
          }}
        >
          Panduan praktis untuk mengelola dan mengembangkan bisnis laundry Anda.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="mx-auto max-w-md text-center py-12">
          <p
            style={{
              fontFamily: "Nunito Sans, system-ui",
              fontSize: "1rem",
              color: "#8899AA",
            }}
          >
            Belum ada artikel. Stay tuned!
          </p>
        </div>
      ) : (
        <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </SectionWrapper>
  );
}
