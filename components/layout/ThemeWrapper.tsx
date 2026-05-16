"use client";

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function buildThemeVars(couleur: string): React.CSSProperties {
  const { h, s, l } = hexToHsl(couleur);
  const sat = Math.min(s, 80);
  return {
    "--primary": `${h} ${s}% ${l}%`,
    "--primary-foreground": "210 20% 98%",
    "--ring": `${h} ${s}% ${l}%`,
    "--sidebar": `${h} ${sat}% 18%`,
    "--sidebar-primary": `${h} ${s}% ${l}%`,
    "--sidebar-primary-foreground": "210 20% 98%",
    "--sidebar-accent": `${h} ${Math.min(sat, 65)}% 26%`,
    "--sidebar-accent-foreground": "210 20% 98%",
    "--sidebar-border": `${h} ${Math.min(sat, 60)}% 13%`,
    "--sidebar-ring": `${h} ${s}% ${l}%`,
  } as React.CSSProperties;
}

export function ThemeWrapper({
  couleur,
  children,
}: {
  couleur: string;
  children: React.ReactNode;
}) {
  const vars = buildThemeVars(couleur);
  return (
    <div style={vars} className="flex h-screen overflow-hidden bg-background">
      {children}
    </div>
  );
}
