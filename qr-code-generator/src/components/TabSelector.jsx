import { QR_TYPES } from '../utils/constants'

export default function TabSelector({ activeType, onSelect }) {
  return (
    <div className="tab-selector" role="tablist" aria-label="QR code type">
      {QR_TYPES.map((type) => (
        <button
          key={type.id}
          role="tab"
          type="button"
          aria-selected={activeType === type.id}
          className={`tab-pill ${activeType === type.id ? 'tab-pill-active' : ''}`}
          onClick={() => onSelect(type.id)}
        >
          {type.label}
        </button>
      ))}
    </div>
  )
}
