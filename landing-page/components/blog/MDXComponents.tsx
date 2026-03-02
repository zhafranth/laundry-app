import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  h1: (props) => (
    <h1
      {...props}
      style={{
        fontFamily: "Manrope, system-ui",
        fontWeight: 800,
        fontSize: "2rem",
        color: "#0B1D35",
        lineHeight: 1.3,
        marginBottom: 16,
        marginTop: 32,
      }}
    />
  ),
  h2: (props) => (
    <h2
      {...props}
      style={{
        fontFamily: "Manrope, system-ui",
        fontWeight: 800,
        fontSize: "1.5rem",
        color: "#0B1D35",
        lineHeight: 1.3,
        marginBottom: 12,
        marginTop: 28,
      }}
    />
  ),
  h3: (props) => (
    <h3
      {...props}
      style={{
        fontFamily: "Manrope, system-ui",
        fontWeight: 700,
        fontSize: "1.2rem",
        color: "#0B1D35",
        lineHeight: 1.4,
        marginBottom: 8,
        marginTop: 24,
      }}
    />
  ),
  p: (props) => (
    <p
      {...props}
      style={{
        fontFamily: "Nunito Sans, system-ui",
        fontSize: "1rem",
        lineHeight: 1.8,
        color: "#3D5068",
        marginBottom: 16,
      }}
    />
  ),
  ul: (props) => (
    <ul
      {...props}
      className="mb-4 space-y-2 pl-5"
      style={{
        fontFamily: "Nunito Sans, system-ui",
        fontSize: "1rem",
        lineHeight: 1.8,
        color: "#3D5068",
        listStyleType: "disc",
      }}
    />
  ),
  ol: (props) => (
    <ol
      {...props}
      className="mb-4 space-y-2 pl-5"
      style={{
        fontFamily: "Nunito Sans, system-ui",
        fontSize: "1rem",
        lineHeight: 1.8,
        color: "#3D5068",
        listStyleType: "decimal",
      }}
    />
  ),
  blockquote: (props) => (
    <blockquote
      {...props}
      className="my-6 rounded-r-xl pl-4 py-3 pr-4"
      style={{
        borderLeft: "4px solid #00B4D8",
        background: "rgba(0,180,216,0.04)",
        fontFamily: "Nunito Sans, system-ui",
        fontSize: "1rem",
        fontStyle: "italic",
        color: "#3D5068",
      }}
    />
  ),
  strong: (props) => (
    <strong {...props} style={{ fontWeight: 700, color: "#0B1D35" }} />
  ),
  a: (props) => (
    <a
      {...props}
      style={{
        color: "#00B4D8",
        fontWeight: 600,
        textDecoration: "underline",
        textUnderlineOffset: 2,
      }}
      target="_blank"
      rel="noopener noreferrer"
    />
  ),
};
