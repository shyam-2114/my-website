export default function EmailForm({ data, errors, onChange }) {
  return (
    <div className="form-fields">
      <label className="field">
        <span className="field-label">Recipient email</span>
        <input
          type="email"
          inputMode="email"
          placeholder="name@example.com"
          value={data.to}
          onChange={(e) => onChange('to', e.target.value)}
          className={errors.to ? 'input-error' : ''}
          autoComplete="email"
        />
        {errors.to && <p className="field-error">{errors.to}</p>}
      </label>
      <label className="field">
        <span className="field-label">Subject (optional)</span>
        <input
          type="text"
          placeholder="Let's talk"
          value={data.subject}
          onChange={(e) => onChange('subject', e.target.value)}
          className={errors.subject ? 'input-error' : ''}
        />
        {errors.subject && <p className="field-error">{errors.subject}</p>}
      </label>
      <label className="field">
        <span className="field-label">Message (optional)</span>
        <textarea
          rows={3}
          placeholder="Write a short message…"
          value={data.body}
          onChange={(e) => onChange('body', e.target.value)}
          className={errors.body ? 'input-error' : ''}
        />
        {errors.body && <p className="field-error">{errors.body}</p>}
      </label>
    </div>
  )
}
