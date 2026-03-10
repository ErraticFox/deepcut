# Implementation Plan: Menubar Foundation

**Branch**: `001-menubar` | **Date**: 2026-03-09 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/001-menubar/spec.md`

## Summary

Add a persistent, application-wide menubar using the `shadcn-svelte` Menubar component. The menubar lives in the root SvelteKit layout so it is present on every route. It provides a single "File" menu group as a placeholder foundation; future features extend the menu definition without touching the layout file.

## Technical Context

**Language/Version**: TypeScript 5.6 / Svelte 5 / SvelteKit 2  
**Primary Dependencies**: shadcn-svelte (Menubar), Tailwind CSS 4, mode-watcher (theme)  
**Storage**: N/A — no persistence required for this feature  
**Testing**: Svelte component testing via `bun run check` (svelte-check); manual smoke test in Tauri dev window  
**Target Platform**: Tauri 2 desktop app (Windows primary)  
**Project Type**: Desktop app (Tauri + SvelteKit SSG)  
**Performance Goals**: Zero perceptible layout shift on mount; menubar renders in the first paint  
**Constraints**: Must not introduce raw CSS component styling; Tailwind utility classes only  
**Scale/Scope**: Single component, single layout file change, one menu definition module

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Heavy computation and filesystem-intensive operations are assigned to Rust (`src-tauri/`), not frontend Svelte code.
  — *This feature has no backend work. N/A.*
- [x] Every new/changed Tauri command has a typed TS contract planned under `src/lib/types`.
  — *No Tauri commands introduced. N/A.*
- [x] UI work uses `shadcn-svelte` components and Tailwind utility classes; any exception is explicitly justified.
  — *Menubar component installed via `bun x shadcn-svelte@latest add menubar`. No raw CSS for component styling.*
- [x] State ownership is declared: Svelte stores for global UI state, Tauri `State` for backend-managed persistence/runtime state.
  — *No persistent state. Menu definition is a static module-level constant. N/A.*
- [x] FFmpeg work is isolated to a dedicated Rust module and exposed only via Tauri command handlers.
  — *No FFmpeg work. N/A.*
- [x] Tooling commands for JS/TS use Bun.
  — *Component install: `bun x shadcn-svelte@latest add menubar`. Dev: `bun run dev`.*

**Result: All gates pass. No violations.**

## Project Structure

### Documentation (this feature)

```text
specs/001-menubar/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (N/A — no entities)
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A — no Tauri commands)
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code

```text
src/
├── lib/
│   ├── components/
│   │   ├── ui/
│   │   │   └── menubar/          # shadcn-svelte generated Menubar primitives
│   │   │       ├── index.ts
│   │   │       └── menubar.svelte (and related sub-components)
│   │   └── app-menubar/
│   │       ├── AppMenubar.svelte  # Composed application menubar component
│   │       └── menu-definition.ts # Typed menu structure definition
│   └── utils.ts
└── routes/
    ├── +layout.svelte             # MODIFIED: add <AppMenubar />
    ├── +layout.ts
    ├── +page.svelte
    └── layout.css
```

**Structure Decision**: Single SvelteKit project. The `shadcn-svelte` primitives land in `src/lib/components/ui/menubar/` (standard shadcn-svelte convention). A thin `AppMenubar` wrapper in `src/lib/components/app-menubar/` composes the primitives and owns the menu definition, keeping the root layout clean. The menu definition is a typed array in `menu-definition.ts` so future features extend it without touching `+layout.svelte`.