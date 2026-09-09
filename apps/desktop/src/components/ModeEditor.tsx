import { useEffect, useState } from "react";
import { api } from "../api";
import { CATEGORIES, type ActionStep, type Mode } from "../types";
import { CATEGORY_META, actionMeta, categoryMeta, catStyle } from "../modeMeta";
import { IconSparkles, IconPlus, IconTrash, IconCheck, IconSliders } from "./Icons";

// Param form specs per action_type (the "no-code" bit). Unknown types fall
// back to a raw JSON textarea.
type Field = { key: string; label: string; kind: "number" | "text" };
const PARAM_SPECS: Record<string, Field[]> = {
  "audio.set_volume": [{ key: "percent", label: "Volume %", kind: "number" }],
  "display.set_brightness": [{ key: "percent", label: "Luminosité %", kind: "number" }],
  "system.launch_app": [{ key: "path", label: "Chemin de l'exécutable", kind: "text" }],
  "system.close_app": [{ key: "name", label: "Nom du processus", kind: "text" }],
  "system.open_url": [{ key: "url", label: "URL de la page", kind: "text" }],
  "gaming.launch_steam": [{ key: "app_id", label: "App ID Steam (ex: 730)", kind: "text" }],
  "gaming.launch_epic": [{ key: "name", label: "Identifiant jeu Epic", kind: "text" }],
  "gaming.launch_gog": [{ key: "game_id", label: "ID jeu GOG", kind: "text" }],
  "iot.hue.activate_scene": [{ key: "scene", label: "Nom de la scène Hue", kind: "text" }],
  "peripheral.apply_rgb_profile": [{ key: "profile", label: "Profil RGB", kind: "text" }],
};

export default function ModeEditor({
  modes,
  reload,
}: {
  modes: Mode[];
  reload: () => void;
}) {
  const [catalog, setCatalog] = useState<string[]>([]);
  const [draft, setDraft] = useState<Mode | null>(null);
  const [saving, setSaving] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    api.actionCatalog().then(setCatalog).catch(console.error);
  }, []);

  async function newMode() {
    const id = await api.newId();
    setDraft({ id, name: "Nouveau profil", description: "", category: "custom", steps: [] });
  }

  function edit(mode: Mode) {
    setDraft(JSON.parse(JSON.stringify(mode)));
  }

  async function generate() {
    if (!aiPrompt.trim()) return;
    setGenerating(true);
    try {
      setDraft(await api.aiGenerate(aiPrompt));
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  }

  function patch(p: Partial<Mode>) {
    setDraft((d) => (d ? { ...d, ...p } : d));
  }

  function patchStep(i: number, p: Partial<ActionStep>) {
    setDraft((d) => {
      if (!d) return d;
      const steps = d.steps.map((s, idx) => (idx === i ? { ...s, ...p } : s));
      return { ...d, steps };
    });
  }

  function addStep() {
    setDraft((d) => {
      if (!d) return d;
      const type = catalog[0] ?? "system.open_url";
      const step: ActionStep = {
        order: d.steps.length + 1,
        type,
        params: {},
        enabled: true,
        on_error: "continue",
      };
      return { ...d, steps: [...d.steps, step] };
    });
  }

  function removeStep(i: number) {
    setDraft((d) => (d ? { ...d, steps: d.steps.filter((_, idx) => idx !== i) } : d));
  }

  function move(i: number, dir: -1 | 1) {
    setDraft((d) => {
      if (!d) return d;
      const j = i + dir;
      if (j < 0 || j >= d.steps.length) return d;
      const steps = [...d.steps];
      [steps[i], steps[j]] = [steps[j], steps[i]];
      steps.forEach((s, idx) => (s.order = idx + 1));
      return { ...d, steps };
    });
  }

  async function save() {
    if (!draft) return;
    setSaving(true);
    try {
      const normalized = {
        ...draft,
        steps: draft.steps.map((s, idx) => ({ ...s, order: idx + 1 })),
      };
      await api.saveMode(normalized);
      reload();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!draft) return;
    await api.deleteMode(draft.id);
    setDraft(null);
    reload();
  }

  return (
    <div className="standard-view editor-layout">
      {/* SIDEBAR: PRESET LIST & AI ASSISTANT */}
      <aside className="editor-sidebar">
        <div className="ai-command-box">
          <div className="ai-box-head">
            <IconSparkles size={14} className="ai-icon" />
            <span className="ai-box-title">Mode-as-Code IA</span>
          </div>
          <p className="ai-box-sub">Générez un profil à partir d'une consigne.</p>
          <div className="ai-input-wrap">
            <input
              placeholder="Ex: stream compétitif sur twitch"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generate()}
            />
            <button className="ai-generate-btn" disabled={generating} onClick={generate}>
              {generating ? "Génération…" : "Créer"}
            </button>
          </div>
        </div>

        <div className="sidebar-presets-list">
          <div className="sidebar-list-header">
            <span className="sidebar-list-title">Profils enregistrés</span>
            <button className="btn-new-mode" onClick={newMode}>
              <IconPlus size={14} />
              <span>Nouveau</span>
            </button>
          </div>

          <div className="preset-item-stack">
            {modes.map((m) => {
              const cm = categoryMeta(m.category);
              const Icon = cm.Icon;
              const isSelected = draft?.id === m.id;

              return (
                <button
                  key={m.id}
                  className={`preset-nav-item ${isSelected ? "selected" : ""}`}
                  style={catStyle(cm.color)}
                  onClick={() => edit(m)}
                >
                  <div className="item-icon-wrap">
                    <Icon size={15} />
                  </div>
                  <div className="item-meta">
                    <span className="item-name">{m.name}</span>
                    <span className="item-count">{m.steps.length} actions</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* MAIN WORKSPACE FORM */}
      <section className="editor-workspace">
        {!draft ? (
          <div className="editor-blank-slate">
            <IconSliders size={32} className="blank-icon" />
            <h3>Studio de Configuration</h3>
            <p>Sélectionnez un profil à gauche ou créez-en un nouveau pour calibrer ses actions.</p>
            <button className="btn-accent" onClick={newMode}>
              <IconPlus size={15} />
              <span>Créer un profil</span>
            </button>
          </div>
        ) : (
          <div className="editor-sheet">
            {/* PROFILE META HEADER */}
            <div className="editor-sheet-header">
              <div
                className="sheet-category-icon"
                style={catStyle(categoryMeta(draft.category).color)}
              >
                {(() => {
                  const Icon = categoryMeta(draft.category).Icon;
                  return <Icon size={24} />;
                })()}
              </div>

              <div className="sheet-meta-fields">
                <div className="sheet-row">
                  <div className="form-group flex-2">
                    <label>Nom du profil</label>
                    <input
                      value={draft.name}
                      placeholder="Ex: Gaming Nocturne"
                      onChange={(e) => patch({ name: e.target.value })}
                    />
                  </div>

                  <div className="form-group flex-1">
                    <label>Catégorie</label>
                    <select
                      value={draft.category}
                      onChange={(e) => patch({ category: e.target.value as Mode["category"] })}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {CATEGORY_META[c].label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Description (optionnelle)</label>
                  <input
                    value={draft.description ?? ""}
                    placeholder="Brève description de l'usage..."
                    onChange={(e) => patch({ description: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* ACTION PIPELINE */}
            <div className="action-pipeline-section">
              <div className="pipeline-header">
                <div>
                  <span className="section-eyebrow">SÉQUENCE D'EXÉCUTION</span>
                  <h3>Actions Orchestrées ({draft.steps.length})</h3>
                </div>
                <button className="btn-secondary" onClick={addStep}>
                  <IconPlus size={14} />
                  <span>Ajouter une action</span>
                </button>
              </div>

              <div className="pipeline-stack">
                {draft.steps.map((step, i) => {
                  const am = actionMeta(step.type);
                  const StepIcon = am.Icon;

                  return (
                    <div key={i} className={`pipeline-step ${!step.enabled ? "disabled" : ""}`}>
                      <div className="step-bar">
                        <div className="step-order-badge">{i + 1}</div>
                        <div className="step-type-icon">
                          <StepIcon size={16} />
                        </div>
                        <select
                          className="step-type-select"
                          value={step.type}
                          onChange={(e) => patchStep(i, { type: e.target.value, params: {} })}
                        >
                          {catalog.map((a) => {
                            const meta = actionMeta(a);
                            return (
                              <option key={a} value={a}>
                                {meta.domain} — {meta.label}
                              </option>
                            );
                          })}
                        </select>

                        <div className="step-actions-group">
                          <button
                            className="btn-icon"
                            onClick={() => move(i, -1)}
                            disabled={i === 0}
                            title="Monter"
                          >
                            ↑
                          </button>
                          <button
                            className="btn-icon"
                            onClick={() => move(i, 1)}
                            disabled={i === draft.steps.length - 1}
                            title="Descendre"
                          >
                            ↓
                          </button>
                          <button
                            className="btn-icon danger"
                            onClick={() => removeStep(i)}
                            title="Supprimer"
                          >
                            <IconTrash size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="step-details-pane">
                        <ParamFields
                          type={step.type}
                          params={step.params}
                          onChange={(params) => patchStep(i, { params })}
                        />

                        <div className="step-options-foot">
                          <label className="checkbox-pill">
                            <input
                              type="checkbox"
                              checked={step.enabled}
                              onChange={(e) => patchStep(i, { enabled: e.target.checked })}
                            />
                            <span>Action active</span>
                          </label>

                          <div className="step-error-policy">
                            <span>Si échec :</span>
                            <select
                              value={step.on_error}
                              onChange={(e) =>
                                patchStep(i, { on_error: e.target.value as ActionStep["on_error"] })
                              }
                            >
                              <option value="continue">Continuer la séquence</option>
                              <option value="abort">Interrompre le profil</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {draft.steps.length === 0 && (
                  <div className="pipeline-empty">
                    <p>Aucune action dans ce profil.</p>
                    <button className="btn-secondary" onClick={addStep}>
                      <IconPlus size={14} />
                      <span>Ajouter une première action</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* SHEET BOTTOM CONTROLS */}
            <div className="editor-sheet-foot">
              <button className="btn-save-mode" disabled={saving} onClick={save}>
                <IconCheck size={16} />
                <span>{saving ? "Sauvegarde…" : "Enregistrer le profil"}</span>
              </button>
              <button className="btn-delete-mode" onClick={remove}>
                <IconTrash size={15} />
                <span>Supprimer ce profil</span>
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function ParamFields({
  type,
  params,
  onChange,
}: {
  type: string;
  params: Record<string, unknown>;
  onChange: (p: Record<string, unknown>) => void;
}) {
  const spec = PARAM_SPECS[type];

  if (!spec) {
    return (
      <textarea
        className="json-spec-editor"
        value={JSON.stringify(params ?? {}, null, 2)}
        onChange={(e) => {
          try {
            onChange(JSON.parse(e.target.value));
          } catch {
            /* ignore draft edits */
          }
        }}
      />
    );
  }

  return (
    <div className="param-fields-grid">
      {spec.map((f) => {
        if (f.key === "percent") {
          const val = Number(params?.[f.key] ?? 50);
          return (
            <div key={f.key} className="slider-control-card">
              <div className="slider-head">
                <span className="slider-label">{f.label}</span>
                <span className="slider-val-bubble">{val}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={val}
                className="range-input"
                onChange={(e) => onChange({ ...params, [f.key]: Number(e.target.value) })}
              />
            </div>
          );
        }

        return (
          <div key={f.key} className="field-group">
            <label>{f.label}</label>
            <input
              type={f.kind === "number" ? "number" : "text"}
              value={(params?.[f.key] as string | number | undefined) ?? ""}
              placeholder={`Définir ${f.label.toLowerCase()}...`}
              onChange={(e) =>
                onChange({
                  ...params,
                  [f.key]: f.kind === "number" ? Number(e.target.value) : e.target.value,
                })
              }
            />
          </div>
        );
      })}
    </div>
  );
}
