import { useEffect, useState } from "react";
import { onVoiceEvent, type VoiceEvent } from "../api";

/** What the overlay shows for a voice event, or null to hide it. */
export function voiceMessage(e: VoiceEvent): { level: "live" | "ok" | "warn" | "fail"; text: string } | null {
  switch (e.state) {
    case "listening":
      return { level: "live", text: "Je vous écoute…" };
    case "transcribing":
      return { level: "live", text: "Transcription…" };
    case "done":
      if (e.mode) return { level: "ok", text: `« ${e.transcript} » → ${e.mode}` };
      if (e.candidates.length > 1)
        return {
          level: "warn",
          text: `Plusieurs profils correspondent : ${[...new Set(e.candidates)].join(", ")}. Ajoutez un mot-clé vocal à celui que vous voulez.`,
        };
      return { level: "warn", text: `Aucun profil reconnu dans « ${e.transcript || "…"} »` };
    case "error":
      return { level: "fail", text: e.message };
    case "download":
      return null; // shown in Settings, not as an overlay
  }
}

/**
 * Floating "listening…" pill for push-to-talk. It follows the backend's
 * voice events, so it works for the global shortcut even when the command
 * was started outside the window.
 */
export default function VoiceOverlay() {
  const [message, setMessage] = useState<ReturnType<typeof voiceMessage>>(null);

  useEffect(() => {
    let unlisten: (() => void) | undefined;
    onVoiceEvent((e) => {
      if (e.state !== "download") setMessage(voiceMessage(e));
    }).then((fn) => (unlisten = fn));
    return () => unlisten?.();
  }, []);

  useEffect(() => {
    if (!message || message.level === "live") return;
    const t = setTimeout(() => setMessage(null), message.level === "ok" ? 3200 : 6000);
    return () => clearTimeout(t);
  }, [message]);

  if (!message) return null;
  return (
    <div role={message.level === "fail" ? "alert" : "status"} className={`voice-overlay ${message.level}`}>
      <span className="voice-dot" aria-hidden="true" />
      <span>{message.text}</span>
    </div>
  );
}
