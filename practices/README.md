# Practices

This repo is a personal memory bank for software patterns I like.

It is not a framework, starter kit, or catalogue of universal best practices. It is a place to keep small working examples and notes so I can come back later and remember how I solved something, why I liked the shape, and what I might reuse.

The contents should change over time. If a pattern stops fitting how I build software, it should be updated or removed.

## How I Use It

- Keep examples small enough to read.
- Prefer working code over abstract notes.
- Write down why a pattern feels useful.
- Update patterns when my taste changes.
- Avoid turning examples into reusable libraries too early.

## Current Examples

### `todos-frontend`

A React and Vite todo UI used to remember frontend patterns around:

- feature-first folders under `src/features`
- shared API, config, and utility helpers under `src/shared`
- React Query hooks for server state
- TanStack Table for table state
- Gridify query construction
- local UI state such as debounced search

Run it from `todos-frontend`:

```sh
npm ci
npm run dev
```

Useful checks:

```sh
npm run lint
npm run build
```

## Adding A Pattern

When adding something new, leave enough context for future me:

1. What problem was this pattern solving?
2. What tradeoff made it worth keeping?
3. What files show the pattern most clearly?
4. What would make me stop using it?

A good entry can be a small app, a focused folder, or a short Markdown note. It does not need to be polished. It does need to be easy to understand later.

## Biases I Want To Preserve

- Make runtime boundaries obvious.
- Keep feature code close to the feature.
- Keep shared code genuinely shared.
- Prefer explicit code when it teaches the pattern better.
- Write examples that can still be run.
