import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  MapPin,
  Phone,
  Store,
  Zap,
  CheckCircle,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import api from "@/lib/axios";

// ── Schemas ──────────────────────────────────────────────────────
const outletSchema = z.object({
  name: z.string().min(2, { message: "Nama outlet minimal 2 karakter" }),
  address: z.string().optional(),
  phone: z
    .string()
    .min(10, { message: "Nomor HP minimal 10 digit" })
    .regex(/^\d+$/, { message: "Hanya angka" })
    .optional()
    .or(z.literal("")),
});
type OutletInput = z.infer<typeof outletSchema>;

// ── Plan data ─────────────────────────────────────────────────────
const PLANS = [
  {
    id: "regular",
    name: "Regular",
    badge: null,
    price: { 1: 99000, 3: 279000, 6: 539000, 12: 999000 },
    features: [
      "Manajemen Order",
      "Data Pelanggan",
      "Catat Pengeluaran",
      "Laporan Dasar",
      "Kelola Karyawan",
    ],
    locked: ["Profit per Layanan", "Smart Inventory", "Health Score", "Anomali Alert"],
  },
  {
    id: "pro",
    name: "Pro",
    badge: "Paling Populer",
    price: { 1: 179000, 3: 499000, 6: 959000, 12: 1799000 },
    features: [
      "Semua fitur Regular",
      "Profit per Layanan",
      "Smart Inventory",
      "Health Score",
      "Anomali Alert",
      "Export PDF & Excel",
    ],
    locked: [],
  },
] as const;

type PlanId = "regular" | "pro";
type Duration = 1 | 3 | 6 | 12;

const DURATIONS: { value: Duration; label: string; discount?: string }[] = [
  { value: 1, label: "1 Bulan" },
  { value: 3, label: "3 Bulan", discount: "Hemat 7%" },
  { value: 6, label: "6 Bulan", discount: "Hemat 10%" },
  { value: 12, label: "12 Bulan", discount: "Hemat 16%" },
];

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

// ── Step indicator ────────────────────────────────────────────────
const STEPS = ["Outlet", "Pilih Plan", "Durasi & Bayar"];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all duration-300"
              style={{
                fontFamily: "Manrope, system-ui",
                fontWeight: 800,
                background:
                  i < current
                    ? "#00C853"
                    : i === current
                      ? "linear-gradient(135deg, #00B4D8, #0077B6)"
                      : "#F0F4F8",
                color: i <= current ? "white" : "#8899AA",
                boxShadow: i === current ? "0 4px 12px rgba(0,180,216,0.30)" : "none",
              }}
            >
              {i < current ? <CheckCircle size={14} /> : i + 1}
            </div>
            <span
              className="text-[10px] whitespace-nowrap"
              style={{
                fontFamily: "Manrope, system-ui",
                fontWeight: 700,
                color: i === current ? "#0B1D35" : "#8899AA",
              }}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className="h-px w-14 mx-1 mb-5 transition-all duration-300"
              style={{
                background: i < current ? "#00C853" : "#E8EDF2",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────
export function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [outletData, setOutletData] = useState<OutletInput | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("pro");
  const [selectedDuration, setSelectedDuration] = useState<Duration>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OutletInput>({ resolver: zodResolver(outletSchema) });

  // Step 0 — Outlet
  const handleOutletSubmit = (data: OutletInput) => {
    setOutletData(data);
    setStep(1);
  };

  // Step 2 — Create outlet + subscription → redirect to payment
  const handleProceedToPayment = async () => {
    if (!outletData) return;
    setLoading(true);
    setError("");
    try {
      const outletRes = await api.post("/outlets", outletData);
      const outletId = outletRes.data.data.id;
      const subRes = await api.post(`/outlets/${outletId}/subscriptions`, {
        plan: selectedPlan,
        durationMonths: selectedDuration,
      });
      const paymentUrl: string = subRes.data.data.paymentUrl;
      window.location.href = paymentUrl;
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  void navigate; // used for future navigation needs

  const currentPlan = PLANS.find((p) => p.id === selectedPlan)!;
  const totalPrice = currentPlan.price[selectedDuration];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: "#FAFBFC" }}>
      {/* Header */}
      <div className="mb-2 text-center">
        <span
          style={{
            color: "#0B1D35",
            fontFamily: "Manrope, system-ui",
            fontWeight: 800,
            fontSize: "1.25rem",
          }}
        >
          Laundry<span style={{ color: "#00B4D8" }}>Ku</span>
        </span>
      </div>
      <p
        className="text-sm mb-8 text-center"
        style={{ color: "#8899AA", fontFamily: "Nunito Sans, system-ui" }}
      >
        Selesaikan setup akunmu dalam 3 langkah mudah
      </p>

      <div
        className="w-full max-w-[520px] bg-white rounded-[20px] p-8"
        style={{
          border: "1px solid #E8EDF2",
          boxShadow: "0 8px 32px rgba(11,29,53,0.07)",
          animation: "fade-up 0.35s ease forwards",
        }}
      >
        <StepIndicator current={step} />

        {/* ── Step 0: Outlet ── */}
        {step === 0 && (
          <div key="step-0" style={{ animation: "slide-right 0.2s ease forwards" }}>
            <h2
              className="mb-1"
              style={{
                color: "#0B1D35",
                fontFamily: "Manrope, system-ui",
                fontWeight: 800,
                fontSize: "1.25rem",
              }}
            >
              Buat outlet pertamamu
            </h2>
            <p
              className="text-sm mb-6"
              style={{ color: "#8899AA", fontFamily: "Nunito Sans, system-ui" }}
            >
              Info dasar outlet laundry kamu
            </p>
            <form onSubmit={handleSubmit(handleOutletSubmit)} className="flex flex-col gap-4">
              <Input
                {...register("name")}
                label="Nama Outlet *"
                placeholder="contoh: Laundry Bersih Jaya"
                leftIcon={<Store size={16} />}
                error={errors.name?.message}
              />
              <Input
                {...register("address")}
                label="Alamat"
                placeholder="Jl. Merdeka No. 12, Jakarta"
                leftIcon={<MapPin size={16} />}
                hint="Opsional — bisa diisi nanti"
              />
              <Input
                {...register("phone")}
                label="Nomor Telepon"
                type="tel"
                placeholder="08123456789"
                leftIcon={<Phone size={16} />}
                hint="Opsional — bisa diisi nanti"
              />
              <Button type="submit" fullWidth rightIcon={<ChevronRight size={16} />} className="mt-2">
                Lanjut Pilih Plan
              </Button>
            </form>
          </div>
        )}

        {/* ── Step 1: Plan ── */}
        {step === 1 && (
          <div key="step-1" style={{ animation: "slide-right 0.2s ease forwards" }}>
            <button
              onClick={() => setStep(0)}
              className="flex items-center gap-1.5 mb-4 text-sm transition-colors hover:opacity-70"
              style={{ color: "#8899AA", fontFamily: "Nunito Sans, system-ui", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              <ArrowLeft size={14} /> Kembali
            </button>
            <h2
              className="mb-1"
              style={{
                color: "#0B1D35",
                fontFamily: "Manrope, system-ui",
                fontWeight: 800,
                fontSize: "1.25rem",
              }}
            >
              Pilih paket yang sesuai
            </h2>
            <p
              className="text-sm mb-6"
              style={{ color: "#8899AA", fontFamily: "Nunito Sans, system-ui" }}
            >
              Bisa upgrade kapan saja
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {PLANS.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  className="relative text-left p-5 rounded-[16px] transition-all duration-150"
                  style={{
                    border: `2px solid ${selectedPlan === plan.id ? "#00B4D8" : "#E8EDF2"}`,
                    background: selectedPlan === plan.id ? "rgba(0,180,216,0.03)" : "white",
                    boxShadow:
                      selectedPlan === plan.id ? "0 0 0 3px rgba(0,180,216,0.12)" : "none",
                    cursor: "pointer",
                  }}
                >
                  {plan.badge && (
                    <span
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] text-white whitespace-nowrap"
                      style={{
                        background: "linear-gradient(135deg, #FFB703, #FF6B35)",
                        fontFamily: "Manrope, system-ui",
                        fontWeight: 700,
                      }}
                    >
                      {plan.badge}
                    </span>
                  )}
                  <div
                    className="mb-3 text-base"
                    style={{
                      color: "#0B1D35",
                      fontFamily: "Manrope, system-ui",
                      fontWeight: 800,
                    }}
                  >
                    {plan.name}
                    {plan.id === "pro" && (
                      <Zap size={14} className="inline ml-1" style={{ color: "#FFB703" }} />
                    )}
                  </div>
                  <ul className="flex flex-col gap-1">
                    {plan.features.slice(0, 4).map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-1.5 text-xs"
                        style={{
                          color: "#3D5068",
                          fontFamily: "Nunito Sans, system-ui",
                        }}
                      >
                        <CheckCircle size={11} style={{ color: "#00C853", flexShrink: 0 }} />
                        {f}
                      </li>
                    ))}
                    {plan.locked.length > 0 && (
                      <li
                        className="text-xs mt-0.5"
                        style={{ color: "#C4CDD6", fontFamily: "Nunito Sans, system-ui" }}
                      >
                        +{plan.locked.length} fitur terkunci
                      </li>
                    )}
                  </ul>
                </button>
              ))}
            </div>

            <Button fullWidth onClick={() => setStep(2)} rightIcon={<ChevronRight size={16} />}>
              Lanjut Pilih Durasi
            </Button>
          </div>
        )}

        {/* ── Step 2: Duration & Summary ── */}
        {step === 2 && (
          <div key="step-2" style={{ animation: "slide-right 0.2s ease forwards" }}>
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 mb-4 text-sm transition-colors hover:opacity-70"
              style={{ color: "#8899AA", fontFamily: "Nunito Sans, system-ui", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              <ArrowLeft size={14} /> Kembali
            </button>
            <h2
              className="mb-1"
              style={{
                color: "#0B1D35",
                fontFamily: "Manrope, system-ui",
                fontWeight: 800,
                fontSize: "1.25rem",
              }}
            >
              Pilih durasi langganan
            </h2>
            <p
              className="text-sm mb-5"
              style={{ color: "#8899AA", fontFamily: "Nunito Sans, system-ui" }}
            >
              Paket lebih panjang = lebih hemat
            </p>

            <div className="grid grid-cols-2 gap-2.5 mb-6">
              {DURATIONS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setSelectedDuration(d.value)}
                  className="relative text-left p-4 rounded-[14px] transition-all duration-150"
                  style={{
                    border: `2px solid ${selectedDuration === d.value ? "#00B4D8" : "#E8EDF2"}`,
                    background:
                      selectedDuration === d.value ? "rgba(0,180,216,0.03)" : "white",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      color: "#0B1D35",
                      fontFamily: "Manrope, system-ui",
                      fontWeight: 800,
                      fontSize: "0.9rem",
                    }}
                  >
                    {d.label}
                  </div>
                  <div
                    style={{
                      color: "#5A6B80",
                      fontFamily: "Nunito Sans, system-ui",
                      fontSize: "0.8rem",
                    }}
                  >
                    {formatRp(currentPlan.price[d.value])}
                  </div>
                  {d.discount && (
                    <span
                      className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md text-[10px] text-white"
                      style={{
                        background: "#00C853",
                        fontFamily: "Manrope, system-ui",
                        fontWeight: 700,
                      }}
                    >
                      {d.discount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Summary */}
            <div
              className="rounded-[14px] p-4 mb-4"
              style={{ background: "#F5F7FA", border: "1px solid #E8EDF2" }}
            >
              <div className="flex justify-between items-center mb-2">
                <span
                  className="text-sm"
                  style={{ color: "#5A6B80", fontFamily: "Nunito Sans, system-ui" }}
                >
                  Paket
                </span>
                <span
                  className="text-sm"
                  style={{
                    color: "#0B1D35",
                    fontFamily: "Manrope, system-ui",
                    fontWeight: 700,
                  }}
                >
                  {currentPlan.name} — {selectedDuration} bulan
                </span>
              </div>
              <div
                className="flex justify-between items-center pt-2"
                style={{ borderTop: "1px solid #E8EDF2" }}
              >
                <span
                  style={{
                    color: "#0B1D35",
                    fontFamily: "Manrope, system-ui",
                    fontWeight: 700,
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    color: "#00B4D8",
                    fontFamily: "Manrope, system-ui",
                    fontWeight: 800,
                    fontSize: "1.1rem",
                  }}
                >
                  {formatRp(totalPrice)}
                </span>
              </div>
            </div>

            {error && (
              <div
                className="px-4 py-3 rounded-[10px] text-sm mb-3"
                style={{
                  background: "rgba(239,45,86,0.06)",
                  border: "1px solid rgba(239,45,86,0.2)",
                  color: "#EF2D56",
                  fontFamily: "Nunito Sans, system-ui",
                  fontWeight: 600,
                }}
              >
                {error}
              </div>
            )}

            <Button
              fullWidth
              loading={loading}
              onClick={handleProceedToPayment}
              rightIcon={<ChevronRight size={16} />}
            >
              Lanjut ke Pembayaran
            </Button>

            <p
              className="text-center text-xs mt-3"
              style={{ color: "#C4CDD6", fontFamily: "Nunito Sans, system-ui" }}
            >
              Pembayaran aman via Midtrans / Xendit
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
