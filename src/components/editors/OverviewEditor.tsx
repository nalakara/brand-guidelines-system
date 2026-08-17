import React from 'react';
import { BrandOverviewModule, Language } from '../../types/brand';
import { LocalizedInput, LocalizedTextarea } from '../ui/LocalizedInput';
import { t } from '../../i18n/translations';

interface OverviewEditorProps {
  data?: BrandOverviewModule;
  uiLanguage: Language;
  contentLanguage: Language;
  onChange: (updated: BrandOverviewModule) => void;
}

export const OverviewEditor: React.FC<OverviewEditorProps> = ({
  data,
  uiLanguage,
  contentLanguage,
  onChange
}) => {
  const current: BrandOverviewModule = data || {
    brandName: '',
    oneLineDescription: { en: '', id: '' },
    longDescription: { en: '', id: '' },
    category: { en: '', id: '' },
    website: '',
    internalNotes: { en: '', id: '' }
  };

  const updateField = (field: keyof BrandOverviewModule, val: any) => {
    onChange({ ...current, [field]: val });
  };

  return (
    <div className="editor-card">
      <div className="editor-header">
        <div>
          <h2 className="editor-title">{t('overviewTitle', uiLanguage)}</h2>
          <p className="editor-subtitle">{t('overviewSubtitle', uiLanguage)}</p>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">{t('brandNameLabel', uiLanguage)}</label>
        <input
          type="text"
          className="form-control"
          placeholder={t('brandNamePlaceholder', uiLanguage)}
          value={current.brandName}
          onChange={(e) => updateField('brandName', e.target.value)}
        />
      </div>

      <LocalizedInput
        label={t('oneLinerLabel', uiLanguage)}
        hint={t('oneLinerHint', uiLanguage)}
        placeholder={t('oneLinerPlaceholder', uiLanguage)}
        value={current.oneLineDescription}
        contentLanguage={contentLanguage}
        onChange={(val) => updateField('oneLineDescription', val)}
      />

      <LocalizedInput
        label={t('categoryLabel', uiLanguage)}
        placeholder={t('categoryPlaceholder', uiLanguage)}
        value={current.category}
        contentLanguage={contentLanguage}
        onChange={(val) => updateField('category', val)}
      />

      <LocalizedTextarea
        label={t('longDescLabel', uiLanguage)}
        hint={t('longDescHint', uiLanguage)}
        placeholder={t('longDescPlaceholder', uiLanguage)}
        rows={4}
        value={current.longDescription}
        contentLanguage={contentLanguage}
        onChange={(val) => updateField('longDescription', val)}
      />

      <div className="form-group">
        <label className="form-label">{t('websiteLabel', uiLanguage)}</label>
        <input
          type="url"
          className="form-control"
          placeholder={t('websitePlaceholder', uiLanguage)}
          value={current.website}
          onChange={(e) => updateField('website', e.target.value)}
        />
      </div>

      <LocalizedTextarea
        label={t('internalNotesLabel', uiLanguage)}
        hint={t('internalNotesHint', uiLanguage)}
        placeholder={t('internalNotesPlaceholder', uiLanguage)}
        rows={2}
        value={current.internalNotes}
        contentLanguage={contentLanguage}
        onChange={(val) => updateField('internalNotes', val)}
      />
    </div>
  );
};
