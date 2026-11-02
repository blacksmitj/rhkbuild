"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface CopyItemButtonProps {
  textToCopy: string
  label?: string
  tooltip?: string
  className?: string
  variant?: "ghost" | "outline" | "secondary"
  size?: "xs" | "sm" | "icon"
  showText?: boolean
}

export function CopyItemButton({
  textToCopy,
  label = "Salin",
  tooltip = "Salin ke clipboard",
  className,
  variant = "ghost",
  size = "icon",
  showText = false,
}: CopyItemButtonProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!textToCopy) return

    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const buttonSizeClass =
    size === "xs"
      ? "h-6 px-1.5 text-[11px]"
      : size === "icon"
      ? "h-7 w-7 p-0"
      : "h-7 px-2 text-xs"

  return (
    <TooltipProvider delay={200}>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              variant={copied ? "secondary" : variant}
              onClick={handleCopy}
              className={cn(
                "transition-all duration-200 select-none",
                copied
                  ? "text-emerald-700 bg-emerald-100 hover:bg-emerald-200 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300"
                  : "text-muted-foreground hover:text-foreground",
                buttonSizeClass,
                className
              )}
              disabled={!textToCopy}
            />
          }
        >
          {copied ? (
            <Check className="size-3.5 text-emerald-600 animate-in zoom-in-50 duration-200 shrink-0" />
          ) : (
            <Copy className="size-3.5 shrink-0" />
          )}
          {showText && (
            <span className="ml-1 text-[11px] font-medium">
              {copied ? "Tersalin!" : label}
            </span>
          )}
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs py-1 px-2">
          {copied ? "Berhasil disalin!" : tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
