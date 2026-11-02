import { Button } from "@/components/ui/button"
import { LucideIcon, FileText } from "lucide-react"
import { cn } from "cn"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  actionIcon?: LucideIcon
  className?: string
}

export function EmptyState({
  icon: Icon = FileText,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon: ActionIcon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-xl bg-card/60 space-y-3",
        className
      )}
    >
      <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
        <Icon className="size-6" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <Button
          size="sm"
          variant="outline"
          onClick={onAction}
          className="text-xs h-8 flex items-center gap-1.5 mt-1"
        >
          {ActionIcon && <ActionIcon className="size-3.5" />}
          <span>{actionLabel}</span>
        </Button>
      )}
    </div>
  )
}

