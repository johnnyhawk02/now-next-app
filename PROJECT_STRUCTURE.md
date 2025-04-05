# Now-Next App Project Structure

This document provides an overview of the Now-Next application structure, explaining the purpose of each file and how components interact with each other. It is tailored to assist AI in understanding the app's architecture and functionality.

## Main Application Files

- **App.tsx**: The main application component that manages the overall state (`nowSymbol`, `nextSymbol`, `isPopupOpen`, `isEditMode`) and renders the primary UI.
- **App.module.css**: Component-specific styles for the App component, including styles for the Edit Mode toggle switch and layout.
- **main.tsx**: Entry point for the React application. Includes standalone mode detection for iOS.
- **index.css**: Global CSS styles including resets, animations, typography defaults, and PWA-specific styles.
- **index.html**: Main HTML file with mobile meta tags, PWA configurations, and the root div (`#root`).
- **manifest.json**: PWA manifest file for home screen installation on mobile devices.

## Component Structure & Responsibilities

### App.tsx
- **State Managed:**
  - `nowSymbol: string | null`: Filename of the symbol for the "Now" activity.
  - `nextSymbol: string | null`: Filename of the symbol for the "Next" activity.
  - `isPopupOpen: 'now' | 'next' | null`: Controls which symbol selection popup is open.
  - `isEditMode: boolean`: Tracks whether the app is in edit mode or view mode.
- **Renders:**
  - `ActivityCard` (x2): For "Now" and "Next".
  - `SymbolSelectionPopup`: The popup for choosing symbols.
  - Edit Mode toggle switch: A toggle switch in the top-right corner to enable or disable edit mode.
- **Responsibilities:**
  - Manages the main state of the application.
  - Handles user interactions for selecting symbols.
  - Toggles between edit and view modes using the Edit Mode toggle switch.
  - Initializes default symbols if none are selected.

### ActivityCard Component
- **Files:** `components/ActivityCard.tsx`, `components/ActivityCard.module.css`
- **Purpose:** Displays either the "Now" or "Next" activity card.
- **Props (Inputs):**
  - `title: string`: The title of the card ("Now" or "Next").
  - `symbolFilename: string | null`: The filename of the symbol to display.
  - `onClick?: () => void`: Callback function triggered when the card is clicked.
  - `isFocus?: boolean`: If true, applies focus styling (green background, enhanced pulsing shadow via `.focusCard` class).
  - `isEditMode: boolean`: Determines whether the card is clickable (edit mode) or displays symbol text (view mode).
- **Responsibilities:**
  - Displays the symbol and title for the activity.
  - Triggers the parent callback when clicked in edit mode.
  - Displays the symbol text in view mode.

### SymbolButton Component
- **Files:** `components/SymbolButton.tsx`, `components/SymbolButton.module.css`
- **Purpose:** A reusable button displaying a single symbol image and name.
- **Props (Inputs):**
  - `symbolName: string`: The filename of the symbol.
  - `onClick: (e: React.MouseEvent) => void`: Callback function triggered when the button is clicked.
- **Responsibilities:**
  - Displays a symbol with its name.
  - Triggers the parent callback when clicked.

### SymbolSelectionPopup Component
- **Files:** `components/SymbolSelectionPopup.tsx`, `components/SymbolSelectionPopup.module.css`
- **Purpose:** A modal popup for selecting symbols.
- **Props (Inputs):**
  - `isOpen: boolean`: Controls if the popup is visible.
  - `popupType: 'now' | 'next' | null`: Determines the title and behavior of the popup.
  - `onClose: () => void`: Callback function to close the popup.
  - `onSelectSymbol: (e: React.MouseEvent, symbolName: string) => void`: Callback function triggered when a `SymbolButton` inside is clicked.
  - `availableSymbols: string[]`: List of symbol filenames to display.
- **Responsibilities:**
  - Displays a grid of symbols for selection.
  - Triggers the parent callback when a symbol is selected.

## State Flow

1. **Initialization:**
   - `App.tsx` initializes `nowSymbol` and `nextSymbol` with default values from `AVAILABLE_SYMBOLS` if they are not already set.

2. **User Interaction:**
   - Clicking on the "Now" or "Next" card opens the `SymbolSelectionPopup` in edit mode.
   - Selecting a symbol in the popup updates the corresponding state (`nowSymbol` or `nextSymbol`).

3. **Reactivity:**
   - Changes to `nowSymbol` or `nextSymbol` automatically update the corresponding `ActivityCard`.

4. **Edit Mode Toggle:**
   - The Edit Mode toggle switch enables or disables edit mode.
   - In edit mode, cards are clickable and open the symbol selection popup.
   - In view mode, cards display the symbol text instead of being clickable.

## Symbol Management

- **Directory:** All symbols are stored in `public/symbols/`.
- **Usage:**
  - Symbols are dynamically loaded into the app via the `AVAILABLE_SYMBOLS` array in `App.tsx`.
  - Each symbol is represented by its filename (e.g., `bath.png`, `pyjamas.png`).
- **Adding New Symbols:**
  - Place the new symbol image in the `public/symbols/` directory.
  - Update the `AVAILABLE_SYMBOLS` array in `App.tsx` to include the new symbol.

## Styling Architecture

- **CSS Modules:**
  - Each component has its own `.module.css` file for component-scoped styling:
    - `App.module.css`: Layout and edit mode toggle styles
    - `ActivityCard.module.css`: Card styling and animations
    - `SymbolButton.module.css`: Button and image styles
    - `SymbolSelectionPopup.module.css`: Popup and grid layout styles
  - CSS Modules ensure styles are scoped to their components and prevent conflicts
- **Global Styles:**
  - `index.css` contains only:
    - Global resets and defaults
    - Base typography styles
    - Shared animations (fadeIn, scaleIn)
    - PWA-specific styles
    - iOS safe area handling
- **Mobile Optimization:**
  - Touch-friendly button sizes
  - iOS-specific fixes for tap highlights and scrolling
  - Safe area inset padding for notched devices
  - Standalone mode optimizations for PWA

## Development Workflow

1. **Run the Development Server:**
   ```bash
   npm run dev
   ```

2. **Build for Production:**
   ```bash
   npm run build
   ```

3. **Lint the Code:**
   ```bash
   npm run lint
   ```

## Key Features

1. **Activity Management:**
   - Set "Now" and "Next" activities using symbols.
2. **Symbol Selection:**
   - Choose from a variety of symbols to represent tasks.
3. **Responsive Design:**
   - Optimized for both desktop and mobile devices.
4. **Progressive Web App (PWA):**
   - Installable on mobile devices for a native-like experience.
5. **Edit Mode Toggle:**
   - Easily switch between edit and view modes using the toggle switch.

## Future Enhancements

1. **Activity Sequences:**
   - Allow creation of activity sequences/schedules
   - Save and load different sequences
   - Add drag-and-drop reordering of sequence items
   - Visual timeline view of sequences

2. **Persistence & Sync:**
   - Add local storage to remember selected activities
   - Optional cloud sync for sharing schedules
   - Export/import functionality for sequences
   - Multi-device synchronization

3. **Accessibility Improvements:**
   - Add screen reader support with ARIA labels
   - High contrast mode option
   - Support for keyboard navigation
   - Customizable animation settings

4. **Enhanced Symbol Management:**
   - Categories for symbols (e.g., morning routine, evening routine)
   - Custom symbol upload feature
   - Symbol search and filtering
   - Favorites or frequently used symbols

5. **User Experience:**
   - Haptic feedback on mobile devices
   - Sound effects or voice prompts (optional)
   - Dark mode theme
   - Customizable card sizes and layouts

6. **Timer Integration:**
   - Optional timers for activities
   - Visual countdown for current activity
   - Customizable alerts/reminders
   - Activity duration tracking

7. **Multi-User Support:**
   - User profiles for different family members
   - Role-based access (parent/child views)
   - Shared schedules between users
   - Activity completion tracking

8. **Progress Tracking:**
   - Daily/weekly activity completion stats
   - Reward system for completing activities
   - Visual progress indicators
   - Exportable activity reports

These enhancements would expand the app's functionality while maintaining its core simplicity and ease of use. Implementation priority should be based on user feedback and specific needs.