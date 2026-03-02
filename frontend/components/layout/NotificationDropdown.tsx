import { useRef, useEffect } from "react";
import {
  Bell,
  ShoppingBag,
  Clock,
  AlertTriangle,
  TrendingDown,
  Info,
  CheckCheck,
  BellOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useNotifications } from "@/hooks/useNotifications";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Notification, NotificationType } from "@/types";

// ── helpers ──────────────────────────────────────────────────────────────────

function formatRelativeTime(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}

type TypeConfig = { color: string; bg: string; Icon: React.ElementType };

function getTypeConfig(type: NotificationType): TypeConfig {
  switch (type) {
    case "order_new":
      return { color: "#00B4D8", bg: "rgba(0,180,216,0.10)", Icon: ShoppingBag };
    case "order_deadline":
      return { color: "#FFB703", bg: "rgba(255,183,3,0.10)", Icon: Clock };
    case "stock_low":
      return { color: "#EF2D56", bg: "rgba(239,45,86,0.10)", Icon: AlertTriangle };
    case "expense_alert":
      return { color: "#FFB703", bg: "rgba(255,183,3,0.10)", Icon: TrendingDown };
    case "system":
    default:
      return { color: "#5A6B80", bg: "rgba(90,107,128,0.10)", Icon: Info };
  }
}

// ── NotificationItem ──────────────────────────────────────────────────────────

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onNavigate: (url: string) => void;
}

function NotificationItem({ notification, onMarkRead, onNavigate }: NotificationItemProps) {
  const { color, bg, Icon } = getTypeConfig(notification.type);

  function handleClick() {
    if (!notification.isRead) onMarkRead(notification.id);
    if (notification.actionUrl) onNavigate(notification.actionUrl);
  }

  return (
    <div
      onClick={handleClick}
      style={{
        borderLeft: `3px solid ${notification.isRead ? "#E8EDF2" : color}`,
        background: notification.isRead ? "white" : `rgba(0,180,216,0.04)`,
        padding: "12px 16px",
        cursor: notification.actionUrl || !notification.isRead ? "pointer" : "default",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => {
        if (notification.actionUrl || !notification.isRead)
          (e.currentTarget as HTMLDivElement).style.background = notification.isRead
            ? "#F5F7FA"
            : "rgba(0,180,216,0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = notification.isRead
          ? "white"
          : "rgba(0,180,216,0.04)";
      }}
    >
      <div className="flex items-start gap-3">
        {/* type icon */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={15} color={color} />
        </div>

        {/* content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p
              className="truncate"
              style={{
                fontFamily: "Manrope, system-ui",
                fontWeight: 700,
                fontSize: "0.8125rem",
                color: "#0B1D35",
                margin: 0,
              }}
            >
              {notification.title}
            </p>

            {/* unread dot */}
            {!notification.isRead && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkRead(notification.id);
                }}
                title="Tandai dibaca"
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: color,
                  border: "none",
                  cursor: "pointer",
                  flexShrink: 0,
                  marginTop: 3,
                  padding: 0,
                }}
              />
            )}
          </div>

          <p
            style={{
              fontFamily: "Nunito Sans, system-ui",
              fontSize: "0.78rem",
              color: "#5A6B80",
              margin: "3px 0 0",
              lineHeight: 1.4,
            }}
          >
            {notification.message}
          </p>

          <p
            style={{
              fontFamily: "Nunito Sans, system-ui",
              fontSize: "0.72rem",
              color: "#8899AA",
              margin: "5px 0 0",
            }}
          >
            {formatRelativeTime(notification.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton loader ───────────────────────────────────────────────────────────

function NotificationSkeleton() {
  return (
    <div style={{ padding: "12px 16px", borderLeft: "3px solid #E8EDF2" }}>
      <div className="flex items-start gap-3">
        <Skeleton style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0 }} />
        <div className="flex-1">
          <Skeleton style={{ width: "60%", height: 13, borderRadius: 6 }} />
          <Skeleton style={{ width: "90%", height: 11, borderRadius: 6, marginTop: 6 }} />
          <Skeleton style={{ width: "30%", height: 10, borderRadius: 6, marginTop: 5 }} />
        </div>
      </div>
    </div>
  );
}

// ── NotificationDropdown ──────────────────────────────────────────────────────

interface NotificationDropdownProps {
  outletId: string | null;
}

export function NotificationDropdown({ outletId }: NotificationDropdownProps) {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const containerRef = useRef<HTMLDivElement>(null);

  const { unreadCount, notifications, isLoadingList, markRead, markAllRead, isMarkingAllRead } =
    useNotifications(outletId, isOpen);

  // click-outside
  useEffect(() => {
    if (!isOpen) return;
    function handle(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [isOpen, onClose]);

  // escape
  useEffect(() => {
    if (!isOpen) return;
    function handle(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [isOpen, onClose]);

  function handleNavigate(url: string) {
    navigate(url);
    onClose();
  }

  const hasUnread = unreadCount > 0;
  const badgeLabel = unreadCount > 99 ? "99+" : String(unreadCount);

  return (
    <div ref={containerRef} className="relative">
      {/* ── Bell button ── */}
      <button
        onClick={() => (isOpen ? onClose() : onOpen())}
        className="relative flex items-center justify-center rounded-[10px] transition-colors"
        style={{
          width: 36,
          height: 36,
          color: isOpen ? "#00B4D8" : "#3D5068",
          background: isOpen ? "rgba(0,180,216,0.08)" : "transparent",
          border: "none",
          cursor: "pointer",
        }}
        aria-label="Notifikasi"
        onMouseEnter={(e) => {
          if (!isOpen)
            (e.currentTarget as HTMLButtonElement).style.background = "#F5F7FA";
        }}
        onMouseLeave={(e) => {
          if (!isOpen)
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        }}
      >
        <Bell size={19} />

        {/* unread badge */}
        {hasUnread && (
          <span
            className="absolute flex items-center justify-center"
            style={{
              top: unreadCount <= 9 ? 1 : -1,
              right: unreadCount <= 9 ? 1 : -3,
              minWidth: unreadCount <= 9 ? 14 : 18,
              height: 14,
              paddingInline: unreadCount <= 9 ? 0 : 3,
              background: "#EF2D56",
              borderRadius: 99,
              border: "1.5px solid white",
              fontFamily: "Manrope, system-ui",
              fontWeight: 800,
              fontSize: "0.6rem",
              color: "white",
              lineHeight: 1,
            }}
          >
            {badgeLabel}
          </span>
        )}
      </button>

      {/* ── Dropdown panel ── */}
      {isOpen && (
        <div
          className="absolute z-50"
          style={{
            top: "calc(100% + 8px)",
            right: 0,
            width: 360,
            background: "white",
            borderRadius: 16,
            border: "1.5px solid #E8EDF2",
            boxShadow: "0 8px 24px rgba(11,29,53,0.12)",
            animation: "fade-up 0.15s ease forwards",
            overflow: "hidden",
          }}
        >
          {/* panel header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid #E8EDF2" }}
          >
            <div className="flex items-center gap-2">
              <span
                style={{
                  fontFamily: "Manrope, system-ui",
                  fontWeight: 800,
                  fontSize: "0.9375rem",
                  color: "#0B1D35",
                }}
              >
                Notifikasi
              </span>
              {hasUnread && (
                <span
                  style={{
                    fontFamily: "Manrope, system-ui",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    color: "white",
                    background: "#EF2D56",
                    borderRadius: 99,
                    padding: "1px 7px",
                  }}
                >
                  {badgeLabel} belum dibaca
                </span>
              )}
            </div>

            {hasUnread && (
              <button
                onClick={() => markAllRead()}
                disabled={isMarkingAllRead}
                className="flex items-center gap-1.5"
                style={{
                  fontFamily: "Manrope, system-ui",
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  color: isMarkingAllRead ? "#8899AA" : "#00B4D8",
                  background: "none",
                  border: "none",
                  cursor: isMarkingAllRead ? "default" : "pointer",
                  padding: 0,
                  transition: "color 0.15s",
                }}
              >
                <CheckCheck size={13} />
                Tandai semua dibaca
              </button>
            )}
          </div>

          {/* panel body — scrollable */}
          <div style={{ maxHeight: 400, overflowY: "auto" }}>
            {isLoadingList ? (
              <div className="flex flex-col" style={{ gap: 0, borderBottom: "1px solid #F5F7FA" }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{ borderBottom: "1px solid #F5F7FA" }}>
                    <NotificationSkeleton />
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              /* empty state */
              <div
                className="flex flex-col items-center justify-center py-12 px-4"
                style={{ gap: 10 }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: "#F5F7FA",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BellOff size={20} color="#C4CDD6" />
                </div>
                <p
                  style={{
                    fontFamily: "Manrope, system-ui",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    color: "#8899AA",
                    margin: 0,
                    textAlign: "center",
                  }}
                >
                  Tidak ada notifikasi
                </p>
                <p
                  style={{
                    fontFamily: "Nunito Sans, system-ui",
                    fontSize: "0.78rem",
                    color: "#C4CDD6",
                    margin: 0,
                    textAlign: "center",
                  }}
                >
                  Semua aktivitas penting akan muncul di sini
                </p>
              </div>
            ) : (
              notifications.map((n, idx) => (
                <div
                  key={n.id}
                  style={{
                    borderBottom:
                      idx < notifications.length - 1 ? "1px solid #F5F7FA" : "none",
                  }}
                >
                  <NotificationItem
                    notification={n}
                    onMarkRead={markRead}
                    onNavigate={handleNavigate}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
