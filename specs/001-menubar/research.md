# Research: Menubar Foundation

**Branch**: `001-menubar` | **Date**: 2026-03-09

## Resolution Summary

No `[NEEDS CLARIFICATION]` markers were present in the spec. All design decisions are
unambiguous. This document records the decisions made and the rationale for each.

---

## Decision 1: shadcn-svelte Menubar installation

**Decision**: Install via `bun x shadcn-svelte@latest add menubar`

**Rationale**: This is the standard shadcn-svelte CLI command. It generates the Menubar
primitives (root, trigger, content, item, separator, etc.) into
`src/lib/components/ui/menubar/` per the aliases in `components.json`. The project's
`components.json` is already configured with `baseColor: neutral` and the correct
Tailwind CSS path, so the generated code will be compatible with the existing setup.

**Alternatives considered**:
- Importing from a pre-built package (none available; shadcn-svelte generates source code, not a runtime package)
- Using a different menu library — rejected because Constitution Principle III mandates shadcn-svelte

---

## Decision 2: Composition pattern — AppMenubar wrapper component

**Decision**: Create `src/lib/components/app-menubar/AppMenubar.svelte` as a thin wrapper
over the shadcn-svelte primitives. The root layout imports only `AppMenubar`; it does
not interact with Menubar primitives directly.

**Rationale**: The spec requires (FR-008) that future features extend menus without
modifying `+layout.svelte`. Keeping all menu composition inside `AppMenubar` satisfies
this. The layout stays stable; only `menu-definition.ts` changes as new menus are added.

**Alternatives considered**:
- Inline the Menubar directly in `+layout.svelte` — rejected because it violates FR-008 and makes the layout harder to read as menus grow
- A dynamic slot/event-based extension mechanism — over-engineered for the current scope; a typed definition array is sufficient

---

## Decision 3: Menu definition structure

**Decision**: Export a typed `MENU_DEFINITION` constant from
`src/lib/components/app-menubar/menu-definition.ts`. Type shape:

```ts
type MenuItemDefinition = {
  label: string;
  disabled?: boolean;
  action?: () => void;
};

type MenuGroupDefinition = {
  label: string;
  items: MenuItemDefinition[];
};
```

Initial content: one group `"File"` with one placeholder item `"(No actions yet)"` marked `disabled: true`.

**Rationale**: A typed definition array gives future features a clear contract for
adding menu entries without needing to understand Svelte component internals. It also
makes the initial placeholder easy to locate and replace.

**Alternatives considered**:
- Svelte context / event-based menu registration — unnecessary complexity for what is
  currently a static menu; can be introduced later if dynamic registration is needed
- Separate `.svelte` file for each menu group — premature; a single definition array is
  easier to read and extend at this scale

---

## Decision 4: Placement in layout

**Decision**: `AppMenubar` is placed at the top of `+layout.svelte`, above the
`{@render children()}` slot.

**Rationale**: This makes the menubar render before any page-level content, which is
the standard desktop application pattern. It also ensures it is unaffected by page-level
scroll containers.

**Alternatives considered**:
- Placing it inside a flex column wrapper — unnecessary extra DOM layer for this feature;
  can be introduced when the page shell is designed

---

## Decision 5: No data model needed

**Decision**: No `data-model.md` entities. This feature has no persistent data, no
Tauri commands, and no state beyond a static module-level constant.

**Rationale**: The menu definition is compile-time static. There is nothing to model.

---

## Constitution Re-check Post-Research

All five constitution principles remain satisfied. No new violations were introduced
during research. The plan is clear to proceed to Phase 1.
