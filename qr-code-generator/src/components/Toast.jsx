import { useEffect } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'

export default function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => onDismiss(), 2800)
    return () => clearTimeout(timer)
  }, [toast, onDismiss])

  if (!toast) return null

  return (
    <div className={`toast toast-${toast.type}`} role="status" aria-live="polite">
      {toast.type === 'error' ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
      <span>{toast.message}</span>
    </div>
  )
}
