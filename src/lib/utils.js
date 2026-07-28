// Minimal stand-in for shadcn's `cn` helper. The real one combines clsx +
// tailwind-merge, but this project isn't on Tailwind — a plain join is all
// that's needed to make components copied from shadcn/Magic UI registries
// work here without pulling in either dependency.
export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}
