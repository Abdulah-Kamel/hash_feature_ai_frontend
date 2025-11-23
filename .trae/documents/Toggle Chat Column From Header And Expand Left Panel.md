## Goal
- Add a state in the chat page to open/close the chat column from the ChatHeader.
- When closed, hide the chat column and expand the left panel to full width.

## Changes In Chat Page
- Add `chatOpen` state and handlers:
  - In `src/app/dashboard/chat/page.js`:lines 9–12, create `const [chatOpen, setChatOpen] = React.useState(true)`.
  - Pass to header: `\<ChatHeader chatOpen={chatOpen} onToggle={() => setChatOpen(v => !v)} />` at `src/app/dashboard/chat/page.js:67`.
- Grid layout adjustments:
  - Wrap the chat column in a conditional: render it only when `chatOpen === true` (`src/app/dashboard/chat/page.js:69-74`).
  - Expand left panel col-span when chat is closed:
    - `className={chatOpen ? "xl:col-span-2" : "xl:col-span-4"}` at `src/app/dashboard/chat/page.js:75-77`.
  - Keep container `xl:grid-cols-4` so full-width is achieved by `col-span-4`.

## Changes In ChatHeader
- Update `src/components/chat/ChatHeader.jsx` to accept props:
  - `function ChatHeader({ chatOpen, onToggle }) { ... }`.
- Add a toggle control in the right-side actions:
  - A ghost button that toggles open/close:
    - Label: `chatOpen ? "إخفاء الشات" : "فتح الشات"`.
    - Optional icon (e.g., `ArrowLeft` or `ChevronLeft`) to match current icon set.
  - Call `onToggle()` on click.

## Visual Behavior
- When chat is open: two columns (chat 2 cols + left panel 2 cols).
- When chat is closed: only left panel, spanning all 4 columns; header remains visible.
- No layout shift in header; no borders from the hidden chat column.

## Notes
- No changes needed to `LeftPanel.jsx`; it already uses `h-full`.
- This plan does not modify data flow for messages; only layout and header toggle.

## Confirmation
- After approval, I will implement these edits, verify the UI in the preview, and ensure the toggle behaves responsively across breakpoints.