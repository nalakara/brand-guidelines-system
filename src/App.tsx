import React, { useState, useEffect, useRef } from 'react';
import { Brand, ModuleId, Language } from './types/brand';
import {
  loadBrands,
  saveSingleBrand,
  createNewBrand,
  deleteBrand as deleteBrandFromStorage,
  getActiveBrandId,
  saveActiveBrandId
} from './services/storage';

// Components
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ModuleManagerModal } from './components/ModuleManagerModal';
import { GuidelinePreview } from './components/preview/GuidelinePreview';

// Editors
import { OverviewEditor } from './components/editors/OverviewEditor';
import { StrategyEditor } from './components/editors/StrategyEditor';
import { PositioningEditor } from './components/editors/PositioningEditor';
import { PersonalityEditor } from './components/editors/PersonalityEditor';
import { VoiceToneEditor } from './components/editors/VoiceToneEditor';
import { LogoSystemEditor } from './components/editors/LogoSystemEditor';
import { ColorSystemEditor } from './components/editors/ColorSystemEditor';
import { TypographySystemEditor } from './components/editors/TypographySystemEditor';
import { ImageryEditor } from './components/editors/ImageryEditor';
import { GraphicLanguageEditor } from './components/editors/GraphicLanguageEditor';
import { LayoutCompositionEditor } from './components/editors/LayoutCompositionEditor';
import { VisualAssetsEditor } from './components/editors/VisualAssetsEditor';
import { VisualRulesEditor } from './components/editors/VisualRulesEditor';
import { MessagingEditor } from './components/editors/MessagingEditor';

export const App: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [activeBrandId, setActiveBrandId] = useState<string>('');
  const [activeModuleId, setActiveModuleId] = useState<ModuleId>('overview');
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isModuleManagerOpen, setIsModuleManagerOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const [visualKnowledgeTab, setVisualKnowledgeTab] = useState<
    'logo' | 'color' | 'typography' | 'imagery' | 'graphicLanguage' | 'layoutComposition'
  >('logo');

  // Multilingual State
  const [uiLanguage, setUiLanguage] = useState<Language>('en');
  const [contentLanguage, setContentLanguage] = useState<Language>('en');

  const saveTimeoutRef = useRef<any>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    const loaded = loadBrands();
    setBrands(loaded);

    const savedActiveId = getActiveBrandId();
    if (savedActiveId && loaded.some(b => b.id === savedActiveId)) {
      setActiveBrandId(savedActiveId);
    } else if (loaded.length > 0) {
      setActiveBrandId(loaded[0].id);
      saveActiveBrandId(loaded[0].id);
    }

    const savedUiLang = localStorage.getItem('app_ui_lang') as Language;
    if (savedUiLang === 'en' || savedUiLang === 'id') setUiLanguage(savedUiLang);

    const savedContentLang = localStorage.getItem('app_content_lang') as Language;
    if (savedContentLang === 'en' || savedContentLang === 'id') setContentLanguage(savedContentLang);
  }, []);

  const activeBrand = brands.find(b => b.id === activeBrandId) || brands[0];

  const handleUpdateModuleData = (moduleId: ModuleId, updatedData: any) => {
    if (!activeBrand) return;

    const updatedBrand: Brand = {
      ...activeBrand,
      name: moduleId === 'overview' && updatedData.brandName ? updatedData.brandName : activeBrand.name,
      modules: {
        ...activeBrand.modules,
        [moduleId]: updatedData
      }
    };

    setBrands(prev => prev.map(b => b.id === updatedBrand.id ? updatedBrand : b));

    setIsSaving(true);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveSingleBrand(updatedBrand);
      setIsSaving(false);
    }, 400);
  };

  const handleToggleModule = (moduleId: ModuleId) => {
    if (!activeBrand) return;
    const currentActive = activeBrand.activeModules || [];
    let nextActive: ModuleId[];

    if (currentActive.includes(moduleId)) {
      nextActive = currentActive.filter(m => m !== moduleId);
    } else {
      nextActive = [...currentActive, moduleId];
    }

    const updatedBrand: Brand = {
      ...activeBrand,
      activeModules: nextActive
    };

    setBrands(prev => prev.map(b => b.id === updatedBrand.id ? updatedBrand : b));
    saveSingleBrand(updatedBrand);
  };

  const handleSelectBrand = (id: string) => {
    setActiveBrandId(id);
    saveActiveBrandId(id);
    const target = brands.find(b => b.id === id);
    if (target && target.activeModules.length > 0) {
      if (!target.activeModules.includes(activeModuleId)) {
        setActiveModuleId(target.activeModules[0]);
      }
    }
  };

  const handleCreateBrand = (name: string) => {
    const newB = createNewBrand(name);
    setBrands(loadBrands());
    setActiveBrandId(newB.id);
    setActiveModuleId('overview');
    setViewMode('edit');
  };

  const handleDeleteBrand = (id: string) => {
    const remaining = deleteBrandFromStorage(id);
    setBrands(remaining);
    if (remaining.length > 0) {
      setActiveBrandId(remaining[0].id);
    }
  };

  const handleJumpToModuleEdit = (moduleId: ModuleId) => {
    setActiveModuleId(moduleId);
    setViewMode('edit');
  };

  const handleChangeUiLang = (lang: Language) => {
    setUiLanguage(lang);
    localStorage.setItem('app_ui_lang', lang);
  };

  const handleChangeContentLang = (lang: Language) => {
    setContentLanguage(lang);
    localStorage.setItem('app_content_lang', lang);
  };

  if (!activeBrand) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Brand Guidelines Workspace...</div>;
  }

  return (
    <div className="app-container">
      <Sidebar
        brands={brands}
        activeBrand={activeBrand}
        activeModuleId={activeModuleId}
        isOpenMobile={isMobileMenuOpen}
        uiLanguage={uiLanguage}
        onSelectBrand={handleSelectBrand}
        onCreateBrand={handleCreateBrand}
        onDeleteBrand={handleDeleteBrand}
        onSelectModule={(mId) => {
          setActiveModuleId(mId);
          setIsMobileMenuOpen(false);
        }}
        onOpenModuleManager={() => setIsModuleManagerOpen(true)}
      />

      <div className="main-wrapper">
        <Header
          brand={activeBrand}
          viewMode={viewMode}
          isSaving={isSaving}
          uiLanguage={uiLanguage}
          contentLanguage={contentLanguage}
          onToggleViewMode={setViewMode}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onOpenModuleManager={() => setIsModuleManagerOpen(true)}
          onChangeUiLanguage={handleChangeUiLang}
          onChangeContentLanguage={handleChangeContentLang}
        />

        <main className="content-area">
          <div className="content-max-width">
            {viewMode === 'edit' ? (
              <>
                {activeModuleId === 'overview' && (
                  <OverviewEditor
                    data={activeBrand.modules.overview}
                    uiLanguage={uiLanguage}
                    contentLanguage={contentLanguage}
                    onChange={(updated) => handleUpdateModuleData('overview', updated)}
                  />
                )}
                {activeModuleId === 'strategy' && (
                  <StrategyEditor
                    data={activeBrand.modules.strategy}
                    uiLanguage={uiLanguage}
                    contentLanguage={contentLanguage}
                    onChange={(updated) => handleUpdateModuleData('strategy', updated)}
                  />
                )}
                {activeModuleId === 'positioning' && (
                  <PositioningEditor
                    data={activeBrand.modules.positioning}
                    uiLanguage={uiLanguage}
                    contentLanguage={contentLanguage}
                    onChange={(updated) => handleUpdateModuleData('positioning', updated)}
                  />
                )}
                {activeModuleId === 'personality' && (
                  <PersonalityEditor
                    data={activeBrand.modules.personality}
                    uiLanguage={uiLanguage}
                    contentLanguage={contentLanguage}
                    onChange={(updated) => handleUpdateModuleData('personality', updated)}
                  />
                )}
                {activeModuleId === 'voiceTone' && (
                  <VoiceToneEditor
                    data={activeBrand.modules.voiceTone}
                    uiLanguage={uiLanguage}
                    contentLanguage={contentLanguage}
                    onChange={(updated) => handleUpdateModuleData('voiceTone', updated)}
                  />
                )}
                {(activeModuleId === 'visualBasics' || activeModuleId === 'visualKnowledge') && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Sub-navigation tabs for Visual Knowledge */}
                    <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                      <button
                        className={`btn ${visualKnowledgeTab === 'logo' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.86rem' }}
                        onClick={() => setVisualKnowledgeTab('logo')}
                      >
                        Logo System
                      </button>
                      <button
                        className={`btn ${visualKnowledgeTab === 'color' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.86rem' }}
                        onClick={() => setVisualKnowledgeTab('color')}
                      >
                        Color System
                      </button>
                      <button
                        className={`btn ${visualKnowledgeTab === 'typography' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.86rem' }}
                        onClick={() => setVisualKnowledgeTab('typography')}
                      >
                        Typography System
                      </button>
                      <button
                        className={`btn ${visualKnowledgeTab === 'imagery' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.86rem' }}
                        onClick={() => setVisualKnowledgeTab('imagery')}
                      >
                        Imagery
                      </button>
                      <button
                        className={`btn ${visualKnowledgeTab === 'graphicLanguage' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.86rem' }}
                        onClick={() => setVisualKnowledgeTab('graphicLanguage')}
                      >
                        Graphic Language
                      </button>
                      <button
                        className={`btn ${visualKnowledgeTab === 'layoutComposition' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.86rem' }}
                        onClick={() => setVisualKnowledgeTab('layoutComposition')}
                      >
                        Layout & Composition
                      </button>
                    </div>

                    {visualKnowledgeTab === 'logo' && (
                      <LogoSystemEditor
                        data={activeBrand.modules.visualBasics}
                        uiLanguage={uiLanguage}
                        contentLanguage={contentLanguage}
                        onChange={(updated) => handleUpdateModuleData('visualBasics', updated)}
                      />
                    )}
                    {visualKnowledgeTab === 'color' && (
                      <ColorSystemEditor
                        data={activeBrand.modules.visualBasics}
                        uiLanguage={uiLanguage}
                        contentLanguage={contentLanguage}
                        onChange={(updated) => handleUpdateModuleData('visualBasics', updated)}
                      />
                    )}
                    {visualKnowledgeTab === 'typography' && (
                      <TypographySystemEditor
                        data={activeBrand.modules.visualBasics}
                        uiLanguage={uiLanguage}
                        contentLanguage={contentLanguage}
                        onChange={(updated) => handleUpdateModuleData('visualBasics', updated)}
                      />
                    )}
                    {visualKnowledgeTab === 'imagery' && (
                      <ImageryEditor
                        data={activeBrand.modules.visualBasics}
                        uiLanguage={uiLanguage}
                        contentLanguage={contentLanguage}
                        onChange={(updated) => handleUpdateModuleData('visualBasics', updated)}
                      />
                    )}
                    {visualKnowledgeTab === 'graphicLanguage' && (
                      <GraphicLanguageEditor
                        data={activeBrand.modules.visualBasics}
                        uiLanguage={uiLanguage}
                        contentLanguage={contentLanguage}
                        onChange={(updated) => handleUpdateModuleData('visualBasics', updated)}
                      />
                    )}
                    {visualKnowledgeTab === 'layoutComposition' && (
                      <LayoutCompositionEditor
                        data={activeBrand.modules.visualBasics}
                        uiLanguage={uiLanguage}
                        contentLanguage={contentLanguage}
                        onChange={(updated) => handleUpdateModuleData('visualBasics', updated)}
                      />
                    )}
                  </div>
                )}
                {activeModuleId === 'visualAssets' && (
                  <VisualAssetsEditor
                    data={activeBrand.modules.visualAssets || []}
                    uiLanguage={uiLanguage}
                    contentLanguage={contentLanguage}
                    onChange={(updated) => handleUpdateModuleData('visualAssets', updated)}
                  />
                )}
                {activeModuleId === 'visualRules' && (
                  <VisualRulesEditor
                    data={activeBrand.modules.visualRules || []}
                    brand={activeBrand}
                    uiLanguage={uiLanguage}
                    contentLanguage={contentLanguage}
                    onChange={(updated) => handleUpdateModuleData('visualRules', updated)}
                  />
                )}
                {activeModuleId === 'messaging' && (
                  <MessagingEditor
                    data={activeBrand.modules.messaging}
                    brand={activeBrand}
                    uiLanguage={uiLanguage}
                    contentLanguage={contentLanguage}
                    onChange={(updated) => handleUpdateModuleData('messaging', updated)}
                  />
                )}
              </>
            ) : (
              <GuidelinePreview
                brand={activeBrand}
                contentLanguage={contentLanguage}
                onJumpToModule={handleJumpToModuleEdit}
              />
            )}
          </div>
        </main>
      </div>

      <ModuleManagerModal
        isOpen={isModuleManagerOpen}
        brand={activeBrand}
        uiLanguage={uiLanguage}
        onClose={() => setIsModuleManagerOpen(false)}
        onToggleModule={handleToggleModule}
      />
    </div>
  );
};
