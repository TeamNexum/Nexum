// Node 25+ ships its own `localStorage` global, which is undefined unless Node
// runs with --localstorage-file, and it hides the one jsdom provides. Point the
// global back at jsdom's storage so tests behave the same on every Node version.
declare const jsdom: { window: Window } | undefined;

if (typeof localStorage === "undefined" && typeof jsdom !== "undefined") {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: jsdom.window.localStorage,
  });
}
