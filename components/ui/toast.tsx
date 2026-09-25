"use client";

import { Toast } from "@base-ui/react/toast";
import { Check, X } from "lucide-react";

import { cn } from "cn";

/**
 * Global toast manager: toasts can be queued from any client component
 * (or plain function) without needing provider context, while the
 * <Toaster /> in the root layout renders them.
 *
 * toast.success("Product updated", "Changes were saved.");
 * toast.error("Update failed", "Please try again.");
 */
const toastManager = Toast.createToastManager();

export const toast = {
  success: (title: string, description?: string) =>
    toastManager.add({
      type: "success",
      title,
      description,
      timeout: 4000,
    }),
  error: (title: string, description?: string) =>
    toastManager.add({
      type: "error",
      title,
      description,
      timeout: 6000,
    }),
};

export function Toaster() {
  return (
    <Toast.Provider toastManager={toastManager}>
      <Toast.Portal>
        <Toast.Viewport className="fixed right-4 top-4 z-50 flex w-88 max-w-[calc(100vw-2rem)] flex-col gap-2 outline-none">
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}

function ToastList() {
  const { toasts } = Toast.useToastManager();

  return toasts.map((toast) => {
    const isError = toast.type === "error";

    return (
      <Toast.Root
        key={toast.id}
        toast={toast}
        className={cn(
          "flex items-start gap-3 rounded-lg border bg-card p-4 text-card-foreground shadow-lg transition-[opacity,transform] duration-200 ease-out",
          "data-[starting-style]:-translate-y-3 data-[starting-style]:opacity-0",
          "data-[ending-style]:-translate-y-2 data-[ending-style]:opacity-0",
          isError ? "border-destructive/40" : "border-green-600/30",
        )}
      >
        <Toast.Content className="flex flex-1 items-start gap-3">
          <span
            aria-hidden="true"
            className={cn(
              "flex size-6 shrink-0 items-center justify-center rounded-full",
              isError
                ? "bg-destructive/10 text-destructive"
                : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
            )}
          >
            {isError ? <X className="size-4" /> : <Check className="size-4" />}
          </span>

          <div className="min-w-0 flex-1">
            <Toast.Title className="text-sm font-semibold" />
            <Toast.Description className="mt-0.5 text-sm text-muted-foreground" />
          </div>
        </Toast.Content>

        <Toast.Close
          aria-label="Dismiss notification"
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <X className="size-4" />
        </Toast.Close>
      </Toast.Root>
    );
  });
}
