## 2024-07-13 - Search Bar Clear Button
**Learning:** Added a clear search ('X') button to the main search bar, a common and expected UX pattern that was missing. It's crucial to ensure icon-only buttons receive an `aria-label` for screen reader accessibility, which was included in this update.
**Action:** Always include a way to easily clear form inputs, especially search bars, and remember to add `aria-label` to any icon-only interactive elements.
## 2024-10-24 - Motion Div Keyboard Accessibility
**Learning:** Found that `motion.div` components used as interactive cards (with `onClick`) were completely missing keyboard accessibility. They couldn't be focused via Tab or activated via Enter/Space.
**Action:** When using `motion.div` or any generic `div` as a clickable card, always add `role="button"`, `tabIndex={0}`, an `onKeyDown` handler for Enter/Space keys, and focus-visible styles to ensure full keyboard navigation support.
