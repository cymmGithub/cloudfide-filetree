<p align="center">
  <a href="https://cloudfide.com/">
    <img src="docs/cloudfide-logo.svg" alt="Cloudfide" width="140" />
  </a>
</p>

<h1 align="center">cloudfide-filetree</h1>

<p align="center">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img alt="styled-components" src="https://img.shields.io/badge/styled--components-DB7093?style=flat-square&logo=styled-components&logoColor=white" />
  <img alt="Zod" src="https://img.shields.io/badge/Zod-3E67B1?style=flat-square" />
  <img alt="nuqs" src="https://img.shields.io/badge/nuqs-1f1f1f?style=flat-square" />
  <img alt="CodeMirror" src="https://img.shields.io/badge/CodeMirror-D30707?style=flat-square" />
</p>

<p align="center">
  <a href="https://cloudfide-filetree.vercel.app/"><b>LIVE DEMO</b></a>
</p>

<p align="center">
  <img src="docs/filetree-app.gif" alt="filetree inspector — demo" />
</p>

## Decyzje architektoniczne

- **`nuqs` zamiast ręcznego `useSearchParams` + `useDebounce` + 2× `useEffect`**. Zastępuje synchronizację URL ↔ state łamiącą `react-hooks/set-state-in-effect` i powodującą race condition przy nawigacji po kliknięciu w wynik. `throttleMs: 200` (nie debounce) — URL aktualizuje się w trakcie pisania, nie dopiero po pauzie.
- **Stack wydajnościowy wyszukiwania: flat-index + `useDeferredValue` + truncate(200) + throttled URL-write**. Cztery techniki nie wymagające dodatkowych dep's. Świadomie **bez wirtualizacji** — komponent `<TreeNode>` pozostaje prosty i rekurencyjny.
- **Dwa parsery JSON**. `JSON.parse` w `parseInput` (per-keystroke, fail-fast, ~30% szybszy na MB-input); `jsonc-parser` w lincie CodeMirrora (debounced, error-recovery dla nawigacji po wszystkich błędach).
- **CodeMirror**. mam nadzieję, że nieprzekombinowanie :), ale podszedłem do tematu na zasadzie jeśli to ma być "dev tool" to dodam to co sam uważałbym za przydatne.

## Co zostałoby zrobione przy większej ilości czasu

- **Wirtualizacja drzewa i listy wyników** (`react-virtuoso`) dla drzew > ~100 k węzłów — truncate(200) i liniowy filtr mogą przestać wystarczać.
- **Fuzzy search `?fuzzy=1` toggle**. `nuqs` już otwiera drogę: `useQueryState('fuzzy', parseAsBoolean)` plus przełączenie strategii dopasowania w `searchIndex`.
- **Pełniejsze pokrycie testowe na styku komponent ↔ URL** (interakcje z `nuqs`, deep-linki, back-button) — obecnie skupione na pojedynczych komponentach.
- **Historia** załadowanych wcześniej plików.

## Znane ograniczenia

- **Pamięć: O(N) duplikat drzewa.** Flat-index alokuje wpis + `segments: string[]` per descendant. Budowany eagerly przy load drzewa, nawet jeśli użytkownik nigdy nie otworzy wyszukiwania.
- **Wyszukiwanie liniowe O(N) na keystroke.** słabo skaluję się przy dużych plikach/wielu zagnieżdzeniach (100k+).
- **Truncate 200 ukrywa dopasowania.** Cięcie w kolejności DFS, nie po relevance. Banner mówi "first N of M", ale nie informuje, *które* trafienia odpadły.
- **Dwa parsery JSON teoretycznie mogą się rozjechać.** W praktyce oba implementują ten sam JSON-spec; brak znanych rozbieżności.
- **Drift typów `tree.ts` ↔ `schema.ts` asymetryczny.** Dodanie pola tylko do `tree.ts` zostanie złapane przez TS przy `parseInput`; dodanie tylko do `schema.ts` przejdzie niezauważone.
