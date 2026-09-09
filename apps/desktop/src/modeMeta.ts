// Presentation metadata for modes and actions: icons, human labels, and
// plain-language descriptions. Keeps the components declarative and consistent.
// This is UI-only sugar — the source of truth for the model stays in Rust.

import type { ComponentType, CSSProperties } from "react";
import type { ActionStep, Category, Mode } from "./types";
import {
  IconGaming,
  IconWork,
  IconChill,
  IconStreaming,
  IconNight,
  IconSparkles,
  IconAudio,
  IconDisplay,
  IconApp,
  IconCloseApp,
  IconLink,
  IconSteam,
  IconHue,
  IconRgb,
  IconSliders,
} from "./components/Icons";

type Params = Record<string, any>;

/** Inline style helper to set the `--cat` CSS custom property (category accent). */
export function catStyle(color: string): CSSProperties {
  return { "--cat": color } as unknown as CSSProperties;
}

export interface CategoryInfo {
  label: string;
  color: string;
  icon: string; // text fallback for option tags
  Icon: ComponentType<{ size?: number; className?: string }>;
}

export const CATEGORY_META: Record<Category, CategoryInfo> = {
  gaming: { label: "Gaming", color: "#F038A0", icon: "Gaming", Icon: IconGaming },
  work: { label: "Travail", color: "#22D3EE", icon: "Travail", Icon: IconWork },
  chill: { label: "Détente", color: "#7C5CFF", icon: "Détente", Icon: IconChill },
  streaming: { label: "Stream", color: "#F0436E", icon: "Stream", Icon: IconStreaming },
  night: { label: "Nuit", color: "#4F628E", icon: "Nuit", Icon: IconNight },
  custom: { label: "Personnalisé", color: "#8A93A3", icon: "Perso", Icon: IconSparkles },
};

export function categoryMeta(cat: string): CategoryInfo {
  return CATEGORY_META[cat as Category] ?? CATEGORY_META.custom;
}

export interface ActionInfo {
  label: string;
  domain: string;
  icon: string; // text fallback
  Icon: ComponentType<{ size?: number; className?: string }>;
  describe: (p: Params) => string;
}

export const ACTION_META: Record<string, ActionInfo> = {
  "audio.set_volume": {
    label: "Régler le volume",
    domain: "Audio",
    icon: "Audio",
    Icon: IconAudio,
    describe: (p) => `Volume fixé à ${p.percent ?? "?"}%`,
  },
  "display.set_brightness": {
    label: "Régler la luminosité",
    domain: "Écran",
    icon: "Écran",
    Icon: IconDisplay,
    describe: (p) => `Luminosité fixée à ${p.percent ?? "?"}%`,
  },
  "system.launch_app": {
    label: "Lancer une application",
    domain: "Système",
    icon: "App",
    Icon: IconApp,
    describe: (p) => `Lancer ${p.path ?? "l'application"}`,
  },
  "system.close_app": {
    label: "Fermer une application",
    domain: "Système",
    icon: "Stop",
    Icon: IconCloseApp,
    describe: (p) => `Fermer ${p.name ?? "l'application"}`,
  },
  "system.open_url": {
    label: "Ouvrir un lien",
    domain: "Système",
    icon: "Web",
    Icon: IconLink,
    describe: (p) => `Ouvrir ${p.url ?? "un lien web"}`,
  },
  "gaming.launch_steam": {
    label: "Lancer un jeu Steam",
    domain: "Jeux",
    icon: "Steam",
    Icon: IconSteam,
    describe: (p) => (p.app_id ? `Lancer Steam (App ID: ${p.app_id})` : "Lancer un jeu Steam"),
  },
  "gaming.launch_epic": {
    label: "Lancer un jeu Epic",
    domain: "Jeux",
    icon: "Epic",
    Icon: IconGaming,
    describe: (p) => (p.name ? `Lancer Epic : ${p.name}` : "Lancer un jeu Epic"),
  },
  "gaming.launch_gog": {
    label: "Lancer un jeu GOG",
    domain: "Jeux",
    icon: "GOG",
    Icon: IconGaming,
    describe: (p) => (p.game_id ? `Lancer GOG (${p.game_id})` : "Lancer un jeu GOG"),
  },
  "iot.hue.activate_scene": {
    label: "Ambiance Philips Hue",
    domain: "Éclairage",
    icon: "Hue",
    Icon: IconHue,
    describe: (p) => `Hue : Scène « ${p.scene ?? "?"} »`,
  },
  "peripheral.apply_rgb_profile": {
    label: "Profil RGB périphériques",
    domain: "Périphériques",
    icon: "RGB",
    Icon: IconRgb,
    describe: (p) => `Profil RGB : ${p.profile ?? "?"}`,
  },
};

export function actionMeta(type: string): ActionInfo {
  return (
    ACTION_META[type] ?? {
      label: type,
      domain: "Autre",
      icon: "Action",
      Icon: IconSliders,
      describe: () => type,
    }
  );
}

export function describeStep(step: ActionStep): string {
  return actionMeta(step.type).describe((step.params ?? {}) as Params);
}

// ---- Starter templates & marketplace catalog ------------------------------

export interface CatalogMode {
  name: string;
  tagline: string;
  description: string;
  category: Category;
  steps: ActionStep[];
  author?: string;
}

function step(order: number, type: string, params: Params): ActionStep {
  return { order, type, params, enabled: true, on_error: "continue" };
}

/** Turn a catalog entry into a persistable Mode (drops UI-only fields). */
export function toMode(c: CatalogMode, id: string): Mode {
  return { id, name: c.name, description: c.description, category: c.category, steps: c.steps };
}

export const STARTER_TEMPLATES: CatalogMode[] = [
  {
    name: "Gaming Extreme",
    tagline: "Performance & Immersion",
    description: "Volume à 80%, luminosité max, éclairage Purple Night et Steam lancé.",
    category: "gaming",
    steps: [
      step(1, "audio.set_volume", { percent: 80 }),
      step(2, "display.set_brightness", { percent: 100 }),
      step(3, "iot.hue.activate_scene", { scene: "Purple Night" }),
      step(4, "peripheral.apply_rgb_profile", { profile: "Neon Wave" }),
      step(5, "gaming.launch_steam", { app_id: "1030300" }),
    ],
  },
  {
    name: "Focus & Code",
    tagline: "Concentration sans friction",
    description: "Volume discret 20%, éclairage blanc neutre, environnement de travail ouvert.",
    category: "work",
    steps: [
      step(1, "audio.set_volume", { percent: 20 }),
      step(2, "display.set_brightness", { percent: 70 }),
      step(3, "iot.hue.activate_scene", { scene: "Focus White" }),
      step(4, "system.open_url", { url: "https://github.com" }),
    ],
  },
  {
    name: "Détente Acoustique",
    tagline: "Ambiance feutrée",
    description: "Musique douce, luminosité tamisée, scène Sunset Glow.",
    category: "chill",
    steps: [
      step(1, "audio.set_volume", { percent: 35 }),
      step(2, "display.set_brightness", { percent: 40 }),
      step(3, "iot.hue.activate_scene", { scene: "Sunset Glow" }),
      step(4, "system.open_url", { url: "https://open.spotify.com" }),
    ],
  },
  {
    name: "Studio Streamer",
    tagline: "Prêt pour le direct",
    description: "Lancement d'OBS, éclairage Studio et volume de retour calibré.",
    category: "streaming",
    steps: [
      step(1, "audio.set_volume", { percent: 60 }),
      step(2, "display.set_brightness", { percent: 90 }),
      step(3, "iot.hue.activate_scene", { scene: "Studio Stream" }),
      step(4, "system.launch_app", { path: "obs64" }),
    ],
  },
];

export const MARKETPLACE_CATALOG: CatalogMode[] = [
  ...STARTER_TEMPLATES,
  {
    name: "Late Night Sim",
    tagline: "Session nocturne",
    description: "Écran sombre 15%, volume au casque, éclairage ambre.",
    category: "night",
    author: "@simracer_fr",
    steps: [
      step(1, "audio.set_volume", { percent: 30 }),
      step(2, "display.set_brightness", { percent: 15 }),
      step(3, "iot.hue.activate_scene", { scene: "Deep Amber" }),
    ],
  },
  {
    name: "Silence Total",
    tagline: "Zéro distraction",
    description: "Fermeture des réseaux et baisse du son.",
    category: "work",
    author: "@minimalist",
    steps: [
      step(1, "audio.set_volume", { percent: 0 }),
      step(2, "system.close_app", { name: "discord" }),
      step(3, "system.close_app", { name: "slack" }),
    ],
  },
];
