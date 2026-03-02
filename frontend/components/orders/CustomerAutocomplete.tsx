"use client";

import { useState, useRef, useEffect } from "react";
import { Search, User, UserPlus, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { customerService } from "@/services/customer";
import { queryKeys } from "@/lib/query-keys";
import type { Customer } from "@/types";

interface CustomerAutocompleteProps {
  outletId: string;
  selectedCustomerId?: string;
  selectedName?: string;
  onSelect: (customer: { id?: string; name: string; phone: string }) => void;
  error?: string;
}

export function CustomerAutocomplete({
  outletId,
  selectedCustomerId,
  selectedName,
  onSelect,
  error,
}: CustomerAutocompleteProps) {
  const [query, setQuery] = useState(selectedName ?? "");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 350);

  const { data, isFetching } = useQuery({
    queryKey: queryKeys.customers.list(outletId, { search: debouncedQuery }),
    queryFn: () => customerService.search(outletId, debouncedQuery),
    enabled: !!outletId && debouncedQuery.length >= 1,
  });

  const customers = data?.data ?? [];

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleSelect(customer: Customer) {
    setQuery(customer.name);
    setOpen(false);
    onSelect({ id: customer.id, name: customer.name, phone: customer.phone });
  }

  function handleNewCustomer() {
    setOpen(false);
    onSelect({ id: undefined, name: query, phone: "" });
  }

  const showDropdown = open && query.length >= 1;
  const isSelected = !!selectedCustomerId;

  return (
    <div ref={containerRef} className="flex flex-col gap-1.5">
      <label
        style={{
          fontFamily: "Manrope, system-ui",
          fontWeight: 700,
          fontSize: "0.75rem",
          color: error ? "#EF2D56" : "#3D5068",
          letterSpacing: "0.01em",
        }}
      >
        Pelanggan
      </label>

      <div className="relative">
        <Search
          size={15}
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#8899AA",
            pointerEvents: "none",
          }}
        />

        <input
          type="text"
          placeholder="Cari nama pelanggan..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            if (!e.target.value) {
              onSelect({ id: undefined, name: "", phone: "" });
            }
          }}
          onFocus={() => setOpen(true)}
          style={{
            width: "100%",
            height: 48,
            paddingLeft: 40,
            paddingRight: isSelected ? 40 : 14,
            borderRadius: 12,
            border: `2px solid ${error ? "#EF2D56" : isSelected ? "#00B4D8" : "#E8EDF2"}`,
            fontFamily: "Nunito Sans, system-ui",
            fontWeight: 500,
            fontSize: "0.8125rem",
            color: "#0B1D35",
            background: "white",
            outline: "none",
          }}
        />

        {isSelected && (
          <Check
            size={15}
            style={{
              position: "absolute",
              right: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#00B4D8",
            }}
          />
        )}

        {/* Dropdown */}
        {showDropdown && (
          <div
            className="absolute left-0 right-0 z-50 rounded-xl overflow-hidden"
            style={{
              top: "calc(100% + 6px)",
              background: "white",
              border: "1.5px solid #E8EDF2",
              boxShadow: "0 8px 24px rgba(11,29,53,0.12)",
              maxHeight: 240,
              overflowY: "auto",
            }}
          >
            {isFetching && (
              <div
                style={{
                  padding: "12px 16px",
                  fontFamily: "Nunito Sans, system-ui",
                  fontSize: "0.8rem",
                  color: "#8899AA",
                }}
              >
                Mencari...
              </div>
            )}

            {!isFetching && customers.length === 0 && query.length >= 1 && (
              <button
                type="button"
                onClick={handleNewCustomer}
                className="w-full flex items-center gap-3 text-left"
                style={{
                  padding: "12px 16px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  borderTop: "none",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "#F5F7FA")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "transparent")
                }
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "rgba(0,180,216,0.10)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <UserPlus size={15} color="#00B4D8" />
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "Manrope, system-ui",
                      fontWeight: 700,
                      fontSize: "0.8125rem",
                      color: "#00B4D8",
                      margin: 0,
                    }}
                  >
                    Buat Pelanggan Baru
                  </p>
                  <p
                    style={{
                      fontFamily: "Nunito Sans, system-ui",
                      fontSize: "0.72rem",
                      color: "#8899AA",
                      margin: 0,
                    }}
                  >
                    &quot;{query}&quot; — isi nomor HP setelah pilih
                  </p>
                </div>
              </button>
            )}

            {customers.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSelect(c)}
                className="w-full flex items-center gap-3 text-left"
                style={{
                  padding: "10px 16px",
                  border: "none",
                  borderTop: "1px solid #F0F3F7",
                  background:
                    c.id === selectedCustomerId ? "#F0FAFE" : "transparent",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  if (c.id !== selectedCustomerId)
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#F5F7FA";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    c.id === selectedCustomerId ? "#F0FAFE" : "transparent";
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "rgba(136,153,170,0.10)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <User size={14} color="#8899AA" />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    style={{
                      fontFamily: "Manrope, system-ui",
                      fontWeight: 700,
                      fontSize: "0.8125rem",
                      color: "#0B1D35",
                      margin: 0,
                    }}
                  >
                    {c.name}
                  </p>
                  <p
                    style={{
                      fontFamily: "Nunito Sans, system-ui",
                      fontSize: "0.72rem",
                      color: "#8899AA",
                      margin: 0,
                    }}
                  >
                    {c.phone} · {c.totalOrders} order
                  </p>
                </div>
                {c.id === selectedCustomerId && (
                  <Check size={14} color="#00B4D8" />
                )}
              </button>
            ))}

            {!isFetching && customers.length > 0 && (
              <button
                type="button"
                onClick={handleNewCustomer}
                className="w-full flex items-center gap-3 text-left"
                style={{
                  padding: "10px 16px",
                  border: "none",
                  borderTop: "1.5px solid #E8EDF2",
                  background: "transparent",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "#F5F7FA")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "transparent")
                }
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "rgba(0,180,216,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <UserPlus size={14} color="#00B4D8" />
                </div>
                <p
                  style={{
                    fontFamily: "Manrope, system-ui",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    color: "#00B4D8",
                    margin: 0,
                  }}
                >
                  Tambah &quot;{query}&quot; sebagai pelanggan baru
                </p>
              </button>
            )}
          </div>
        )}
      </div>

      {error && (
        <p
          style={{
            fontFamily: "Nunito Sans, system-ui",
            fontWeight: 600,
            fontSize: "0.75rem",
            color: "#EF2D56",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
