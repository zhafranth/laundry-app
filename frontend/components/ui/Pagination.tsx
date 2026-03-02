"use client";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        style={{
          height: 36,
          padding: "0 14px",
          borderRadius: 9,
          border: "1.5px solid #E8EDF2",
          background: page <= 1 ? "#F5F7FA" : "white",
          color: page <= 1 ? "#C4CDD6" : "#3D5068",
          fontFamily: "Manrope, system-ui",
          fontWeight: 600,
          fontSize: "0.8rem",
          cursor: page <= 1 ? "default" : "pointer",
        }}
      >
        &larr; Prev
      </button>

      {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
        const p = i + 1;
        return (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              border: `1.5px solid ${p === page ? "#00B4D8" : "#E8EDF2"}`,
              background: p === page ? "#00B4D8" : "white",
              color: p === page ? "white" : "#3D5068",
              fontFamily: "Manrope, system-ui",
              fontWeight: 700,
              fontSize: "0.8rem",
              cursor: "pointer",
            }}
          >
            {p}
          </button>
        );
      })}

      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        style={{
          height: 36,
          padding: "0 14px",
          borderRadius: 9,
          border: "1.5px solid #E8EDF2",
          background: page >= totalPages ? "#F5F7FA" : "white",
          color: page >= totalPages ? "#C4CDD6" : "#3D5068",
          fontFamily: "Manrope, system-ui",
          fontWeight: 600,
          fontSize: "0.8rem",
          cursor: page >= totalPages ? "default" : "pointer",
        }}
      >
        Next &rarr;
      </button>
    </div>
  );
}
