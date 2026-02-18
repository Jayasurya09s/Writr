# ARCHITECTURE.md — Smart Blog Editor

## Overview

A production-ready, Notion-style block editor built with React, Lexical, Zustand, and Tailwind CSS.

---

## File Structure

```
src/
├── components/
│   ├── BlogEditor.tsx        # Lexical editor wrapper + LoadContentPlugin
│   ├── EditorToolbar.tsx     # Formatting toolbar (Bold, Italic, H1-H3, Lists)
│   ├── DraftsSidebar.tsx     # Posts list with search, publish/delete controls
│   ├── AIPanel.tsx           # Streaming AI output panel (Summary / Grammar)
│   ├── SaveStatusIndicator.tsx # Visual save state (Saving / Saved / Error)
│   └── ui/                   # shadcn/ui primitives
├── hooks/
│   ├── useDebounce.ts        # Custom debounce hook (no library dependency)
│   ├── useAutoSave.ts        # API save orchestrator with status management
│   └── useAI.ts              # AI streaming hook (mock → swap for real API)
├── store/
│   └── blogStore.ts          # Zustand store: posts, activePost, AI panel, saveStatus
├── pages/
│   └── Index.tsx             # Main layout: sidebar + editor + header
└── index.css                 # Design system (all tokens, editor styles, animations)
```

---

## Why These Choices?

### Lexical (Editor Framework)
- Meta's production-grade framework used in Facebook, Instagram
- Serializes editor state as JSON → safe storage and rehydration without data loss
- Plugin architecture keeps toolbar and content concerns separated
- `OnChangePlugin` provides a clean reactive stream of editor state changes

### Zustand (State Management)
- Minimal boilerplate vs Redux, no Context Provider wrapping
- Single store manages: posts array, activePostId, saveStatus, AI panel state
- `getActivePost()` selector keeps derived state clean
- `localStorage` persistence built in — survives page refreshes

### Auto-Save: Custom Debounce Algorithm
```
User types → onChange fires → debouncedSave(2000ms)
                                     ↓ (reset timer each keystroke)
             2 seconds of silence → performSave() → PATCH /api/posts/{id}
```
- Implemented as a `useRef`-based timer (no external library)
- Flushes pending save on unmount to prevent data loss
- Status transitions: `idle → saving → saved → idle` (auto-reset after 3s)

### Database Schema Design

```sql
posts (
  id          TEXT PRIMARY KEY,  -- UUID
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,     -- Lexical JSON state (full fidelity rehydration)
  content_text TEXT,             -- Extracted plain text (AI / word count)
  status      TEXT DEFAULT 'draft',  -- 'draft' | 'published'
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
)
```

**Why store Lexical JSON, not HTML?**
- HTML → Lexical is lossy and error-prone
- JSON → Lexical is lossless; `editor.parseEditorState(json)` restores exact state
- Plain text (`content_text`) stored separately for fast search and AI features

### AI Integration
- Hook-based `useAI.ts` abstracts streaming logic
- Replace mock `streamTokens()` with real SSE from `POST /api/ai/generate`
- Token-by-token `appendAIResult()` updates Zustand → React re-renders each chunk
- Cursor blink animation via CSS `::after` pseudo-element

---

## API Contract (Backend Ready)

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | /api/posts/ | `{ title, content, status }` | `{ id, ...post }` |
| PATCH | /api/posts/{id} | `{ title?, content?, contentText? }` | `{ ...post }` |
| POST | /api/posts/{id}/publish | — | `{ status: 'published' }` |
| POST | /api/ai/generate | `{ content, mode }` | SSE stream of tokens |

---

## Design System

All colors defined as HSL CSS variables in `index.css`. Zero hardcoded colors in components.
Serif (Lora) for editorial content, Sans (Inter) for UI chrome. Amber accent (`--accent`) for AI features.
