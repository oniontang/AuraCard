import { ref } from 'vue'
import type { ToastItem } from '../components/ui/UiToast.vue'

let nextId = 0
const toasts = ref<ToastItem[]>([])

export function useToast() {
  function show(message: string, tone: ToastItem['tone'] = 'info', duration = 3000) {
    const id = ++nextId
    toasts.value = [...toasts.value, { id, message, tone, duration }]
  }

  function success(message: string, duration?: number) {
    show(message, 'success', duration)
  }

  function error(message: string, duration?: number) {
    show(message, 'error', duration ?? 5000)
  }

  function warning(message: string, duration?: number) {
    show(message, 'warning', duration ?? 4000)
  }

  function info(message: string, duration?: number) {
    show(message, 'info', duration)
  }

  function close(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return { toasts, show, success, error, warning, info, close }
}
