import React, { useState } from 'react';
import { GuidanceTopic, DifficultyTier } from '../../types/guidance';
import { Language, getLocalizedText } from '../../types/brand';
import { filterTopicsByDifficulty } from '../../utils/guidanceController';
import {
  HelpCircle,
  Lightbulb,
  MessageSquare,
  AlertTriangle,
  ArrowUpRight,
  RefreshCw,
  BookOpen,
  X,
  ChevronDown,
  ChevronRight,
  CheckCircle
} from 'lucide-react';

interface ContextualGuidanceDrawerProps {
  topics: GuidanceTopic[];
  activeTopicId?: string;
  difficultyPreference?: DifficultyTier;
  uiLanguage: Language;
  isOpen?: boolean;
  onClose?: () => void;
  onSelectTopic?: (topicId: string) => void;
}

export const ContextualGuidanceDrawer: React.FC<ContextualGuidanceDrawerProps> = ({
  topics,
  activeTopicId,
  difficultyPreference = 'beginner',
  uiLanguage,
  isOpen = true,
  onClose,
  onSelectTopic
}) => {
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  if (!isOpen || topics.length === 0) return null;

  const currentTopic =
    topics.find((t) => t.id === activeTopicId) || topics[0];

  const { primary, advanced } = filterTopicsByDifficulty(topics, difficultyPreference);

  return (
    <div
      className="contextual-guidance-drawer"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '18px 20px',
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        marginBottom: '24px'
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={18} color="var(--accent-primary)" />
          <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
            {uiLanguage === 'id' ? 'Panduan Strategis & Arahan Desain' : 'Strategic Guidance & Mentor Notes'}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Topic Switcher Dropdown / Pills if multiple topics exist */}
          {topics.length > 1 && (
            <div style={{ display: 'flex', gap: '4px' }}>
              {primary.map((topic) => {
                const isSelected = topic.id === currentTopic.id;
                return (
                  <button
                    key={topic.id}
                    onClick={() => onSelectTopic?.(topic.id)}
                    className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                  >
                    {getLocalizedText(topic.title, uiLanguage).text}
                  </button>
                );
              })}
            </div>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="btn-icon"
              title={uiLanguage === 'id' ? 'Tutup Panduan' : 'Close Guidance'}
              style={{ width: '28px', height: '28px' }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Active Topic Header & Concept Taught */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor:
                currentTopic.tier === 'beginner'
                  ? 'var(--accent-light)'
                  : currentTopic.tier === 'intermediate'
                  ? 'rgba(59, 130, 246, 0.1)'
                  : 'rgba(168, 85, 247, 0.1)',
              color:
                currentTopic.tier === 'beginner'
                  ? 'var(--accent-primary)'
                  : currentTopic.tier === 'intermediate'
                  ? 'var(--color-info, #2563eb)'
                  : '#7c3aed'
            }}
          >
            {currentTopic.tier}
          </span>
          <h3 style={{ fontSize: '0.96rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
            {getLocalizedText(currentTopic.title, uiLanguage).text}
          </h3>
        </div>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-subtle)', margin: 0 }}>
          {getLocalizedText(currentTopic.shortDescription, uiLanguage).text}
        </p>
      </div>

      {/* 9 Pedagogical Blocks Renderer */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {currentTopic.blocks.map((block, index) => {
          return (
            <div key={index} style={{ fontSize: '0.84rem' }}>
              {/* 1. WhyThisMatters */}
              {block.type === 'whyThisMatters' && (
                <div
                  style={{
                    padding: '12px 14px',
                    backgroundColor: 'var(--bg-muted)',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: '3px solid var(--accent-primary)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <HelpCircle size={14} color="var(--accent-primary)" />
                    <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                      {uiLanguage === 'id' ? 'Mengapa Ini Penting?' : 'Why This Matters'}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-main)', lineHeight: 1.5 }}>
                    {getLocalizedText(block.content, uiLanguage).text}
                  </p>
                </div>
              )}

              {/* 2. ThinkAboutThis */}
              {block.type === 'thinkAboutThis' && (
                <div
                  style={{
                    padding: '12px 14px',
                    backgroundColor: 'rgba(59, 130, 246, 0.06)',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: '3px solid #3b82f6'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <Lightbulb size={14} color="#3b82f6" />
                    <span style={{ fontWeight: 700, color: '#1d4ed8', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                      {uiLanguage === 'id' ? 'Bahan Renungan' : 'Think About This'}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-main)', lineHeight: 1.5 }}>
                    {getLocalizedText(block.prompt, uiLanguage).text}
                  </p>
                </div>
              )}

              {/* 3. AskYourClient */}
              {block.type === 'askYourClient' && (
                <div
                  style={{
                    padding: '12px 14px',
                    backgroundColor: 'rgba(16, 185, 129, 0.06)',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: '3px solid #10b981'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <MessageSquare size={14} color="#10b981" />
                    <span style={{ fontWeight: 700, color: '#047857', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                      {uiLanguage === 'id' ? 'Tanyakan Pada Klien' : 'Ask Your Client'}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 6px 0', fontWeight: 600, color: 'var(--text-main)' }}>
                    "{getLocalizedText(block.question, uiLanguage).text}"
                  </p>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', lineHeight: 1.4 }}>
                    <strong>{uiLanguage === 'id' ? 'Hal yang dicari: ' : 'What to look for: '}</strong>
                    {getLocalizedText(block.whatToLookFor, uiLanguage).text}
                  </div>
                  {block.followUpPrompt && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '4px', fontStyle: 'italic' }}>
                      <strong>{uiLanguage === 'id' ? 'Pertanyaan lanjutan: ' : 'Follow-up: '}</strong>
                      "{getLocalizedText(block.followUpPrompt, uiLanguage).text}"
                    </div>
                  )}
                </div>
              )}

              {/* 4 & 5. Weak vs Strong Example Pair */}
              {block.type === 'weakExample' && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '12px'
                  }}
                >
                  <div
                    style={{
                      padding: '12px 14px',
                      backgroundColor: 'rgba(239, 68, 68, 0.05)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(239, 68, 68, 0.2)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <AlertTriangle size={14} color="#ef4444" />
                      <span style={{ fontWeight: 700, color: '#b91c1c', fontSize: '0.76rem', textTransform: 'uppercase' }}>
                        {uiLanguage === 'id' ? 'Contoh Kurang Kuat (Klise)' : 'Weak Example'}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 4px 0', fontStyle: 'italic', color: 'var(--text-main)' }}>
                      "{getLocalizedText(block.example, uiLanguage).text}"
                    </p>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#b91c1c' }}>
                      {getLocalizedText(block.critique, uiLanguage).text}
                    </p>
                  </div>
                </div>
              )}

              {block.type === 'strongExample' && (
                <div
                  style={{
                    padding: '12px 14px',
                    backgroundColor: 'rgba(16, 185, 129, 0.05)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <CheckCircle size={14} color="#10b981" />
                    <span style={{ fontWeight: 700, color: '#047857', fontSize: '0.76rem', textTransform: 'uppercase' }}>
                      {uiLanguage === 'id' ? 'Contoh Lebih Kuat & Konkret' : 'Stronger Example'}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 4px 0', fontWeight: 600, color: 'var(--text-main)' }}>
                    "{getLocalizedText(block.example, uiLanguage).text}"
                  </p>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#047857' }}>
                    {getLocalizedText(block.rationale, uiLanguage).text}
                  </p>
                </div>
              )}

              {/* 6. WatchOut */}
              {block.type === 'watchOut' && (
                <div
                  style={{
                    padding: '12px 14px',
                    backgroundColor: 'rgba(245, 158, 11, 0.06)',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: '3px solid #f59e0b'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <AlertTriangle size={14} color="#f59e0b" />
                    <span style={{ fontWeight: 700, color: '#b45309', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                      {uiLanguage === 'id' ? 'Jebakan yang Harus Dihindari' : 'Watch Out (Common Mistake)'}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 4px 0', fontWeight: 600, color: 'var(--text-main)' }}>
                    {getLocalizedText(block.mistake, uiLanguage).text}
                  </p>
                  <p style={{ margin: '0 0 4px 0', color: 'var(--text-subtle)', fontSize: '0.8rem' }}>
                    {getLocalizedText(block.whyItMatters, uiLanguage).text}
                  </p>
                  <p style={{ margin: 0, color: '#b45309', fontSize: '0.8rem', fontWeight: 500 }}>
                    <strong>{uiLanguage === 'id' ? 'Solusi: ' : 'Remedy: '}</strong>
                    {getLocalizedText(block.remedy, uiLanguage).text}
                  </p>
                </div>
              )}

              {/* 7. ConnectsTo */}
              {block.type === 'connectsTo' && (
                <div
                  style={{
                    padding: '10px 14px',
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px dashed var(--border-medium)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <ArrowUpRight size={16} color="var(--accent-primary)" />
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--accent-primary)', marginRight: '4px' }}>
                      {uiLanguage === 'id' ? 'Koneksi ke Tahap Berikutnya:' : 'Connects Downstream:'}
                    </span>
                    {getLocalizedText(block.explanation, uiLanguage).text}
                  </div>
                </div>
              )}

              {/* 8. RevisitWhen */}
              {block.type === 'revisitWhen' && (
                <div
                  style={{
                    padding: '10px 14px',
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px dashed var(--border-medium)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <RefreshCw size={16} color="#7c3aed" />
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>
                    <span style={{ fontWeight: 700, color: '#7c3aed', marginRight: '4px' }}>
                      {uiLanguage === 'id' ? 'Kapan Perlu Meninjau Ulang:' : 'Revisit When:'}
                    </span>
                    {getLocalizedText(block.triggerCondition, uiLanguage).text} —{' '}
                    <em>{getLocalizedText(block.recommendedAction, uiLanguage).text}</em>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Advanced Topics Section Toggle if present */}
      {advanced.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}
          >
            <span>
              {uiLanguage === 'id'
                ? `Topik Lanjutan (${advanced.length} topik)`
                : `Advanced Topics (${advanced.length} topics)`}
            </span>
            {showAdvanced ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {showAdvanced && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              {advanced.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onSelectTopic?.(t.id)}
                  style={{
                    padding: '8px 12px',
                    textAlign: 'left',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    backgroundColor: t.id === currentTopic.id ? 'var(--accent-light)' : 'var(--bg-surface)',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                    {getLocalizedText(t.title, uiLanguage).text}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-subtle)' }}>
                    {getLocalizedText(t.shortDescription, uiLanguage).text}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
