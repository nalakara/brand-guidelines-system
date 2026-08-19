import React, { useState, useRef } from 'react';
import {
  Language,
  VisualAssetItem,
  AssetCategory,
  AssetFile,
  getLocalizedText
} from '../../types/brand';
import { LocalizedTextarea } from '../ui/LocalizedInput';
import { t } from '../../i18n/translations';
import {
  Plus,
  Search,
  Trash2,
  File,
  Image,
  Type,
  Grid,
  PenTool,
  Smile,
  Sparkles,
  ChevronRight,
  Upload,
  AlertTriangle,
  Folder
} from 'lucide-react';

interface VisualAssetsEditorProps {
  data?: VisualAssetItem[];
  uiLanguage: Language;
  contentLanguage: Language;
  onChange: (updatedAssets: VisualAssetItem[]) => void;
}

const ASSET_CATEGORIES: { category: AssetCategory; labelKey: string; icon: any }[] = [
  { category: 'logos', labelKey: 'categoryLogos', icon: Sparkles },
  { category: 'fonts', labelKey: 'categoryFonts', icon: Type },
  { category: 'images', labelKey: 'categoryImages', icon: Image },
  { category: 'illustrations', labelKey: 'categoryIllustrations', icon: PenTool },
  { category: 'icons', labelKey: 'categoryIcons', icon: Smile },
  { category: 'patterns', labelKey: 'categoryPatterns', icon: Grid },
  { category: 'other', labelKey: 'categoryOther', icon: Folder }
];

export const VisualAssetsEditor: React.FC<VisualAssetsEditorProps> = ({
  data = [],
  uiLanguage,
  contentLanguage,
  onChange
}) => {
  const assetsList = data;

  const [activeFilter, setActiveFilter] = useState<AssetCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  // Add Asset Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState<AssetCategory>('logos');
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetNotes, setNewAssetNotes] = useState<any>(undefined);
  const [uploadedFiles, setUploadedFiles] = useState<AssetFile[]>([]);

  // Deletion confirmation warning state
  const [deleteWarningAsset, setDeleteWarningAsset] = useState<VisualAssetItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const filesArray = Array.from(e.target.files);
    const parsedFiles: AssetFile[] = [];

    filesArray.forEach((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
      const reader = new FileReader();

      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const newFileRecord: AssetFile = {
          id: 'file-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
          filename: file.name,
          format: ext.toUpperCase(),
          sizeBytes: file.size,
          dataUrl,
          uploadedAt: new Date().toISOString()
        };

        parsedFiles.push(newFileRecord);

        if (parsedFiles.length === filesArray.length) {
          setUploadedFiles((prev) => [...prev, ...parsedFiles]);
          if (!newAssetName) {
            // Default human name from first file basename
            const baseName = filesArray[0].name.replace(/\.[^/.]+$/, '');
            setNewAssetName(baseName.replace(/[-_]/g, ' '));
          }
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetName.trim() || uploadedFiles.length === 0) return;

    const newAsset: VisualAssetItem = {
      id: 'asset-' + Date.now(),
      name: newAssetName.trim(),
      category: newCategory,
      notes: newAssetNotes,
      files: uploadedFiles,
      references: [],
      updatedAt: new Date().toISOString()
    };

    const updated = [...assetsList, newAsset];
    onChange(updated);

    // Reset & open detail view
    setNewAssetName('');
    setNewAssetNotes(undefined);
    setUploadedFiles([]);
    setShowAddModal(false);
    setSelectedAssetId(newAsset.id);
  };

  const handleConfirmDeleteAsset = () => {
    if (!deleteWarningAsset) return;
    const updated = assetsList.filter((a) => a.id !== deleteWarningAsset.id);
    onChange(updated);
    if (selectedAssetId === deleteWarningAsset.id) {
      setSelectedAssetId(null);
    }
    setDeleteWarningAsset(null);
  };

  const selectedAsset = assetsList.find((a) => a.id === selectedAssetId);

  const filteredAssets = assetsList.filter((asset) => {
    const matchesFilter = activeFilter === 'all' || asset.category === activeFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      asset.name.toLowerCase().includes(q) ||
      asset.category.toLowerCase().includes(q) ||
      asset.files.some((f) => f.filename.toLowerCase().includes(q) || f.format.toLowerCase().includes(q));
    return matchesFilter && matchesQuery;
  });

  const renderFilePreview = (file: AssetFile, category: AssetCategory) => {
    if (file.dataUrl && (file.format === 'PNG' || file.format === 'JPG' || file.format === 'JPEG' || file.format === 'SVG' || file.format === 'WEBP' || file.format === 'GIF')) {
      return (
        <img
          src={file.dataUrl}
          alt={file.filename}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      );
    }

    if (category === 'fonts' || file.format === 'WOFF' || file.format === 'WOFF2' || file.format === 'TTF' || file.format === 'OTF') {
      return (
        <div style={{ textAlign: 'center', padding: '10px' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'serif', color: 'var(--text-main)' }}>
            Aa Bb Cc
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'monospace' }}>
            0123456789
          </div>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-muted)' }}>
        <File size={32} />
        <span style={{ fontSize: '0.72rem', marginTop: '4px', fontFamily: 'monospace', fontWeight: 600 }}>
          {file.format}
        </span>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="editor-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 className="editor-title" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {t('visualAssetsTitle', uiLanguage)}
            </h2>
            <p className="editor-subtitle" style={{ marginTop: '2px' }}>
              {t('visualAssetsSubtitle', uiLanguage)}
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => {
              setShowAddModal(true);
              setSelectedAssetId(null);
            }}
          >
            <Plus size={16} /> {t('addAsset', uiLanguage)}
          </button>
        </div>

        {/* Filter Controls & Search */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '36px', fontSize: '0.86rem' }}
              placeholder={t('searchAssetsPlaceholder', uiLanguage)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Chips */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`btn ${activeFilter === 'all' ? 'btn-accent' : 'btn-secondary'} btn-sm`}
              style={{ fontSize: '0.8rem' }}
            >
              {t('allAssetsFilter', uiLanguage)} ({assetsList.length})
            </button>
            {ASSET_CATEGORIES.map((ac) => {
              const count = assetsList.filter((a) => a.category === ac.category).length;
              return (
                <button
                  key={ac.category}
                  type="button"
                  onClick={() => setActiveFilter(ac.category)}
                  className={`btn ${activeFilter === ac.category ? 'btn-accent' : 'btn-secondary'} btn-sm`}
                  style={{ fontSize: '0.8rem' }}
                >
                  {t(ac.labelKey, uiLanguage)} {count > 0 ? `(${count})` : ''}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Asset Modal / Form Flow */}
      {showAddModal && (
        <div className="editor-card" style={{ padding: '24px', border: '2px solid var(--accent-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{t('addAsset', uiLanguage)}</h3>
            <button className="btn-icon" onClick={() => setShowAddModal(false)}>
              ✕
            </button>
          </div>

          <form onSubmit={handleCreateAsset} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>{t('assetCategoryLabel', uiLanguage)}</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                {ASSET_CATEGORIES.map((ac) => (
                  <button
                    key={ac.category}
                    type="button"
                    onClick={() => setNewCategory(ac.category)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: newCategory === ac.category ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                      backgroundColor: newCategory === ac.category ? 'var(--accent-light)' : 'var(--bg-card)',
                      fontSize: '0.84rem',
                      cursor: 'pointer'
                    }}
                  >
                    {t(ac.labelKey, uiLanguage)}
                  </button>
                ))}
              </div>
            </div>

            {/* Drop Files Area */}
            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>Upload Files *</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '32px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: 'var(--bg-muted)',
                  transition: 'border-color var(--transition-fast)'
                }}
              >
                <Upload size={28} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {t('dropFilesText', uiLanguage)}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  style={{ display: 'none' }}
                />
              </div>

              {/* Uploaded File List */}
              {uploadedFiles.length > 0 && (
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: 'var(--bg-card)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.82rem'
                      }}
                    >
                      <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{file.filename}</span>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {file.format} · {(file.sizeBytes / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">{t('assetNameLabel', uiLanguage)}</label>
              <input
                type="text"
                className="form-control"
                placeholder={t('assetNamePlaceholder', uiLanguage)}
                value={newAssetName}
                onChange={(e) => setNewAssetName(e.target.value)}
                required
              />
            </div>

            <LocalizedTextarea
              label={t('notes', uiLanguage)}
              placeholder="Optional notes or usage context..."
              rows={2}
              value={newAssetNotes}
              contentLanguage={contentLanguage}
              onChange={setNewAssetNotes}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                {t('cancel', uiLanguage)}
              </button>
              <button type="submit" className="btn btn-accent" disabled={!newAssetName.trim() || uploadedFiles.length === 0}>
                {t('create', uiLanguage)}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Grid View & Detail Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: filteredAssets.length > 0 ? 'repeat(auto-fill, minmax(240px, 1fr))' : '1fr', gap: '16px' }}>
        {filteredAssets.length === 0 ? (
          <div className="editor-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
            <Folder size={32} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{t('noAssetsTitle', uiLanguage)}</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-subtle)', marginBottom: '20px' }}>
              {t('noAssetsSubtitle', uiLanguage)}
            </p>
            <button className="btn btn-accent" onClick={() => setShowAddModal(true)}>
              <Plus size={16} /> {t('addAsset', uiLanguage)}
            </button>
          </div>
        ) : (
          filteredAssets.map((asset) => {
            const isSelected = selectedAssetId === asset.id;
            const firstFile = asset.files[0];
            const hasReferences = asset.references && asset.references.length > 0;

            return (
              <div
                key={asset.id}
                onClick={() => setSelectedAssetId(isSelected ? null : asset.id)}
                style={{
                  borderRadius: 'var(--radius-md)',
                  border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-card)',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Preview Box */}
                <div
                  style={{
                    height: '140px',
                    backgroundColor: 'var(--bg-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid var(--border-light)'
                  }}
                >
                  {firstFile ? renderFilePreview(firstFile, asset.category) : <File size={28} />}
                </div>

                {/* Info Card Body */}
                <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {asset.name}
                    </h4>
                    <ChevronRight size={16} style={{ color: isSelected ? 'var(--accent-primary)' : 'var(--border-medium)' }} />
                  </div>

                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                      {asset.category}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      {asset.files.length > 1 ? `${asset.files.length} files` : firstFile?.format}
                    </span>
                  </div>

                  {hasReferences && (
                    <div style={{ fontSize: '0.74rem', color: 'var(--accent-primary)', fontWeight: 600, marginTop: '2px' }}>
                      Used by {asset.references![0].moduleId}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Selected Asset Detail Editor View */}
      {selectedAsset && (
        <div className="editor-card" style={{ padding: '24px', borderTop: '2px solid var(--accent-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selectedAsset.name}</h3>
              <span className="badge badge-secondary" style={{ marginTop: '2px' }}>
                {selectedAsset.category}
              </span>
            </div>

            <button
              className="btn-icon"
              style={{ color: '#ef4444' }}
              title="Remove Asset"
              onClick={() => setDeleteWarningAsset(selectedAsset)}
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px' }}>
            {/* File List & Large Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  height: '200px',
                  backgroundColor: 'var(--bg-muted)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px'
                }}
              >
                {selectedAsset.files[0] ? renderFilePreview(selectedAsset.files[0], selectedAsset.category) : <File size={40} />}
              </div>

              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Files ({selectedAsset.files.length})
              </div>
              {selectedAsset.files.map((f) => (
                <div key={f.id} style={{ padding: '8px 10px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                  <div style={{ fontWeight: 600, fontFamily: 'monospace' }}>{f.filename}</div>
                  <div style={{ color: 'var(--text-subtle)', fontSize: '0.75rem' }}>
                    {f.format} · {(f.sizeBytes / 1024).toFixed(1)} KB
                  </div>
                </div>
              ))}
            </div>

            {/* Metadata & Usage Reference Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  {t('usedByTitle', uiLanguage)}
                </h4>
                {selectedAsset.references && selectedAsset.references.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {selectedAsset.references.map((ref, idx) => (
                      <div key={idx} style={{ padding: '8px 12px', backgroundColor: 'var(--accent-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                        <span style={{ fontWeight: 600 }}>{ref.moduleId}:</span> {ref.entityName}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.86rem', color: 'var(--text-subtle)' }}>
                    {t('notCurrentlyUsedText', uiLanguage)}
                  </div>
                )}
              </div>

              {selectedAsset.notes && (
                <div>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    {t('notes', uiLanguage)}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                    {getLocalizedText(selectedAsset.notes, contentLanguage).text}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Warning Modal */}
      {deleteWarningAsset && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="editor-card" style={{ width: '420px', padding: '24px', backgroundColor: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ef4444', marginBottom: '12px' }}>
              <AlertTriangle size={24} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {t('deleteAssetWarningTitle', uiLanguage)}
              </h3>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-subtle)', lineHeight: 1.5, marginBottom: '20px' }}>
              {deleteWarningAsset.references && deleteWarningAsset.references.length > 0
                ? t('deleteAssetWarningText', uiLanguage)
                : `Are you sure you want to remove "${deleteWarningAsset.name}"?`}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={() => setDeleteWarningAsset(null)}>
                {t('cancel', uiLanguage)}
              </button>
              <button className="btn btn-accent" style={{ backgroundColor: '#ef4444' }} onClick={handleConfirmDeleteAsset}>
                {t('confirmDeleteAsset', uiLanguage)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
