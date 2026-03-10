<!--
Sync Impact Report
Version change: 1.0.0 -> 1.1.0
Modified principles:
- None (principles unchanged)
Modified sections:
- Technical Constraints: added ESLint + Prettier mandate for JS/TS/Svelte;
  added cargo clippy + cargo fmt mandate for Rust.
- Development Workflow & Quality Gates: expanded JS/TS and Rust validation lines
  to name specific tools and scripts; added `bun run quality` aggregate gate.
Added sections:
- None
Removed sections:
- None
Templates requiring updates:
- ✅ .specify/templates/plan-template.md (Constitution Check: expanded tooling gate)
- ✅ .specify/templates/tasks-template.md (T013: reference lint/format scripts)
- ✅ .specify/templates/spec-template.md (no change required)
- ✅ .specify/templates/commands/*.md (no files matched; no changes required)
Follow-up TODOs:
- None
-->

# Deepcut Constitution

## Core Principles

### I. Backend-First Processing Boundary
All heavy computation, including video processing, FFmpeg execution, transcoding,
waveform generation, and filesystem-intensive operations, MUST execute in Rust under
`src-tauri/`. The frontend MUST NOT perform heavy media processing or direct filesystem
mutation beyond user interaction primitives exposed by Tauri.
Rationale: This preserves desktop performance, isolates platform-sensitive logic, and
prevents UI stalls caused by JavaScript main-thread saturation.

### II. Typed Tauri Command Contracts
Cross-process communication MUST use strongly typed Tauri `invoke` commands.
Every command payload and response MUST be represented by explicit TypeScript interfaces
in `src/lib/types`. Rust command signatures and TypeScript types MUST evolve together in
the same change set.
Rationale: Typed contracts prevent runtime drift between frontend and backend and make
IPC changes reviewable and testable.

### III. Component and Styling Discipline
UI components MUST prioritize `shadcn-svelte`; missing primitives MUST be added using
`bun x shadcn-svelte@latest add <component>`. Styling MUST use Tailwind utility classes;
raw CSS for component styling is prohibited except for framework-required global files
such as route-level layout scaffolding.
Rationale: A consistent design system and utility-first styling reduce divergence and
simplify maintenance.

### IV. State Ownership and Persistence
Global UI state (including timeline, playback controls, and editor session state) MUST be
implemented with Svelte stores. Backend persistent or shared runtime state MUST use
Tauri `State` management in Rust. State ownership boundaries MUST be documented in the
feature plan before implementation begins.
Rationale: Clear state boundaries reduce synchronization bugs and prevent accidental
coupling across process boundaries.

### V. Rust Safety and Unsafe Policy
Rust ownership and borrowing guarantees are mandatory. `unsafe` blocks are forbidden
unless required for raw video buffer manipulation and MUST include: a short safety
invariant comment, focused tests covering the unsafe boundary, and reviewer sign-off.
Rationale: Memory safety is the primary reliability control for media workloads and
unsafe usage must remain exceptional and auditable.

### VI. FFmpeg Isolation Through Command Layer
All FFmpeg integration MUST live in a dedicated Rust module (for example
`src-tauri/src/ffmpeg/`) and MUST only be accessed through Tauri command handlers.
Frontend code MUST NOT shell out to FFmpeg directly or bypass command abstractions.
Rationale: Isolating FFmpeg concerns enables centralized error handling, security review,
and deterministic testing of media operations.

## Technical Constraints

- JavaScript/TypeScript runtime and package management MUST use Bun exclusively.
- Frontend stack is fixed to SvelteKit (SSG mode), TypeScript, Tailwind CSS,
  `shadcn-svelte`, and `lucide-svelte` unless this constitution is amended.
- Backend stack is fixed to Tauri with Rust 1.75+ and async Rust for non-blocking I/O.
- New backend commands MUST include typed payload definitions in `src/lib/types` and
  command-level validation for user input paths and media parameters.
- JS/TS/Svelte code MUST be linted with ESLint (flat config) via `bun run lint` and
  formatted with Prettier via `bun run format:check`. Both MUST pass before merge.
- Rust code MUST pass `cargo clippy -- -D warnings` via `bun run lint:rust` and
  `cargo fmt --check` via `bun run format:rust:check`. Both MUST pass before merge.

## Development Workflow & Quality Gates

- Plan artifacts MUST include an explicit Constitution Check section mapping feature work
  to each core principle.
- Feature specs MUST define contract impacts for any new or changed Tauri command.
- Task breakdowns MUST include frontend type updates, Rust command work, and tests for
  command contracts and critical media paths.
- JS/TS linting MUST run via `bun run lint` (ESLint) and format checks via
  `bun run format:check` (Prettier) for all `.ts` and `.svelte` changes.
- Rust linting MUST run via `bun run lint:rust` (`cargo clippy -D warnings`) and
  format checks via `bun run format:rust:check` (`cargo fmt --check`) for all `.rs` changes.
- All quality gates can be run together with `bun run quality` (svelte-check + ESLint +
  Prettier check + clippy + cargo fmt check).
- Pull requests MUST fail review when violating process boundaries, type-contract updates,
  FFmpeg isolation requirements, or when `bun run quality` does not pass.

## Governance

This constitution supersedes conflicting local practices and template defaults.

- Amendment process: Changes require a documented proposal, explicit impact assessment on
  `.specify/templates/*`, and approval in code review by project maintainers.
- Versioning policy: Semantic versioning applies to this constitution.
  MAJOR for breaking governance changes or principle removals/redefinitions,
  MINOR for new principles/sections or materially expanded requirements,
  PATCH for clarifications and wording-only improvements.
- Compliance review: Every implementation plan, specification, and task list MUST include
  a constitution compliance check before coding begins and at pull request review.

**Version**: 1.1.0 | **Ratified**: 2026-03-07 | **Last Amended**: 2026-03-09
