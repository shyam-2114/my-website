export default function URLForm({ data, errors, onChange }) {
  return (
    <div className="form-fields">
      <label className="field">
        <span className="field-label">Website URL</span>
        <input
          type="url"
          inputMode="url"
          placeholder="https://example.com"
          value={data.url}
          onChange={(e) => onChange('url', e.target.value)}
          className={errors.url ? 'input-error' : ''}
          autoComplete="url"
        />
        {errors.url && <p className="field-error">{errors.url}</p>}
      </label>
    </div>
  )
}
