"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-2xl p-12 text-center"
        style={{ border: "1.5px solid #E8EDF2", background: "white" }}
      >
        <div
          className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: "rgba(0,200,83,0.1)" }}
        >
          <Send size={28} color="#00C853" />
        </div>
        <h3
          style={{
            fontFamily: "Manrope, system-ui",
            fontWeight: 800,
            fontSize: "1.25rem",
            color: "#0B1D35",
            marginBottom: 8,
          }}
        >
          Pesan Terkirim!
        </h3>
        <p
          style={{
            fontFamily: "Nunito Sans, system-ui",
            fontSize: "0.925rem",
            color: "#5A6B80",
            lineHeight: 1.6,
          }}
        >
          Terima kasih sudah menghubungi kami. Tim kami akan membalas dalam 1x24
          jam.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-2xl p-8"
      style={{ border: "1.5px solid #E8EDF2", background: "white" }}
    >
      <h3
        style={{
          fontFamily: "Manrope, system-ui",
          fontWeight: 800,
          fontSize: "1.25rem",
          color: "#0B1D35",
          marginBottom: 4,
        }}
      >
        Kirim Pesan
      </h3>

      <div>
        <label
          htmlFor="name"
          style={{
            fontFamily: "Manrope, system-ui",
            fontWeight: 700,
            fontSize: "0.8rem",
            color: "#3D5068",
            display: "block",
            marginBottom: 6,
          }}
        >
          Nama Lengkap
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Masukkan nama Anda"
          className="w-full rounded-xl px-4 py-3 outline-none transition-all"
          style={{
            fontFamily: "Nunito Sans, system-ui",
            fontSize: "0.925rem",
            border: "1.5px solid #E8EDF2",
            color: "#0B1D35",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#00B4D8")}
          onBlur={(e) => (e.target.style.borderColor = "#E8EDF2")}
        />
      </div>

      <div>
        <label
          htmlFor="email"
          style={{
            fontFamily: "Manrope, system-ui",
            fontWeight: 700,
            fontSize: "0.8rem",
            color: "#3D5068",
            display: "block",
            marginBottom: 6,
          }}
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="contoh@email.com"
          className="w-full rounded-xl px-4 py-3 outline-none transition-all"
          style={{
            fontFamily: "Nunito Sans, system-ui",
            fontSize: "0.925rem",
            border: "1.5px solid #E8EDF2",
            color: "#0B1D35",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#00B4D8")}
          onBlur={(e) => (e.target.style.borderColor = "#E8EDF2")}
        />
      </div>

      <div>
        <label
          htmlFor="message"
          style={{
            fontFamily: "Manrope, system-ui",
            fontWeight: 700,
            fontSize: "0.8rem",
            color: "#3D5068",
            display: "block",
            marginBottom: 6,
          }}
        >
          Pesan
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tulis pesan Anda di sini..."
          className="w-full resize-none rounded-xl px-4 py-3 outline-none transition-all"
          style={{
            fontFamily: "Nunito Sans, system-ui",
            fontSize: "0.925rem",
            border: "1.5px solid #E8EDF2",
            color: "#0B1D35",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#00B4D8")}
          onBlur={(e) => (e.target.style.borderColor = "#E8EDF2")}
        />
      </div>

      <Button type="submit" rightIcon={<Send size={16} />}>
        Kirim Pesan
      </Button>
    </form>
  );
}
