import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-5" />,
        info: <InfoIcon className="size-5" />,
        warning: <TriangleAlertIcon className="size-5" />,
        error: <OctagonXIcon className="size-5" />,
        loading: <Loader2Icon className="size-5 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-white dark:group-[.toaster]:bg-stone-950 group-[.toaster]:text-stone-900 dark:group-[.toaster]:text-stone-50 group-[.toaster]:border-stone-200 dark:group-[.toaster]:border-stone-800 group-[.toaster]:shadow-lg rounded-xl font-sans",
          description: "group-[.toast]:text-stone-500 dark:group-[.toast]:text-stone-400 text-sm",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-medium rounded-md",
          cancelButton: "group-[.toast]:bg-stone-100 dark:group-[.toast]:bg-stone-800 group-[.toast]:text-stone-500 dark:group-[.toast]:text-stone-400 rounded-md",
          closeButton: "group-[.toast]:bg-stone-100 dark:group-[.toast]:bg-stone-800 group-[.toast]:text-stone-500 dark:group-[.toast]:text-stone-400 border-none hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }