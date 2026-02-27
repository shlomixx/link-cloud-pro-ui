let cseLoadPromise: Promise<void> | null = null;

function getExistingScript(scriptId: string) {
  return document.getElementById(scriptId) as HTMLScriptElement | null;
}

function isCseLoaded() {
  const w = window as any;
  return Boolean(w?.google?.search?.cse?.element);
}

export async function loadCse(cx: string): Promise<void> {
  if (!cx) {
    throw new Error("Missing Google CSE ID (cx). Set VITE_GOOGLE_CSE_ID in your env.");
  }

  if (typeof window === "undefined") return;
  if (isCseLoaded()) return;

  if (cseLoadPromise) return cseLoadPromise;

  cseLoadPromise = new Promise<void>((resolve, reject) => {
    const scriptId = "google-cse";
    const existing = getExistingScript(scriptId);
    if (existing) {
      // Script tag exists (maybe still loading)
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load Google CSE script")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.defer = true;
    script.src = `https://cse.google.com/cse.js?cx=${encodeURIComponent(cx)}`;
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener(
      "error",
      () => reject(new Error("Failed to load Google CSE script")),
      { once: true }
    );

    document.head.appendChild(script);
  });

  return cseLoadPromise;
}

