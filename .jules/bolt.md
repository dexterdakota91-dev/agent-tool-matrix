## 2024-07-13 - [Memoization in CanvasTab]
**Learning:** Found complex inline filtering and O(N log N) sorting logic nested inside JSX being triggered on every render due to non-memoization of state changes.
**Action:** Extract expensive logic into `useMemo` hooks so they only re-run when their dependency array updates.
