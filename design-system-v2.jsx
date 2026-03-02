import { useState } from "react";

const TABS = ["Brand", "Colors", "Typography", "Components", "Icons & Patterns"];

// ============== BRAND SECTION ==============
function BrandSection() {
  return (
    <div>
      {/* Logo & Name */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-6" style={{ background: "linear-gradient(135deg, #00B4D8, #0077B6)" }}>
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <path d="M26 6C15 6 8 14 8 24C8 34 15 42 26 42" stroke="white" strokeWidth="4" strokeLinecap="round"/>
            <path d="M26 42C37 42 44 34 44 24C44 14 37 6 26 6" stroke="#FFB703" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 4"/>
            <circle cx="26" cy="24" r="8" stroke="white" strokeWidth="3"/>
            <path d="M22 24C22 21 24 19 26 19" stroke="#FFB703" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 className="text-5xl mb-2" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 800 }}>
          Laundry<span style={{ color: "#00B4D8" }}>Ku</span>
        </h1>
        <p className="text-lg" style={{ color: "#5A6B80", fontFamily: "Nunito Sans, system-ui" }}>Smart Laundry Dashboard</p>
      </div>

      {/* Brand Story */}
      <div className="rounded-2xl p-8 mb-8" style={{ background: "linear-gradient(135deg, #0B1D35, #132D50)" }}>
        <h3 className="text-xl text-white mb-4" style={{ fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Brand Story</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm mb-2" style={{ color: "#00B4D8", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>NAMA</div>
            <div className="text-white text-lg mb-1" style={{ fontFamily: "Manrope, system-ui", fontWeight: 800 }}>LaundryKu</div>
            <div className="text-sm" style={{ color: "#8899AA", fontFamily: "Nunito Sans, system-ui" }}>Laundry + Ku (milikku). Nama yang personal, dekat dengan UMKM Indonesia. Terasa "ini tools saya" bukan tools korporat.</div>
          </div>
          <div>
            <div className="text-sm mb-2" style={{ color: "#FFB703", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>TAGLINE</div>
            <div className="text-white text-lg mb-1" style={{ fontFamily: "Manrope, system-ui", fontWeight: 800 }}>"Kelola Cerdas, Untung Lebih"</div>
            <div className="text-sm" style={{ color: "#8899AA", fontFamily: "Nunito Sans, system-ui" }}>Menekankan value utama: bukan cuma catat, tapi bantu ambil keputusan bisnis yang menguntungkan.</div>
          </div>
          <div>
            <div className="text-sm mb-2" style={{ color: "#00E5A0", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>PERSONALITY</div>
            <div className="text-white text-lg mb-1" style={{ fontFamily: "Manrope, system-ui", fontWeight: 800 }}>Bold • Smart • Friendly</div>
            <div className="text-sm" style={{ color: "#8899AA", fontFamily: "Nunito Sans, system-ui" }}>Visual yang berani dan modern, fitur cerdas berbasis data, tapi tetap mudah dipakai siapapun.</div>
          </div>
        </div>
      </div>

      {/* Logo Variants */}
      <h3 className="text-xl mb-4" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Logo Variants</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Light bg */}
        <div className="rounded-2xl p-8 flex flex-col items-center justify-center border-2" style={{ borderColor: "#E8EDF2" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #00B4D8, #0077B6)" }}>
              <svg width="22" height="22" viewBox="0 0 52 52" fill="none">
                <path d="M26 6C15 6 8 14 8 24C8 34 15 42 26 42" stroke="white" strokeWidth="5" strokeLinecap="round"/>
                <path d="M26 42C37 42 44 34 44 24C44 14 37 6 26 6" stroke="#FFB703" strokeWidth="5" strokeLinecap="round" strokeDasharray="6 4"/>
                <circle cx="26" cy="24" r="8" stroke="white" strokeWidth="4"/>
              </svg>
            </div>
            <span className="text-2xl" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 800 }}>Laundry<span style={{ color: "#00B4D8" }}>Ku</span></span>
          </div>
          <span className="text-xs px-3 py-1 rounded-full" style={{ background: "#F0F4F8", color: "#5A6B80", fontFamily: "Nunito Sans, system-ui", fontWeight: 600 }}>On Light</span>
        </div>
        {/* Dark bg */}
        <div className="rounded-2xl p-8 flex flex-col items-center justify-center" style={{ background: "#0B1D35" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #00B4D8, #0077B6)" }}>
              <svg width="22" height="22" viewBox="0 0 52 52" fill="none">
                <path d="M26 6C15 6 8 14 8 24C8 34 15 42 26 42" stroke="white" strokeWidth="5" strokeLinecap="round"/>
                <path d="M26 42C37 42 44 34 44 24C44 14 37 6 26 6" stroke="#FFB703" strokeWidth="5" strokeLinecap="round" strokeDasharray="6 4"/>
                <circle cx="26" cy="24" r="8" stroke="white" strokeWidth="4"/>
              </svg>
            </div>
            <span className="text-2xl text-white" style={{ fontFamily: "Manrope, system-ui", fontWeight: 800 }}>Laundry<span style={{ color: "#00B4D8" }}>Ku</span></span>
          </div>
          <span className="text-xs px-3 py-1 rounded-full" style={{ background: "#1A2D45", color: "#8899AA", fontFamily: "Nunito Sans, system-ui", fontWeight: 600 }}>On Dark</span>
        </div>
        {/* Colored bg */}
        <div className="rounded-2xl p-8 flex flex-col items-center justify-center" style={{ background: "linear-gradient(135deg, #00B4D8, #0077B6)" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white bg-opacity-20">
              <svg width="22" height="22" viewBox="0 0 52 52" fill="none">
                <path d="M26 6C15 6 8 14 8 24C8 34 15 42 26 42" stroke="white" strokeWidth="5" strokeLinecap="round"/>
                <path d="M26 42C37 42 44 34 44 24C44 14 37 6 26 6" stroke="#FFB703" strokeWidth="5" strokeLinecap="round" strokeDasharray="6 4"/>
                <circle cx="26" cy="24" r="8" stroke="white" strokeWidth="4"/>
              </svg>
            </div>
            <span className="text-2xl text-white" style={{ fontFamily: "Manrope, system-ui", fontWeight: 800 }}>LaundryKu</span>
          </div>
          <span className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.2)", color: "white", fontFamily: "Nunito Sans, system-ui", fontWeight: 600 }}>On Brand</span>
        </div>
      </div>
    </div>
  );
}

// ============== COLORS SECTION ==============
function ColorSwatch({ name, hex, desc, large }) {
  return (
    <div>
      <div className={`rounded-2xl ${large ? "h-28" : "h-20"} mb-3 shadow-sm`} style={{ background: hex }} />
      <div className="text-sm" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>{name}</div>
      <div className="text-xs font-mono" style={{ color: "#5A6B80" }}>{hex}</div>
      {desc && <div className="text-xs mt-1" style={{ color: "#8899AA", fontFamily: "Nunito Sans, system-ui" }}>{desc}</div>}
    </div>
  );
}

function ColorsSection() {
  return (
    <div>
      {/* Primary */}
      <h3 className="text-xl mb-4" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Primary Colors</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        <ColorSwatch name="Cyan 100" hex="#E0F7FA" desc="Background light" />
        <ColorSwatch name="Cyan 300" hex="#4DD0E1" desc="Hover state" />
        <ColorSwatch name="Cyan 500" hex="#00B4D8" desc="★ Primary" large />
        <ColorSwatch name="Cyan 700" hex="#0077B6" desc="Pressed state" />
        <ColorSwatch name="Cyan 900" hex="#004E75" desc="Text on light" />
      </div>

      {/* Secondary */}
      <h3 className="text-xl mb-4" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Secondary / Accent</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        <ColorSwatch name="Amber 100" hex="#FFF3D0" desc="Background light" />
        <ColorSwatch name="Amber 300" hex="#FFD166" desc="Hover state" />
        <ColorSwatch name="Amber 500" hex="#FFB703" desc="★ Secondary" large />
        <ColorSwatch name="Amber 700" hex="#E09600" desc="Pressed state" />
        <ColorSwatch name="Amber 900" hex="#8B5E00" desc="Text on light" />
      </div>

      {/* Neutrals */}
      <h3 className="text-xl mb-4" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Neutrals</h3>
      <div className="grid grid-cols-3 md:grid-cols-7 gap-3 mb-10">
        <ColorSwatch name="Navy 950" hex="#0B1D35" desc="Heading text" />
        <ColorSwatch name="Navy 800" hex="#1A2D45" desc="Body text" />
        <ColorSwatch name="Navy 600" hex="#3D5068" desc="Secondary text" />
        <ColorSwatch name="Gray 400" hex="#8899AA" desc="Muted text" />
        <ColorSwatch name="Gray 200" hex="#C4CDD6" desc="Border" />
        <ColorSwatch name="Gray 100" hex="#E8EDF2" desc="Divider" />
        <ColorSwatch name="Gray 50" hex="#F5F7FA" desc="Background" />
      </div>

      {/* Semantic */}
      <h3 className="text-xl mb-4" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Semantic Colors</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div>
          <div className="h-20 rounded-2xl mb-2 flex items-center justify-center text-white" style={{ background: "#00C853", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Success</div>
          <div className="text-xs font-mono" style={{ color: "#5A6B80" }}>#00C853 — Pembayaran lunas, order selesai</div>
        </div>
        <div>
          <div className="h-20 rounded-2xl mb-2 flex items-center justify-center text-white" style={{ background: "#FF6B35", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Warning</div>
          <div className="text-xs font-mono" style={{ color: "#5A6B80" }}>#FF6B35 — Stok menipis, deadline dekat</div>
        </div>
        <div>
          <div className="h-20 rounded-2xl mb-2 flex items-center justify-center text-white" style={{ background: "#EF2D56", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Error</div>
          <div className="text-xs font-mono" style={{ color: "#5A6B80" }}>#EF2D56 — Gagal, overdue, rugi</div>
        </div>
        <div>
          <div className="h-20 rounded-2xl mb-2 flex items-center justify-center text-white" style={{ background: "#7C4DFF", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Info</div>
          <div className="text-xs font-mono" style={{ color: "#5A6B80" }}>#7C4DFF — Tips, insight, notifikasi</div>
        </div>
      </div>

      {/* Gradient */}
      <h3 className="text-xl mb-4" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Gradients</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="h-24 rounded-2xl mb-2" style={{ background: "linear-gradient(135deg, #00B4D8, #0077B6)" }} />
          <div className="text-sm" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Primary Gradient</div>
          <div className="text-xs" style={{ color: "#8899AA", fontFamily: "Nunito Sans, system-ui" }}>Header, CTA utama, sidebar</div>
        </div>
        <div>
          <div className="h-24 rounded-2xl mb-2" style={{ background: "linear-gradient(135deg, #FFB703, #FF6B35)" }} />
          <div className="text-sm" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Accent Gradient</div>
          <div className="text-xs" style={{ color: "#8899AA", fontFamily: "Nunito Sans, system-ui" }}>Badge Pro, highlight, promo</div>
        </div>
        <div>
          <div className="h-24 rounded-2xl mb-2" style={{ background: "linear-gradient(135deg, #0B1D35, #1A2D45)" }} />
          <div className="text-sm" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Dark Gradient</div>
          <div className="text-xs" style={{ color: "#8899AA", fontFamily: "Nunito Sans, system-ui" }}>Sidebar, card gelap, footer</div>
        </div>
      </div>
    </div>
  );
}

// ============== TYPOGRAPHY SECTION ==============
function TypographySection() {
  return (
    <div>
      <h3 className="text-xl mb-2" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Font Family</h3>
      <div className="rounded-2xl p-6 mb-8" style={{ background: "#F5F7FA" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="text-sm mb-3" style={{ color: "#00B4D8", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>HEADING — Manrope</div>
            <div className="text-4xl mb-2" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 800 }}>Aa Bb Cc 123</div>
            <div className="text-sm" style={{ color: "#8899AA", fontFamily: "Nunito Sans, system-ui" }}>Humanist sans-serif, warm tapi tetap profesional. Cocok untuk heading yang tegas namun approachable.</div>
            <div className="flex gap-2 mt-3">
              {[500, 600, 700, 800].map(w => (
                <span key={w} className="px-3 py-1 rounded-lg text-xs" style={{ background: "white", color: "#3D5068", fontFamily: "Manrope, system-ui", fontWeight: w }}>{w}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm mb-3" style={{ color: "#FFB703", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>BODY — Nunito Sans</div>
            <div className="text-2xl mb-2" style={{ color: "#0B1D35", fontFamily: "Nunito Sans, system-ui", fontWeight: 400 }}>Aa Bb Cc 123</div>
            <div className="text-sm" style={{ color: "#8899AA", fontFamily: "Nunito Sans, system-ui" }}>Soft & rounded, sangat mudah dibaca di layar. Sempurna untuk data tables, form, dan body text dashboard.</div>
            <div className="flex gap-2 mt-3">
              {[400, 500, 600, 700].map(w => (
                <span key={w} className="px-3 py-1 rounded-lg text-xs" style={{ background: "white", color: "#3D5068", fontFamily: "Nunito Sans, system-ui", fontWeight: w }}>{w}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Font Pairing Demo */}
      <h3 className="text-xl mb-4" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Font Pairing Preview</h3>
      <div className="rounded-2xl p-6 mb-8 bg-white" style={{ border: "1px solid #E8EDF2" }}>
        <div className="text-2xl mb-2" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 800 }}>Dashboard Keuangan Outlet</div>
        <div className="text-base mb-4" style={{ color: "#5A6B80", fontFamily: "Nunito Sans, system-ui", fontWeight: 400, lineHeight: "1.6" }}>
          Pantau pendapatan, pengeluaran, dan profit outlet laundry kamu secara real-time. Dapatkan insight cerdas untuk mengambil keputusan bisnis yang lebih menguntungkan.
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-xl text-white text-sm" style={{ background: "#00B4D8", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Lihat Laporan</button>
          <button className="px-5 py-2.5 rounded-xl text-sm" style={{ border: "2px solid #E8EDF2", color: "#5A6B80", fontFamily: "Nunito Sans, system-ui", fontWeight: 600 }}>Export PDF</button>
        </div>
      </div>

      {/* Type Scale */}
      <h3 className="text-xl mb-4" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Type Scale</h3>
      <div className="space-y-4 mb-10">
        {[
          { name: "Display", size: "36px", weight: 800, lh: "44px", font: "Manrope", use: "Dashboard title, angka besar" },
          { name: "H1", size: "28px", weight: 800, lh: "36px", font: "Manrope", use: "Page title" },
          { name: "H2", size: "22px", weight: 700, lh: "28px", font: "Manrope", use: "Section header" },
          { name: "H3", size: "18px", weight: 700, lh: "24px", font: "Manrope", use: "Card title" },
          { name: "Body L", size: "16px", weight: 400, lh: "24px", font: "Nunito Sans", use: "Body text utama" },
          { name: "Body M", size: "14px", weight: 400, lh: "20px", font: "Nunito Sans", use: "Table, form label" },
          { name: "Caption", size: "12px", weight: 600, lh: "16px", font: "Nunito Sans", use: "Helper text, timestamp" },
          { name: "Overline", size: "11px", weight: 700, lh: "16px", font: "Manrope", use: "Label kategori, badge" },
        ].map((t) => (
          <div key={t.name} className="flex items-center gap-4 pb-4" style={{ borderBottom: "1px solid #E8EDF2" }}>
            <div className="w-28 shrink-0">
              <div className="text-xs" style={{ color: "#00B4D8", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>{t.name}</div>
              <div className="text-xs font-mono" style={{ color: "#8899AA" }}>{t.size} / {t.lh}</div>
              <div className="text-xs" style={{ color: "#C4CDD6", fontFamily: "Nunito Sans, system-ui" }}>{t.font}</div>
            </div>
            <div className="flex-1" style={{ fontSize: t.size, fontWeight: t.weight, lineHeight: t.lh, color: "#0B1D35", fontFamily: `${t.font}, system-ui` }}>
              Kelola Cerdas, Untung Lebih
            </div>
            <div className="hidden md:block text-xs w-40 shrink-0" style={{ color: "#8899AA", fontFamily: "Nunito Sans, system-ui" }}>{t.use}</div>
          </div>
        ))}
      </div>

      {/* Number Display */}
      <h3 className="text-xl mb-4" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Angka / Data Display</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl p-5" style={{ background: "#F5F7FA" }}>
          <div className="text-xs mb-1" style={{ color: "#8899AA", fontFamily: "Manrope, system-ui", fontWeight: 700, letterSpacing: "0.05em" }}>OMZET HARI INI</div>
          <div className="text-3xl" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 800 }}>Rp 2.4<span className="text-lg">jt</span></div>
          <div className="text-xs mt-1" style={{ color: "#00C853", fontFamily: "Nunito Sans, system-ui", fontWeight: 700 }}>↑ 12% dari kemarin</div>
        </div>
        <div className="rounded-2xl p-5" style={{ background: "#F5F7FA" }}>
          <div className="text-xs mb-1" style={{ color: "#8899AA", fontFamily: "Manrope, system-ui", fontWeight: 700, letterSpacing: "0.05em" }}>ORDER AKTIF</div>
          <div className="text-3xl" style={{ color: "#00B4D8", fontFamily: "Manrope, system-ui", fontWeight: 800 }}>24</div>
          <div className="text-xs mt-1" style={{ color: "#FF6B35", fontFamily: "Nunito Sans, system-ui", fontWeight: 700 }}>3 mendekati deadline</div>
        </div>
        <div className="rounded-2xl p-5" style={{ background: "#F5F7FA" }}>
          <div className="text-xs mb-1" style={{ color: "#8899AA", fontFamily: "Manrope, system-ui", fontWeight: 700, letterSpacing: "0.05em" }}>MARGIN RATA-RATA</div>
          <div className="text-3xl" style={{ color: "#00C853", fontFamily: "Manrope, system-ui", fontWeight: 800 }}>67<span className="text-lg">%</span></div>
          <div className="text-xs mt-1" style={{ color: "#8899AA", fontFamily: "Nunito Sans, system-ui", fontWeight: 600 }}>Target: 60%</div>
        </div>
        <div className="rounded-2xl p-5" style={{ background: "#F5F7FA" }}>
          <div className="text-xs mb-1" style={{ color: "#8899AA", fontFamily: "Manrope, system-ui", fontWeight: 700, letterSpacing: "0.05em" }}>HEALTH SCORE</div>
          <div className="text-3xl" style={{ color: "#FFB703", fontFamily: "Manrope, system-ui", fontWeight: 800 }}>82</div>
          <div className="text-xs mt-1" style={{ color: "#FFB703", fontFamily: "Nunito Sans, system-ui", fontWeight: 700 }}>Baik — bisa lebih baik</div>
        </div>
      </div>
    </div>
  );
}

// ============== COMPONENTS SECTION ==============
function ComponentsSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [toggled, setToggled] = useState(false);

  return (
    <div>
      {/* Buttons */}
      <h3 className="text-xl mb-4" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Buttons</h3>
      <div className="rounded-2xl p-6 mb-8" style={{ background: "#F5F7FA" }}>
        <div className="flex flex-wrap gap-3 mb-6">
          <button className="px-6 py-3 rounded-xl text-white text-sm" style={{ background: "linear-gradient(135deg, #00B4D8, #0077B6)", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>
            Primary Button
          </button>
          <button className="px-6 py-3 rounded-xl text-sm" style={{ background: "white", color: "#00B4D8", border: "2px solid #00B4D8", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>
            Secondary
          </button>
          <button className="px-6 py-3 rounded-xl text-white text-sm" style={{ background: "linear-gradient(135deg, #FFB703, #FF6B35)", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>
            Accent / CTA
          </button>
          <button className="px-6 py-3 rounded-xl text-sm" style={{ background: "white", color: "#EF2D56", border: "2px solid #EF2D56", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>
            Danger
          </button>
          <button className="px-5 py-3 rounded-xl text-sm" style={{ background: "#E8EDF2", color: "#5A6B80", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>
            Ghost
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 rounded-lg text-white text-xs" style={{ background: "#00B4D8", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Small</button>
          <button className="px-6 py-3 rounded-xl text-white text-sm" style={{ background: "#00B4D8", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Medium (Default)</button>
          <button className="px-8 py-4 rounded-2xl text-white text-base" style={{ background: "#00B4D8", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Large</button>
        </div>
      </div>

      {/* Badges & Status */}
      <h3 className="text-xl mb-4" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Badges & Status</h3>
      <div className="rounded-2xl p-6 mb-8" style={{ background: "#F5F7FA" }}>
        <div className="text-xs mb-2" style={{ color: "#8899AA", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>ORDER STATUS</div>
        <div className="flex flex-wrap gap-3 mb-5">
          <span className="px-3 py-1.5 rounded-full text-xs text-white" style={{ background: "#00B4D8", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Masuk</span>
          <span className="px-3 py-1.5 rounded-full text-xs text-white" style={{ background: "#7C4DFF", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Proses</span>
          <span className="px-3 py-1.5 rounded-full text-xs text-white" style={{ background: "#FFB703", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Siap Diambil</span>
          <span className="px-3 py-1.5 rounded-full text-xs text-white" style={{ background: "#00C853", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Selesai</span>
          <span className="px-3 py-1.5 rounded-full text-xs text-white" style={{ background: "#EF2D56", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Overdue</span>
        </div>
        <div className="text-xs mb-2" style={{ color: "#8899AA", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>JENIS LAYANAN</div>
        <div className="flex flex-wrap gap-3 mb-5">
          <span className="px-3 py-1.5 rounded-full text-xs" style={{ background: "#E0F7FA", color: "#0077B6", fontFamily: "Manrope, system-ui", fontWeight: 600 }}>Cuci Kiloan</span>
          <span className="px-3 py-1.5 rounded-full text-xs" style={{ background: "#FFF3D0", color: "#8B5E00", fontFamily: "Manrope, system-ui", fontWeight: 600 }}>Express</span>
          <span className="px-3 py-1.5 rounded-full text-xs" style={{ background: "#F0E6FF", color: "#7C4DFF", fontFamily: "Manrope, system-ui", fontWeight: 600 }}>Dry Clean</span>
          <span className="px-3 py-1.5 rounded-full text-xs" style={{ background: "#E8F5E9", color: "#2E7D32", fontFamily: "Manrope, system-ui", fontWeight: 600 }}>Setrika</span>
        </div>
        <div className="text-xs mb-2" style={{ color: "#8899AA", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>PLAN & PAYMENT</div>
        <div className="flex flex-wrap gap-3">
          <span className="px-3 py-1.5 rounded-lg text-xs text-white" style={{ background: "linear-gradient(135deg, #FFB703, #FF6B35)", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>⚡ PRO</span>
          <span className="px-3 py-1.5 rounded-lg text-xs" style={{ background: "#E8EDF2", color: "#5A6B80", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>REGULAR</span>
          <span className="px-3 py-1.5 rounded-full text-xs text-white" style={{ background: "#00C853", fontFamily: "Nunito Sans, system-ui", fontWeight: 700 }}>● Lunas</span>
          <span className="px-3 py-1.5 rounded-full text-xs text-white" style={{ background: "#EF2D56", fontFamily: "Nunito Sans, system-ui", fontWeight: 700 }}>● Belum Bayar</span>
        </div>
      </div>

      {/* Cards */}
      <h3 className="text-xl mb-4" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Cards</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Stat Card */}
        <div className="rounded-2xl p-5 bg-white" style={{ border: "1px solid #E8EDF2" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#E0F7FA" }}>
              <span style={{ color: "#00B4D8" }}>💰</span>
            </div>
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: "#E8F5E9", color: "#00C853", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>+12%</span>
          </div>
          <div className="text-xs mb-1" style={{ color: "#8899AA", letterSpacing: "0.05em", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>PENDAPATAN</div>
          <div className="text-2xl" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 800 }}>Rp 2.450.000</div>
        </div>

        {/* Order Card */}
        <div className="rounded-2xl p-5 bg-white" style={{ border: "1px solid #E8EDF2" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>#ORD-0247</span>
            <span className="px-2 py-1 rounded-full text-xs text-white" style={{ background: "#7C4DFF", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Proses</span>
          </div>
          <div className="text-sm mb-1" style={{ color: "#5A6B80", fontFamily: "Nunito Sans, system-ui" }}>Ibu Sari — Cuci Kiloan</div>
          <div className="flex justify-between items-center mt-3 pt-3" style={{ borderTop: "1px solid #E8EDF2" }}>
            <span className="text-xs" style={{ color: "#8899AA", fontFamily: "Nunito Sans, system-ui" }}>3.5 kg</span>
            <span className="text-sm" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Rp 24.500</span>
          </div>
        </div>

        {/* Alert Card */}
        <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg, #FFF3D0, #FFF8E8)" }}>
          <div className="flex items-center gap-2 mb-2">
            <span>⚠️</span>
            <span className="text-sm" style={{ color: "#8B5E00", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Stok Menipis</span>
          </div>
          <div className="text-sm mb-3" style={{ color: "#8B5E00", fontFamily: "Nunito Sans, system-ui" }}>Deterjen cair tersisa 2.5 kg, estimasi habis dalam 3 hari.</div>
          <button className="px-4 py-2 rounded-lg text-xs text-white" style={{ background: "#FFB703", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Restock Sekarang</button>
        </div>
      </div>

      {/* Input & Form */}
      <h3 className="text-xl mb-4" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Form Elements</h3>
      <div className="rounded-2xl p-6 mb-8" style={{ background: "#F5F7FA" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs mb-2 block" style={{ color: "#3D5068", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Nama Pelanggan</label>
            <input
              type="text"
              placeholder="Masukkan nama..."
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ border: "2px solid #E8EDF2", color: "#0B1D35", fontFamily: "Nunito Sans, system-ui" }}
              readOnly
            />
          </div>
          <div>
            <label className="text-xs mb-2 block" style={{ color: "#3D5068", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Jenis Layanan</label>
            <div className="w-full px-4 py-3 rounded-xl text-sm flex items-center justify-between" style={{ border: "2px solid #00B4D8", background: "white", color: "#0B1D35", fontFamily: "Nunito Sans, system-ui" }}>
              <span>Cuci Kiloan</span>
              <span style={{ color: "#00B4D8" }}>▾</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs mb-2 block" style={{ color: "#EF2D56", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Nomor Telepon (Error)</label>
            <input
              type="text"
              value="08123"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ border: "2px solid #EF2D56", color: "#0B1D35", background: "#FFF0F3", fontFamily: "Nunito Sans, system-ui" }}
              readOnly
            />
            <div className="text-xs mt-1" style={{ color: "#EF2D56", fontFamily: "Nunito Sans, system-ui" }}>Nomor telepon tidak valid</div>
          </div>
          <div>
            <label className="text-xs mb-2 block" style={{ color: "#3D5068", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Toggle</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setToggled(!toggled)}>
                <div className="w-11 h-6 rounded-full flex items-center px-0.5 transition-all" style={{ background: toggled ? "#00B4D8" : "#C4CDD6" }}>
                  <div className="w-5 h-5 rounded-full bg-white shadow transition-all" style={{ marginLeft: toggled ? "20px" : "0px" }} />
                </div>
                <span className="text-sm" style={{ color: "#3D5068", fontFamily: "Nunito Sans, system-ui" }}>Auto-calculate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <h3 className="text-xl mb-4" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Tabs</h3>
      <div className="rounded-2xl p-6 mb-8" style={{ background: "#F5F7FA" }}>
        <div className="inline-flex rounded-xl p-1" style={{ background: "#E8EDF2" }}>
          {["Semua", "Proses", "Selesai", "Overdue"].map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className="px-4 py-2 rounded-lg text-sm transition-all"
              style={{
                background: activeTab === i ? "white" : "transparent",
                color: activeTab === i ? "#00B4D8" : "#8899AA",
                boxShadow: activeTab === i ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                fontFamily: "Manrope, system-ui",
                fontWeight: activeTab === i ? 700 : 600,
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table Preview */}
      <h3 className="text-xl mb-4" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Table</h3>
      <div className="rounded-2xl overflow-hidden bg-white" style={{ border: "1px solid #E8EDF2" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "#F5F7FA" }}>
              <th className="text-left p-4 text-xs" style={{ color: "#8899AA", letterSpacing: "0.05em", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>ORDER ID</th>
              <th className="text-left p-4 text-xs" style={{ color: "#8899AA", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>PELANGGAN</th>
              <th className="text-left p-4 text-xs" style={{ color: "#8899AA", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>LAYANAN</th>
              <th className="text-left p-4 text-xs" style={{ color: "#8899AA", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>STATUS</th>
              <th className="text-right p-4 text-xs" style={{ color: "#8899AA", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: "#ORD-0247", name: "Ibu Sari", svc: "Cuci Kiloan", status: "Proses", color: "#7C4DFF", total: "Rp 24.500" },
              { id: "#ORD-0246", name: "Pak Budi", svc: "Express", status: "Siap Diambil", color: "#FFB703", total: "Rp 45.000" },
              { id: "#ORD-0245", name: "Rina", svc: "Dry Clean", status: "Selesai", color: "#00C853", total: "Rp 85.000" },
            ].map((row) => (
              <tr key={row.id} style={{ borderBottom: "1px solid #E8EDF2" }}>
                <td className="p-4" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>{row.id}</td>
                <td className="p-4" style={{ color: "#3D5068", fontFamily: "Nunito Sans, system-ui" }}>{row.name}</td>
                <td className="p-4" style={{ color: "#3D5068", fontFamily: "Nunito Sans, system-ui" }}>{row.svc}</td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded-full text-xs text-white" style={{ background: row.color, fontFamily: "Manrope, system-ui", fontWeight: 700 }}>{row.status}</span>
                </td>
                <td className="p-4 text-right" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>{row.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============== ICONS & PATTERNS ==============
function IconsSection() {
  return (
    <div>
      <h3 className="text-xl mb-2" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Icon Style</h3>
      <p className="text-sm mb-6" style={{ color: "#5A6B80", fontFamily: "Nunito Sans, system-ui" }}>Gunakan <strong>Lucide Icons</strong> — outline style, 24px, stroke-width 2. Konsisten di seluruh app.</p>

      <div className="rounded-2xl p-6 mb-8" style={{ background: "#F5F7FA" }}>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {[
            { icon: "📊", label: "Dashboard" },
            { icon: "📝", label: "Order" },
            { icon: "👥", label: "Pelanggan" },
            { icon: "💰", label: "Keuangan" },
            { icon: "📦", label: "Inventory" },
            { icon: "👔", label: "Karyawan" },
            { icon: "⚙️", label: "Setting" },
            { icon: "🔔", label: "Notifikasi" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white">
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs" style={{ color: "#5A6B80", fontFamily: "Nunito Sans, system-ui" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Spacing & Radius */}
      <h3 className="text-xl mb-4" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Spacing System</h3>
      <div className="rounded-2xl p-6 mb-8" style={{ background: "#F5F7FA" }}>
        <div className="space-y-3">
          {[
            { name: "4px", val: "0.25rem", use: "Inline spacing, icon gap" },
            { name: "8px", val: "0.5rem", use: "Compact padding, small gap" },
            { name: "12px", val: "0.75rem", use: "Form padding, list gap" },
            { name: "16px", val: "1rem", use: "Card padding, section gap" },
            { name: "24px", val: "1.5rem", use: "Section padding, card gap" },
            { name: "32px", val: "2rem", use: "Page padding, large sections" },
            { name: "48px", val: "3rem", use: "Major section dividers" },
          ].map((s) => (
            <div key={s.name} className="flex items-center gap-4">
              <div className="w-16 text-xs font-mono" style={{ color: "#00B4D8", fontWeight: 700 }}>{s.name}</div>
              <div className="rounded" style={{ width: s.val, height: "16px", background: "#00B4D8" }} />
              <div className="text-xs" style={{ color: "#5A6B80", fontFamily: "Nunito Sans, system-ui" }}>{s.use}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Border Radius */}
      <h3 className="text-xl mb-4" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Border Radius</h3>
      <div className="rounded-2xl p-6 mb-8" style={{ background: "#F5F7FA" }}>
        <div className="flex flex-wrap gap-6 items-end">
          {[
            { name: "sm", val: "8px", size: "48px" },
            { name: "md", val: "12px", size: "48px" },
            { name: "lg", val: "16px", size: "48px" },
            { name: "xl", val: "20px", size: "64px" },
            { name: "2xl", val: "24px", size: "80px" },
            { name: "full", val: "999px", size: "48px" },
          ].map((r) => (
            <div key={r.name} className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center bg-white" style={{ width: r.size, height: r.size, borderRadius: r.val, border: "2px solid #00B4D8" }}>
                <span className="text-xs font-mono" style={{ color: "#00B4D8" }}>{r.val}</span>
              </div>
              <span className="text-xs" style={{ color: "#3D5068", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>{r.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Shadow */}
      <h3 className="text-xl mb-4" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Elevation / Shadow</h3>
      <div className="rounded-2xl p-6 mb-8" style={{ background: "#F5F7FA" }}>
        <div className="flex flex-wrap gap-6">
          {[
            { name: "None", shadow: "none" },
            { name: "sm", shadow: "0 1px 2px rgba(11,29,53,0.06)" },
            { name: "md", shadow: "0 4px 12px rgba(11,29,53,0.08)" },
            { name: "lg", shadow: "0 8px 24px rgba(11,29,53,0.12)" },
            { name: "xl", shadow: "0 16px 48px rgba(11,29,53,0.16)" },
          ].map((s) => (
            <div key={s.name} className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center" style={{ boxShadow: s.shadow }}>
                <span className="text-xs" style={{ color: "#3D5068", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>{s.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Variables */}
      <h3 className="text-xl mb-4" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>CSS Variables (Dev Reference)</h3>
      <div className="rounded-2xl p-5 font-mono text-xs overflow-x-auto" style={{ background: "#0B1D35", color: "#8899AA" }}>
        <div style={{ color: "#5A6B80" }}>/* ===== LaundryKu Design Tokens ===== */</div>
        <br />
        <div style={{ color: "#5A6B80" }}>/* Primary */</div>
        <div><span style={{ color: "#00B4D8" }}>--color-primary-100</span>: #E0F7FA;</div>
        <div><span style={{ color: "#00B4D8" }}>--color-primary-300</span>: #4DD0E1;</div>
        <div><span style={{ color: "#00B4D8" }}>--color-primary-500</span>: #00B4D8;</div>
        <div><span style={{ color: "#00B4D8" }}>--color-primary-700</span>: #0077B6;</div>
        <div><span style={{ color: "#00B4D8" }}>--color-primary-900</span>: #004E75;</div>
        <br />
        <div style={{ color: "#5A6B80" }}>/* Secondary */</div>
        <div><span style={{ color: "#FFB703" }}>--color-secondary-100</span>: #FFF3D0;</div>
        <div><span style={{ color: "#FFB703" }}>--color-secondary-500</span>: #FFB703;</div>
        <div><span style={{ color: "#FFB703" }}>--color-secondary-700</span>: #E09600;</div>
        <br />
        <div style={{ color: "#5A6B80" }}>/* Semantic */</div>
        <div><span style={{ color: "#00C853" }}>--color-success</span>: #00C853;</div>
        <div><span style={{ color: "#FF6B35" }}>--color-warning</span>: #FF6B35;</div>
        <div><span style={{ color: "#EF2D56" }}>--color-error</span>: #EF2D56;</div>
        <div><span style={{ color: "#7C4DFF" }}>--color-info</span>: #7C4DFF;</div>
        <br />
        <div style={{ color: "#5A6B80" }}>/* Neutrals */</div>
        <div><span style={{ color: "#C4CDD6" }}>--color-navy-950</span>: #0B1D35;</div>
        <div><span style={{ color: "#C4CDD6" }}>--color-navy-800</span>: #1A2D45;</div>
        <div><span style={{ color: "#C4CDD6" }}>--color-gray-400</span>: #8899AA;</div>
        <div><span style={{ color: "#C4CDD6" }}>--color-gray-200</span>: #C4CDD6;</div>
        <div><span style={{ color: "#C4CDD6" }}>--color-gray-100</span>: #E8EDF2;</div>
        <div><span style={{ color: "#C4CDD6" }}>--color-gray-50</span>: #F5F7FA;</div>
        <br />
        <div style={{ color: "#5A6B80" }}>/* Radius */</div>
        <div><span style={{ color: "#C4CDD6" }}>--radius-sm</span>: 8px;</div>
        <div><span style={{ color: "#C4CDD6" }}>--radius-md</span>: 12px;</div>
        <div><span style={{ color: "#C4CDD6" }}>--radius-lg</span>: 16px;</div>
        <div><span style={{ color: "#C4CDD6" }}>--radius-xl</span>: 20px;</div>
        <div><span style={{ color: "#C4CDD6" }}>--radius-2xl</span>: 24px;</div>
        <br />
        <div style={{ color: "#5A6B80" }}>/* Fonts */</div>
        <div><span style={{ color: "#C4CDD6" }}>--font-heading</span>: 'Manrope', system-ui;</div>
        <div><span style={{ color: "#C4CDD6" }}>--font-body</span>: 'Nunito Sans', system-ui;</div>
      </div>
    </div>
  );
}

// ============== MAIN APP ==============
export default function DesignSystem() {
  const [tab, setTab] = useState(0);

  const sections = [
    <BrandSection key="brand" />,
    <ColorsSection key="colors" />,
    <TypographySection key="typo" />,
    <ComponentsSection key="comp" />,
    <IconsSection key="icons" />,
  ];

  return (
    <div style={{ background: "white", minHeight: "100vh" }}>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white" style={{ borderBottom: "1px solid #E8EDF2" }}>
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #00B4D8, #0077B6)" }}>
                <svg width="16" height="16" viewBox="0 0 52 52" fill="none">
                  <path d="M26 6C15 6 8 14 8 24C8 34 15 42 26 42" stroke="white" strokeWidth="6" strokeLinecap="round"/>
                  <path d="M26 42C37 42 44 34 44 24C44 14 37 6 26 6" stroke="#FFB703" strokeWidth="6" strokeLinecap="round" strokeDasharray="6 4"/>
                  <circle cx="26" cy="24" r="8" stroke="white" strokeWidth="4"/>
                </svg>
              </div>
              <span className="text-lg" style={{ color: "#0B1D35", fontFamily: "Manrope, system-ui", fontWeight: 800 }}>Laundry<span style={{ color: "#00B4D8" }}>Ku</span></span>
              <span className="px-2 py-0.5 rounded-md text-xs" style={{ background: "#E0F7FA", color: "#0077B6", fontFamily: "Manrope, system-ui", fontWeight: 700 }}>Design System v2.0</span>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1">
            {TABS.map((t, i) => (
              <button
                key={t}
                onClick={() => setTab(i)}
                className="px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all"
                style={{
                  background: tab === i ? "#00B4D8" : "transparent",
                  color: tab === i ? "white" : "#8899AA",
                  fontFamily: "Manrope, system-ui",
                  fontWeight: tab === i ? 700 : 600,
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {sections[tab]}
      </div>

      {/* Footer */}
      <div className="text-center py-8" style={{ borderTop: "1px solid #E8EDF2" }}>
        <span className="text-xs" style={{ color: "#8899AA", fontFamily: "Nunito Sans, system-ui" }}>LaundryKu Design System v2.0 — MVP 1</span>
      </div>
    </div>
  );
}
