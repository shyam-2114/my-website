import { useState, useEffect } from 'react'
import { validateHexColor } from '../utils/validators'

const SWATCHES = ['#14161A', '#C6491F', '#1F8A83', '#2255C4', '#7A2FB0', '#FFFFFF']

export default function ColorPicker({ label, value, onChange }) {
  const [text, setText] = useState(value)

  useEffect(() => {
    setText(value)
  }, [value])

  const invalid = text !== '' && !validateHexColor(text)

  function handleTextChange(e) {
    const next = e.target.value
    setText(next)
    if (validateHexColor(next)) {
      onChange(next)
    }
  }

  return (
    <div className="color-picker">
      <span className="field-label">{label}</span>
      <div className="color-picker-row">
        <label className="color-swatch-input" style={{ background: validateHexColor(text) ? text : value }}>
          <input
            type="color"
            value={validateHexColor(text) ? text : value}
            onChange={(e) => {
              onChange(e.target.value)
              setText(e.target.value)
            }}
            aria-label={`${label} color picker`}
          />
        </label>
        <input
          type="text"
          className={`hex-input ${invalid ? 'input-error' : ''}`}
          value={text}
          onChange={handleTextChange}
          placeholder="#FFFFFF"
          maxLength={7}
          aria-label={`${label} hex value`}
          spellCheck={false}
        />
      </div>
      <div className="swatch-list" role="group" aria-label={`${label} presets`}>
        {SWATCHES.map((swatch) => (
          <button
            key={swatch}
            type="button"
            className={`swatch ${value.toLowerCase() === swatch.toLowerCase() ? 'swatch-active' : ''}`}
            style={{ background: swatch }}
            onClick={() => onChange(swatch)}
            aria-label={`Use ${swatch}`}
          />
        ))}
      </div>
      {invalid && <p className="field-error">Enter a valid hex color, e.g. #FF6B35</p>}
    </div>
  )
}
