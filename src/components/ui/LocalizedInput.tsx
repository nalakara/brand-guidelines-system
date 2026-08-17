import React from 'react';
import { LocalizedString, Language, getLocalizedText, updateLocalizedString } from '../../types/brand';

interface LocalizedInputProps {
  label?: string;
  hint?: string;
  placeholder?: string;
  value?: LocalizedString | string;
  contentLanguage: Language;
  onChange: (updated: LocalizedString) => void;
}

export const LocalizedInput: React.FC<LocalizedInputProps> = ({
  label,
  hint,
  placeholder,
  value,
  contentLanguage,
  onChange
}) => {
  const { isFallback } = getLocalizedText(value, contentLanguage);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = updateLocalizedString(value, contentLanguage, e.target.value);
    onChange(updated);
  };

  const rawVal = typeof value === 'string' ? value : (value?.[contentLanguage] || '');

  return (
    <div className="form-group">
      {label && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <label className="form-label" style={{ marginBottom: 0 }}>{label}</label>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: isFallback ? '#fffbeb' : 'var(--bg-muted)',
              color: isFallback ? '#b45309' : 'var(--text-subtle)',
              border: isFallback ? '1px solid #fde68a' : '1px solid var(--border-light)'
            }}
          >
            {contentLanguage.toUpperCase()} {isFallback ? '(EN Fallback)' : ''}
          </span>
        </div>
      )}
      {hint && <p className="form-hint">{hint}</p>}
      <input
        type="text"
        className="form-control"
        placeholder={placeholder ? `${placeholder} (${contentLanguage.toUpperCase()})` : ''}
        value={rawVal}
        onChange={handleChange}
      />
    </div>
  );
};

interface LocalizedTextareaProps {
  label?: string;
  hint?: string;
  placeholder?: string;
  rows?: number;
  value?: LocalizedString | string;
  contentLanguage: Language;
  onChange: (updated: LocalizedString) => void;
}

export const LocalizedTextarea: React.FC<LocalizedTextareaProps> = ({
  label,
  hint,
  placeholder,
  rows = 3,
  value,
  contentLanguage,
  onChange
}) => {
  const { isFallback } = getLocalizedText(value, contentLanguage);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updated = updateLocalizedString(value, contentLanguage, e.target.value);
    onChange(updated);
  };

  const rawVal = typeof value === 'string' ? value : (value?.[contentLanguage] || '');

  return (
    <div className="form-group">
      {label && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <label className="form-label" style={{ marginBottom: 0 }}>{label}</label>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: isFallback ? '#fffbeb' : 'var(--bg-muted)',
              color: isFallback ? '#b45309' : 'var(--text-subtle)',
              border: isFallback ? '1px solid #fde68a' : '1px solid var(--border-light)'
            }}
          >
            {contentLanguage.toUpperCase()} {isFallback ? '(EN Fallback)' : ''}
          </span>
        </div>
      )}
      {hint && <p className="form-hint">{hint}</p>}
      <textarea
        className="form-control"
        rows={rows}
        placeholder={placeholder ? `${placeholder} (${contentLanguage.toUpperCase()})` : ''}
        value={rawVal}
        onChange={handleChange}
      />
    </div>
  );
};
