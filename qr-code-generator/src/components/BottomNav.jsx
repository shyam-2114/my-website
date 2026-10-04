import { QrCode, Info } from 'lucide-react'

export default function BottomNav({ page, onNavigate }) {
  const items = [
    { id: 'generator', label: 'Generate', icon: QrCode },
    { id: 'about', label: 'About', icon: Info },
  ]

  return (
    <nav className="bottom-nav" aria-label="Primary">
      {items.map((item) => {
        const Icon = item.icon
        const active = page === item.id
        return (
          <button
            key={item.id}
            type="button"
            className={`bottom-nav-item ${active ? 'bottom-nav-item-active' : ''}`}
            onClick={() => onNavigate(item.id)}
            aria-current={active ? 'page' : undefined}
          >
            <Icon size={22} strokeWidth={active ? 2.25 : 1.75} />
            <span>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
