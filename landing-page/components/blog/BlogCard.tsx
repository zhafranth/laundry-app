import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import type { BlogPost } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article
        className="flex h-full flex-col rounded-2xl overflow-hidden transition-all duration-200 group-hover:shadow-lg"
        style={{ border: "1.5px solid #E8EDF2", background: "white" }}
      >
        {/* Thumbnail placeholder */}
        <div
          className="relative h-48 w-full"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,180,216,0.08) 0%, rgba(255,183,3,0.06) 100%)",
          }}
        >
          <span
            className="absolute left-4 top-4 rounded-full px-3 py-1"
            style={{
              fontFamily: "Manrope, system-ui",
              fontWeight: 700,
              fontSize: "0.7rem",
              color: "#00B4D8",
              background: "rgba(0,180,216,0.1)",
              border: "1px solid rgba(0,180,216,0.15)",
            }}
          >
            {post.category}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-6">
          {/* Meta */}
          <div className="mb-3 flex items-center gap-4">
            <span
              className="flex items-center gap-1.5"
              style={{
                fontFamily: "Nunito Sans, system-ui",
                fontSize: "0.8rem",
                color: "#8899AA",
              }}
            >
              <Calendar size={13} />
              {formatDate(post.date)}
            </span>
            <span
              className="flex items-center gap-1.5"
              style={{
                fontFamily: "Nunito Sans, system-ui",
                fontSize: "0.8rem",
                color: "#8899AA",
              }}
            >
              <Clock size={13} />
              {post.readTime}
            </span>
          </div>

          {/* Title */}
          <h3
            className="mb-2 transition-colors group-hover:text-[#00B4D8]"
            style={{
              fontFamily: "Manrope, system-ui",
              fontWeight: 800,
              fontSize: "1.1rem",
              color: "#0B1D35",
              lineHeight: 1.35,
            }}
          >
            {post.title}
          </h3>

          {/* Description */}
          <p
            className="mb-4 flex-1"
            style={{
              fontFamily: "Nunito Sans, system-ui",
              fontSize: "0.875rem",
              lineHeight: 1.6,
              color: "#5A6B80",
            }}
          >
            {post.description}
          </p>

          {/* Read more */}
          <span
            className="mt-auto flex items-center gap-1.5 transition-all group-hover:gap-2.5"
            style={{
              fontFamily: "Manrope, system-ui",
              fontWeight: 700,
              fontSize: "0.85rem",
              color: "#00B4D8",
            }}
          >
            Baca Selengkapnya <ArrowRight size={14} />
          </span>
        </div>
      </article>
    </Link>
  );
}
