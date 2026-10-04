export default function WifiForm({ data, errors, onChange }) {
  return (
    <div className="form-fields">
      <label className="field">
        <span className="field-label">Network name (SSID)</span>
        <input
          type="text"
          placeholder="Home Wi-Fi"
          value={data.ssid}
          onChange={(e) => onChange('ssid', e.target.value)}
          className={errors.ssid ? 'input-error' : ''}
        />
        {errors.ssid && <p className="field-error">{errors.ssid}</p>}
      </label>

      <label className="field">
        <span className="field-label">Security type</span>
        <select value={data.encryption} onChange={(e) => onChange('encryption', e.target.value)}>
          <option value="WPA">WPA / WPA2 / WPA3</option>
          <option value="WEP">WEP</option>
          <option value="nopass">No password</option>
        </select>
      </label>

      {data.encryption !== 'nopass' && (
        <label className="field">
          <span className="field-label">Password</span>
          <input
            type="text"
            placeholder="Network password"
            value={data.password}
            onChange={(e) => onChange('password', e.target.value)}
            className={errors.password ? 'input-error' : ''}
            autoComplete="off"
          />
          {errors.password && <p className="field-error">{errors.password}</p>}
        </label>
      )}

      <label className="field field-checkbox">
        <input
          type="checkbox"
          checked={data.hidden}
          onChange={(e) => onChange('hidden', e.target.checked)}
        />
        <span>This is a hidden network</span>
      </label>
    </div>
  )
}
