## 2024-07-13 - [Memoization in CanvasTab]
**Learning:** Found complex inline filtering and O(N log N) sorting logic nested inside JSX being triggered on every render due to non-memoization of state changes.
**Action:** Extract expensive logic into `useMemo` hooks so they only re-run when their dependency array updates.
## 2024-07-16 - Avoid direct Zustand subscriptions in mapped list components
**Learning:** Directly subscribing to rapidly changing state (like search queries) in individual list item components (e.g., ToolCard) via Zustand `useStore(state => state.field)` causes all list items to re-render on every keystroke, defeating list virtualization or other performance efforts.
**Action:** Always derive rapidly changing state in the parent list component (e.g., CanvasTab) and pass it down as a prop. Combine this with `React.memo` and a custom prop comparator that ignores inline function props to achieve maximum performance and prevent O(N) re-renders.
## 2024-07-14 - Search Debouncing and State Management
**Learning:** Updating a global store state (Zustand) directly on every keystroke causes extensive cascading re-renders across the entire Next.js application, resulting in severe performance lag. Additionally, using `useEffect` to sync external state updates can trigger React linter warnings and further cascading renders.
**Action:** When connecting frequently updating text inputs to a global state store, always implement a local debounced state. To handle external updates (e.g. clicking a tag to search), use the pattern of checking and syncing state directly during render (e.g., `if (searchQuery !== lastGlobalQuery) { setLocalQuery(searchQuery); setLastGlobalQuery(searchQuery); }`) rather than relying on `useEffect`.
## 2025-02-23 - Minimize full object fetching on MCP endpoints
**Learning:** Fetching full objects containing large content fields (like markdown content) into memory for the purpose of a dynamic client-side array search/filter operation is inefficient in terms of network IO and memory usage.
**Action:** When filtering by a dynamic normalizer not supported by the query engine, use a 'minimized fetch and filter' approach: query `findMany({ select: { id: true, filterableField: true } })`, find the ID in memory, and then fetch the full record using `findUnique({ where: { id: foundId } })`.
