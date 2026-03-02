import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { notificationService } from "@/services/notification";

export function useNotifications(outletId: string | null, listEnabled = false) {
  const queryClient = useQueryClient();

  // Poll unread count every 30 seconds
  const unreadCountQuery = useQuery({
    queryKey: queryKeys.notifications.unreadCount(outletId ?? ""),
    queryFn: () => notificationService.getUnreadCount(outletId!),
    enabled: !!outletId,
    refetchInterval: 30_000,
  });

  // Fetch list only when dropdown is open (listEnabled = true)
  const listQuery = useQuery({
    queryKey: queryKeys.notifications.list(outletId ?? ""),
    queryFn: () => notificationService.getList(outletId!, { pageSize: 20 }),
    enabled: !!outletId && listEnabled,
    staleTime: 0,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markRead(outletId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.list(outletId ?? ""),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.unreadCount(outletId ?? ""),
      });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationService.markAllRead(outletId!),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.list(outletId ?? ""),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.unreadCount(outletId ?? ""),
      });
    },
  });

  return {
    unreadCount: unreadCountQuery.data?.data?.count ?? 0,
    notifications: listQuery.data?.data ?? [],
    isLoadingList: listQuery.isLoading && listEnabled,
    markRead: (id: string) => markReadMutation.mutate(id),
    markAllRead: () => markAllReadMutation.mutate(),
    isMarkingAllRead: markAllReadMutation.isPending,
  };
}
