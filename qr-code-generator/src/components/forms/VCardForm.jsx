export default function VCardForm({ data, errors, onChange }) {
  return (
    <div className="form-fields">
      <div className="field-row">
        <label className="field">
          <span className="field-label">First name</span>
          <input
            type="text"
            placeholder="Ada"
            value={data.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            className={errors.firstName ? 'input-error' : ''}
            autoComplete="given-name"
          />
        </label>
        <label className="field">
          <span className="field-label">Last name</span>
          <input
            type="text"
            placeholder="Lovelace"
            value={data.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            autoComplete="family-name"
          />
        </label>
      </div>
      {errors.firstName && <p className="field-error">{errors.firstName}</p>}

      <div className="field-row">
        <label className="field">
          <span className="field-label">Organization</span>
          <input
            type="text"
            placeholder="Acme Inc."
            value={data.organization}
            onChange={(e) => onChange('organization', e.target.value)}
            autoComplete="organization"
          />
        </label>
        <label className="field">
          <span className="field-label">Job title</span>
          <input
            type="text"
            placeholder="Engineer"
            value={data.title}
            onChange={(e) => onChange('title', e.target.value)}
            autoComplete="organization-title"
          />
        </label>
      </div>

      <label className="field">
        <span className="field-label">Phone</span>
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
      </label>

      <label className="field">
        <span className="field-label">Email</span>
        <input
          type="email"
          inputMode="email"
          placeholder="ada@example.com"
          value={data.email}
          onChange={(e) => onChange('email', e.target.value)}
          className={errors.email ? 'input-error' : ''}
          autoComplete="email"
        />
        {errors.email && <p className="field-error">{errors.email}</p>}
      </label>

      <label className="field">
        <span className="field-label">Website</span>
        <input
          type="url"
          inputMode="url"
          placeholder="https://example.com"
          value={data.website}
          onChange={(e) => onChange('website', e.target.value)}
          className={errors.website ? 'input-error' : ''}
          autoComplete="url"
        />
        {errors.website && <p className="field-error">{errors.website}</p>}
      </label>

      <label className="field">
        <span className="field-label">Address</span>
        <input
          type="text"
          placeholder="123 Main St, Springfield"
          value={data.address}
          onChange={(e) => onChange('address', e.target.value)}
          autoComplete="street-address"
        />
      </label>
    </div>
  )
}
