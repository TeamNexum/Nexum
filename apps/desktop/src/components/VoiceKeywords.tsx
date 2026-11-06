import { useState } from "react";

/** Adds a keyword unless it is empty or already there (ignoring case). */
export function addKeyword(keywords: string[], input: string): string[] {
  const word = input.trim();
  if (!word || keywords.some((k) => k.toLowerCase() === word.toLowerCase())) return keywords;
  return [...keywords, word];
}

/** Extra words that launch a mode by voice, on top of its name. */
export default function VoiceKeywords({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  const [input, setInput] = useState("");

  function commit() {
    onChange(addKeyword(value, input));
    setInput("");
  }

  return (
    <div className="form-group">
      <label htmlFor="voice-keywords">Mots-clés vocaux (optionnels)</label>
      <div className="voice-keywords">
        {value.map((k) => (
          <span key={k} className="voice-keyword">
            {k}
            <button type="button" aria-label={`Retirer ${k}`} onClick={() => onChange(value.filter((x) => x !== k))}>×</button>
          </span>
        ))}
        <input
          id="voice-keywords"
          value={input}
          placeholder={value.length ? "Ajouter…" : "Ex : jeu, partie classée — Entrée pour ajouter"}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              commit();
            } else if (e.key === "Backspace" && !input && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={commit}
        />
      </div>
      <small className="muted">Dites « lance le mode » suivi du nom du profil ou de l’un de ces mots.</small>
    </div>
  );
}
