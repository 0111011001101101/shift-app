
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast 
            key={id} 
            {...props}
            className="bg-white dark:bg-gray-900 border border-primary-100 dark:border-primary-900/30 shadow-lg"
          >
            <div className="grid gap-1">
              {title && <ToastTitle className="text-gray-900 dark:text-gray-100">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-gray-600 dark:text-gray-400">{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100" />
          </Toast>
        )
      })}
      <ToastViewport className="p-4" />
    </ToastProvider>
  )
}
