"use client"

import type React from "react"

// Adapted from https://ui.shadcn.com/docs/components/toast
import { useState, useEffect, useCallback } from "react"

const TOAST_LIMIT = 3
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

const toasts: ToasterToast[] = []

type Toast = Omit<ToasterToast, "id">

function useToast() {
  const [, setToastCount] = useState(0)

  const toast = useCallback(
    ({ ...props }: Toast) => {
      const id = genId()

      const newToast = {
        id,
        ...props,
      }

      toasts.push(newToast)
      setToastCount((count) => count + 1)

      return newToast
    },
    [setToastCount],
  )

  const dismiss = useCallback(
    (toastId?: string) => {
      if (toastId) {
        const index = toasts.findIndex((toast) => toast.id === toastId)
        if (index !== -1) {
          toasts.splice(index, 1)
          setToastCount((count) => count - 1)
        }
      } else {
        toasts.splice(0, toasts.length)
        setToastCount(0)
      }
    },
    [setToastCount],
  )

  useEffect(() => {
    const interval = setInterval(() => {
      if (toasts.length > TOAST_LIMIT) {
        toasts.shift()
        setToastCount((count) => count - 1)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return {
    toast,
    dismiss,
    toasts: toasts.slice(0, TOAST_LIMIT),
  }
}

export { useToast }
