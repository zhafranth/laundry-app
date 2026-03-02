import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [status, setStatus] = useState<"loading" | "ok" | "redirect">("loading");
  const navigate = useNavigate();

  useEffect(() => {
    function check() {
      const { accessToken, user } = useAuthStore.getState();
      if (accessToken && user) {
        setStatus("ok");
      } else {
        setStatus("redirect");
        navigate("/login", { replace: true });
      }
    }

    // Kalau Zustand sudah hydrate dari localStorage → cek langsung
    // Kalau belum → tunggu onFinishHydration baru cek
    if (useAuthStore.persist.hasHydrated()) {
      check();
    } else {
      const unsub = useAuthStore.persist.onFinishHydration(check);
      return unsub;
    }
  }, [navigate]);

  if (status !== "ok") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#F5F7FA" }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "3px solid rgba(0,180,216,0.15)",
            borderTop: "3px solid #00B4D8",
            animation: "spin-cw 0.8s linear infinite",
          }}
          aria-label="Memuat..."
        />
      </div>
    );
  }

  return <>{children}</>;
}
