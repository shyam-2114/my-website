export default function PhoneForm({ data, errors, onChange }) {
  return (
    <div className="form-fields">
      <label className="field">
        <span className="field-label">Phone number</span>
        <input
          type="tel"
          inputMode="tel"
          placeholder="+1 555 123 4567"
          value={data.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          className={errors.phone ? 'input-error' : ''}
          autoComplete="tel"
        />
        {errors.phone && <p className="field-error">{errors.phone}</p>}
        <p className="field-hint">Scanning opens the phone dialer with this number pre-filled.</p>
      </label>
    </div>
  )
}
