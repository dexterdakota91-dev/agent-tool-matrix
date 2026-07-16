## 2024-07-13 - [Memoization in CanvasTab]
**Learning:** Found complex inline filtering and O(N log N) sorting logic nested inside JSX being triggered on every render due to non-memoization of state changes.
**Action:** Extract expensive logic into `useMemo` hooks so they only re-run when their dependency array updates.
## 2024-07-16 - Avoid direct Zustand subscriptions in mapped list components
**Learning:** Directly subscribing to rapidly changing state (like search queries) in individual list item components (e.g., ToolCard) via Zustand `useStore(state => state.field)` causes all list items to re-render on every keystroke, defeating list virtualization or other performance efforts.
**Action:** Always derive rapidly changing state in the parent list component (e.g., CanvasTab) and pass it down as a prop. Combine this with `React.memo` and a custom prop comparator that ignores inline function props to achieve maximum performance and prevent O(N) re-renders.
