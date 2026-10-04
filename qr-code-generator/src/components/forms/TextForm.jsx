export default function TextForm({ data, errors, onChange }) {
  const remaining = 2000 - (data.text?.length || 0)
  return (
    <div className="form-fields">
      <label className="field">
        <span className="field-label">Text content</span>
        <textarea
          rows={5}
          placeholder="Type or paste anything you want to encode…"
          value={data.text}
          onChange={(e) => onChange('text', e.target.value)}
          className={errors.text ? 'input-error' : ''}
          maxLength={2000}
        />
        <div className="field-footer">
          {errors.text ? <p className="field-error">{errors.text}</p> : <span />}
          <span className="char-counter">{remaining} left</span>
        </div>
      </label>
    </div>
  )
}
