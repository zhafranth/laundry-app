import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store";
import { orderService } from "@/services/order";
import { outletService } from "@/services/outlet";
import { queryKeys } from "@/lib/query-keys";
import { PrintReceipt } from "@/components/orders/PrintReceipt";
import { Skeleton } from "@/components/ui/Skeleton";

export function PrintPage() {
  const { id: orderId } = useParams<{ id: string }>();
  const activeOutletId = useAuthStore((s) => s.activeOutletId);

  const { data: orderData, isLoading: isLoadingOrder } = useQuery({
    queryKey: queryKeys.orders.detail(activeOutletId ?? "", orderId ?? ""),
    queryFn: () => orderService.getDetail(activeOutletId!, orderId!),
    enabled: !!activeOutletId && !!orderId,
  });

  const { data: outletsData, isLoading: isLoadingOutlet } = useQuery({
    queryKey: queryKeys.outlets.list,
    queryFn: outletService.getMyOutlets,
    enabled: !!activeOutletId,
  });

  const order = orderData?.data;
  const outlets = outletsData?.data ?? [];
  const outlet = outlets.find((o) => o.id === activeOutletId) ?? outlets[0];

  const isLoading = isLoadingOrder || isLoadingOutlet;

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: "#F5F7FA" }}>
      {isLoading && (
        <div className="flex flex-col gap-4 max-w-sm mx-auto">
          <Skeleton style={{ height: 40, borderRadius: 12 }} />
          <Skeleton style={{ height: 300, borderRadius: 16 }} />
        </div>
      )}

      {!isLoading && order && (
        <PrintReceipt
          order={order}
          outletName={outlet?.name ?? "LaundryKu"}
          outletAddress={outlet?.address}
          outletPhone={outlet?.phone}
        />
      )}

      {!isLoading && !order && (
        <div className="flex items-center justify-center" style={{ height: 200 }}>
          <p style={{ fontFamily: "Nunito Sans, system-ui", color: "#8899AA" }}>
            Order tidak ditemukan.
          </p>
        </div>
      )}
    </div>
  );
}
