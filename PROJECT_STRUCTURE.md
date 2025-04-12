# Up Next App Project Structure (Simplified: Tags)

*(Last Updated: YYYY-MM-DD)* // TODO: Update this date

This document provides an overview of the **simplified** Up Next application structure, explaining the purpose of each file and how components interact. This version **removes sequences** and uses a **tag-based system** for organizing symbols. **Edit mode is triggered by long-pressing the main symbol.**

## Main Application Files

- **App.tsx**: Manages state (`currentSymbol`, `isPopupOpen`, `isEditMode`, `favoriteSymbols`, `activeTag`) and renders UI. Handles edit mode toggling.
- **App.module.css**: Component-specific styles for the App component layout.
- **main.tsx**: Entry point for the React application. Includes standalone mode detection for iOS.
- **index.css**: Global CSS styles including resets, animations, typography defaults, and PWA-specific styles.
- **index.html**: Main HTML file with mobile meta tags, PWA configurations, and the root div (`#root`).
- **manifest.json**: PWA manifest file for home screen installation on mobile devices.
- **data/symbols.ts**: Central data file containing symbol definitions (including `tags: string[]`), and utility functions for symbol/tag management.
- **utils/speech.ts**: Utility for playing pre-generated audio files associated with symbols.
- **components/AppBar.tsx**: Component for the top application bar (displays title only).
- **components/AppBar.module.css**: Styles specific to the `AppBar` component.
- **scripts/resizeSymbols.js**: Script for batch resizing of symbol images from 1024x1024 to 512x512.
- **scripts/resizeSymbolsPng.js**: Script for selectively resizing only 1024x1024 PNG images while preserving originals.
- **scripts/generate_audio.py**: Python script for generating audio files for symbols using `gTTS`.

## Component Structure & Responsibilities

### App.tsx
- **State Managed:**
  - `currentSymbol: string | null`: Filename of the symbol for the currently displayed activity.
  - `isPopupOpen: 'next' | null`: Controls if the symbol selection popup is open.
  - `isEditMode: boolean`: Tracks whether the app is in edit mode or view mode.
  - `favoriteSymbols: string[]`: Array of filenames for favorited symbols, persisted in localStorage.
  - `activeTag: string | 'Favorites' | 'All'>`: Currently selected tag for filtering symbols in the popup.
- **Renders:**
  - `AppBar`: The top application bar (title only).
  - `ActivityCard` (x1): For the `currentSymbol`.
  - `SymbolSelectionPopup`: The popup for choosing the `currentSymbol`, filterable by tags.
- **Responsibilities:**
  - Manages the main application state (`currentSymbol`, `isPopupOpen`, `isEditMode`, `favoriteSymbols`, `activeTag`).
  - Handles user interactions from child components (symbol selection, **edit mode toggle via long press on ActivityCard**).
  - Passes state and callbacks to `AppBar`, `ActivityCard`, `SymbolSelectionPopup`.
  - Initializes a default `currentSymbol`.
  - Persists `favoriteSymbols` to `localStorage`.
  - Filters symbols for `SymbolSelectionPopup` based on `activeTag` using `getDisplaySymbols()`.
  - Preloads audio files for symbols.

### AppBar Component
- **Files:** `components/AppBar.tsx`, `components/AppBar.module.css`
- **Purpose:** Displays the top application bar with the title.
- **Props (Inputs):**
  - `title: string`: The title to display.
- **Responsibilities:**
  - Displays the application title.

### ActivityCard Component
- **Files:** `components/ActivityCard.tsx`, `components/ActivityCard.module.css`
- **Purpose:** Displays the current activity card and handles interactions (short press/long press).
- **Props (Inputs):**
  - `title: string`: Display name of the symbol.
  - `symbolFilename: string | null`: Symbol filename.
  - `onClick?: () => void`: Callback for **short press in edit mode** (opens symbol popup).
  - `isEditMode: boolean`: Current edit mode state.
  - `onEditModeToggle: () => void`: Callback to toggle edit mode in parent (**triggered by long press**).
- **Responsibilities:**
  - Displays symbol image and title.
  - **Detects short vs. long press (touch/mouse):**
    - **Short Press:** Plays audio (view mode) or calls `onClick` prop (edit mode).
    - **Long Press:** Calls `onEditModeToggle` prop.
  - Shows placeholder text if no symbol selected.
  - Provides visual feedback when in edit mode (e.g., dashed border).

### SymbolButton Component
- **Files:** `components/SymbolButton.tsx`, `components/SymbolButton.module.css`
- **Purpose:** A reusable button displaying a single symbol image and name.
- **Props (Inputs):**
  - `symbolName: string`: The filename of the symbol.
  - `onClick: (e: React.MouseEvent) => void`: Callback function triggered when the button is clicked.
  - `isFavorite?: boolean`: Whether this symbol is marked as favorite.
  - `onToggleFavorite?: () => void`: Callback to toggle favorite status.
- **Responsibilities:**
  - Displays a symbol with its properly formatted name using data from `symbols.ts`.
  - Provides favorite toggling functionality with star icon, calling back (`onToggleFavorite`) to `SymbolSelectionPopup` and then `App.tsx` to update state and `localStorage`.
  - Handles click events (calling `onClick` prop passed from `SymbolSelectionPopup`) while preventing event propagation for favorite toggling.
  - Applies special styling for "now" symbols.

### SymbolSelectionPopup Component
- **Files:** `components/SymbolSelectionPopup.tsx`, `components/SymbolSelectionPopup.module.css`
- **Purpose:** A modal popup for selecting the `currentSymbol`, displayed in full screen.
- **Props (Inputs):**
  - `isOpen: boolean`: Controls if the popup is visible.
  - `popupType: 'next' | null`: Determines the title ("Select Symbol").
  - `onClose: () => void`: Callback function to close the popup.
  - `onSelectSymbol: (e: React.MouseEvent, symbolName: string) => void`: Callback function triggered when a `SymbolButton` inside is clicked.
  - `availableSymbols: string[]`: List of symbol filenames to display based on the active tag filter.
  - `tags?: string[]`: Available tags for filtering symbols (includes 'All' and 'Favorites').
  - `activeTag?: string | 'Favorites' | 'All'>`: Currently selected tag.
  - `setActiveTag?: (tag: string | 'Favorites' | 'All') => void`: Callback to change the active tag.
  - `favoriteSymbols?: string[]`: Array of favorite symbol filenames.
  - `toggleFavorite?: (symbolName: string) => void`: Callback to toggle a symbol's favorite status.
- **Responsibilities:**
  - Presents a full-screen modal for symbol selection.
  - Provides fixed (sticky) tag tabs (All, Favorites, other tags) for filtering.
  - Displays a grid of `SymbolButton` components based on the selected tag filter.
  - Handles tag selection, calling back (`setActiveTag`) to `App.tsx`.
  - Handles symbol selection, calling back (`onSelectSymbol`) to `App.tsx`.
  - Handles favorite toggling, calling back (`toggleFavorite`) to `App.tsx`.
  - Features an 'X' close button in the header.
  - Handles closing via backdrop click or close button, calling back (`onClose`) to `App.tsx`.

## Data Management

### Symbols Data Structure
- **File:** `data/symbols.ts`
- **Key Components:**
  - `Symbol` interface: Defines the structure for symbol data (using `tags`).
  - `SYMBOLS` array: Contains all symbol definitions with metadata.
  - Helper functions: `getSymbolByFilename`, `getSymbolById`, `getSymbolsByTag`, `getAllTags`, `getAllFilenames`.
- **Symbol Structure:**
  ```typescript
  interface Symbol {
    id: string;
    filename: string;
    displayName: string;
    tags: string[]; // Array of relevant tags
  }
  ```
- **Tags:** Symbols are organized using flexible string tags (e.g., 'morning', 'food', 'activity', 'hygiene', 'transport', 'person', etc.).
- **Multi-Tag Support:** Symbols can have multiple tags.

## State Flow

1. **Initialization:**
   - `App.tsx` initializes state variables (`currentSymbol`, `isPopupOpen`, etc.).
   - Reads `favoriteSymbols` from `localStorage`.
   - Sets default `currentSymbol`.

2. **User Interaction -> State Change -> UI Update:**
   - **Example: Toggling Edit Mode**
     - User **long presses** `ActivityCard`.
     - `ActivityCard` detects long press and calls `onEditModeToggle` prop.
     - `App.tsx` (`handleEditModeToggle`) updates `isEditMode` state. → `ActivityCard` gets new `isEditMode` prop and updates its visual style.
   - **Example: Changing Current Symbol (Edit Mode)**
     - User **short presses** `ActivityCard` (while `isEditMode` is true).
     - `ActivityCard` detects short press, calls `onClick` prop.
     - `App.tsx` (`openPopup`) sets `isPopupOpen` state to `'next'`. → `SymbolSelectionPopup` visible.
     - User clicks a tag tab (e.g., 'food') in `SymbolSelectionPopup`.
     - `SymbolSelectionPopup` calls `setActiveTag` prop.
     - `App.tsx` updates `activeTag` state. → `SymbolSelectionPopup` filters displayed symbols via `getDisplaySymbols()`.
     - User clicks a `SymbolButton`.
     - `SymbolButton` calls `onClick` prop (`SymbolSelectionPopup`).
     - `SymbolSelectionPopup` calls `onSelectSymbol` prop.
     - `App.tsx` updates `currentSymbol` state and sets `isPopupOpen` to `null`. → `ActivityCard` updates, `SymbolSelectionPopup` hides.
   - **Example: Playing Audio (View Mode)**
     - User **short presses** `ActivityCard` (while `isEditMode` is false).
     - `ActivityCard` detects short press, calls `playAudioForWord`.
     - `speech.ts` plays audio.
   - **Example: Toggling Favorite**
     - User clicks star icon on `SymbolButton`.
     - `SymbolButton` calls `onToggleFavorite` (`SymbolSelectionPopup`).
     - `SymbolSelectionPopup` calls `toggleFavorite` (`App.tsx`).
     - `App.tsx` updates `favoriteSymbols` state and writes to `localStorage`. → Star icon toggles.

4. **Data Flow:**
   - Symbol data flows from `symbols.ts` → `App.tsx` → `SymbolSelectionPopup` → `SymbolButton` / `ActivityCard`.
   - User interactions flow in reverse: `SymbolButton` → `SymbolSelectionPopup` → `App.tsx`, **`ActivityCard` (short/long press) → `App.tsx` or `speech.ts`.**
   - Favorites are stored in `App.tsx` state and persisted to localStorage.
   - Tag filtering happens at the App level (`getDisplaySymbols()`) based on `activeTag`.
   - Audio paths derived from `symbol.displayName`.

5. **Edit Mode Flow:**
   - **Long press** on `ActivityCard` toggles `isEditMode` state in `App.tsx`.
   - Enabled: **Short press** on `ActivityCard` opens symbol selection popup.
   - Disabled: **Short press** on `ActivityCard` plays audio.

## Symbol Management

- **Data Source:** `src/data/symbols.ts`
- **Storage:** Images in `public/symbols/`
- **Organization:** Symbols organized via `tags: string[]` in `symbols.ts`.
- **Favorites:** Users can mark symbols as favorites (stored in localStorage).
- **Multi-Tag:** Symbols can have multiple tags.
- **Adding New Symbols:**
  1. Add image to `public/symbols/`.
  2. Add entry to `SYMBOLS` array in `src/data/symbols.ts`, including relevant `tags`.
  3. Ensure corresponding audio file exists in `public/audio/`.

## UI/UX Features

- **Full Screen Popup:** Symbol selection modal.
- **Fixed Tag Tabs:** Tag tabs remain fixed for filtering.
- **Tag Filtering:** Tab navigation for filtering symbols by tag (All, Favorites, others).
- **Favorites System:** Star icons for quick access.
- **Symbol Grid Layout:** Responsive symbol grid.
- **Edit Mode Toggle:** Triggered via **long press** on the main symbol card.
- **Visual Edit Mode Indicator:** Card style changes (e.g., border) when in edit mode.

## Styling Architecture

- **CSS Modules:**
  - Each component has its own `.module.css` file for component-scoped styling:
    - `App.module.css`: Layout styles for the main App component.
    - `AppBar.module.css`: Styles for the top application bar and its controls.
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
- **Z-Index Management:**
  - AppBar: 10000 (highest)
  - Favorite buttons: 1030
  - Symbol buttons: 1010
  - Popup overlay: 1000
- **Animations:**
  - Card pulse: Gentle 3s ease-in-out scaling
  - Popup fade in: 0.3s ease
  - Popup content scale in: 0.2s ease-out

## Progressive Web App (PWA) Features

- **Installable:** Can be added to home screen on mobile devices
- **Standalone Mode:** Runs in full-screen mode without browser UI
- **Custom Icon:** Uses dream machine.png as app icon
- **Custom Splash Screen:** Configured for iOS devices
- **Safe Area Handling:** Respects device notches and home indicators
- **Theme Color:** Light blue theme (#f0f4ff)
- **Orientation:** Default portrait orientation
- **Touch Optimizations:**
  - Disabled double-tap zoom
  - Removed tap highlight effect
  - Prevented touch callouts on images

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

4. **Add New Symbols:**
   - Place image in `/public/symbols/`
   - For optimal performance, resize 1024x1024 images to 512x512 using the resize-png script:
     ```bash
     npm run resize-png
     ```
   - Add entry in `src/data/symbols.ts`

5. **Generate Audio for Symbols:**
   - Audio files (`.mp3`) are expected in `public/audio/`.
   - Filenames should correspond to the formatted `displayName` of symbols (lowercase, spaces replaced with underscores, punctuation removed except underscore. e.g., "Get Dressed" -> `get_dressed.mp3`).
   - Use the Python script: `python scripts/generate_audio.py` to attempt automatic generation using `gTTS`.
   - Verify generated files and manually create/adjust if needed.
   - Ensure you have the necessary Python dependencies installed (`pip install gTTS`).

## Key Libraries & Services

- **React:** Core UI library.
- **Vite:** Build tool and development server.
- **TypeScript:** Language for static typing.
- **CSS Modules:** For component-scoped styling.
- **localStorage:** Used for persisting `favoriteSymbols`.
- **gTTS (Python library):** Used by the *optional* `scripts/generate_audio.py` script to generate audio files for symbols from text. This is a development utility, not a runtime dependency of the web app itself.
- **Web Audio API (via `<audio>` element):** Used implicitly by `utils/speech.ts` for playback.

## Key Features

1. **Activity Display:** Set and display the current activity symbol.
2. **Symbol Selection:** Choose from symbols, filterable by tags and favorites.
3. **Tag-Based Organization:** Symbols organized using flexible tags.
4. **Responsive Design:** Optimized for desktop/mobile.
5. **PWA:** Installable native-like experience.
6. **Edit Mode Toggle:** Switch between view/edit mode via **long press** on the symbol.
7. **On-Demand Audio:** Plays pronunciation for displayed symbol.

## Future Enhancements

1. **Persistence & Sync:** Cloud sync for favorites/tags?
2. **Accessibility Improvements:** Add screen reader support with ARIA labels
3. **Enhanced Symbol Management:** Custom symbol upload, tag management (create/edit/delete tags), symbol search
4. **User Experience:** Haptic feedback on mobile devices
5. **Timer Integration:** Optional timers for activities
6. **Multi-User Support:** User profiles for different family members
7. **Progress Tracking:** Daily/weekly activity completion stats

These enhancements would expand the app's functionality while maintaining its core simplicity and ease of use. Implementation priority should be based on user feedback and specific needs.