# Up Next App Project Structure (Simplified: Tags + Direct Interaction)

*(Last Updated: 2024-03-21)*

This document provides an overview of the **ultra-simplified** Up Next application structure. This version **removes sequences and edit mode**, uses a **tag-based system** for symbols, and features direct interaction:
- **Short Press** on symbol: Plays audio.
- **Long Press** on symbol: Opens symbol selection popup.

## Main Application Files

- **App.tsx**: Manages state (`currentSymbol`, `isPopupOpen`, `favoriteSymbols`, `activeTag`) and renders UI. Handles opening the symbol popup and audio preloading.
- **App.module.css**: Component-specific styles for the App component layout.
- **main.tsx**: Entry point for the React application. Includes standalone mode detection for iOS.
- **index.css**: Global CSS styles including resets, animations, typography defaults, and PWA-specific styles.
- **index.html**: Main HTML file with mobile meta tags, PWA configurations, and the root div (`#root`).
- **manifest.json**: PWA manifest file for home screen installation on mobile devices.
- **data/symbols.ts**: Central data file containing symbol definitions (including `tags: string[]`), and utility functions for symbol/tag management.
- **utils/speech.ts**: Utility for playing pre-generated audio files associated with symbols.
- **components/AppBar.tsx**: Component for the top application bar (displays title only).
- **components/AppBar.module.css**: Styles specific to the `AppBar` component.
- **components/LongPressIndicator.tsx**: NEW - Visual feedback component for long press interactions.
- **components/LongPressIndicator.module.css**: NEW - Styles for long press indicator.
- **scripts/resizeSymbols.js**: Script for batch resizing of symbol images from 1024x1024 to 512x512.
- **scripts/resizeSymbolsPng.js**: Script for selectively resizing only 1024x1024 PNG images while preserving originals.
- **scripts/generate_audio.py**: Python script for generating audio files for symbols using `gTTS`.

## Configuration Files

- **eslint.config.js**: ESLint configuration with TypeScript and React Hooks support.
- **tsconfig.json**: Base TypeScript configuration.
- **tsconfig.app.json**: Application-specific TypeScript settings.
- **tsconfig.node.json**: Node-specific TypeScript settings.
- **vite.config.ts**: Vite build tool configuration.
- **postcss.config.cjs**: PostCSS configuration (currently empty).
- **tailwind.config.js**: Tailwind CSS configuration (currently empty).

## Component Structure & Responsibilities

### App.tsx
- **State Managed:**
  - `currentSymbol: string | null`: Filename of the symbol.
  - `isPopupOpen: 'next' | null`: Controls symbol selection popup visibility.
  - `favoriteSymbols: string[]`: Favorited symbols (localStorage).
  - `activeTag: string | 'Favorites' | 'All'`: Selected tag filter.
- **Renders:**
  - `AppBar`: Title bar.
  - `ActivityCard`: Displays current symbol, handles press interactions.
  - `SymbolSelectionPopup`: Popup for choosing symbol, filterable by tags.
- **Responsibilities:**
  - Manages core application state.
  - Handles opening the symbol popup (`handleChangeSymbol`) triggered by `ActivityCard`.
  - Handles symbol selection from `SymbolSelectionPopup`.
  - Passes state/callbacks to child components.
  - Initializes default symbol.
  - Persists/loads `favoriteSymbols` to/from `localStorage`.
  - Filters symbols for popup based on `activeTag`.
  - Preloads audio files on startup.

### AppBar Component
- **Files:** `components/AppBar.tsx`, `components/AppBar.module.css`
- **Purpose:** Displays the application title.
- **Props:** `title: string`.
- **Responsibilities:** Displays title.

### ActivityCard Component
- **Files:** `components/ActivityCard.tsx`, `components/ActivityCard.module.css`
- **Purpose:** Displays current symbol, handles short/long press.
- **Props (Inputs):**
  - `title: string`: Symbol display name.
  - `symbolFilename: string | null`: Symbol filename.
  - `onChangeSymbol: () => void`: Callback to open symbol popup (**triggered by long press**).
  - `onRemove?: () => void`: NEW - Optional callback to remove the card.
- **Responsibilities:**
  - Displays symbol image and title.
  - **Detects short vs. long press (touch/mouse):**
    - **Short Press:** Plays audio via `utils/speech.ts`.
    - **Long Press:** Calls `onChangeSymbol` prop.
  - Shows placeholder text.
  - NEW - Handles optional removal functionality.

### LongPressIndicator Component
- **Files:** `components/LongPressIndicator.tsx`, `components/LongPressIndicator.module.css`
- **Purpose:** Provides visual feedback during long press interactions.
- **Props:**
  - `isPressing: boolean`: Whether a long press is in progress.
- **Responsibilities:**
  - Displays visual feedback during long press.
  - Animates progress towards long press threshold.

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
  - Provides favorite toggling functionality with star icon.
  - Handles click events while preventing event propagation for favorite toggling.
  - Provides keyboard accessibility for favorite toggling.
  - Displays formatted symbol names with proper spacing.

### SymbolSelectionPopup Component
- **Files:** `components/SymbolSelectionPopup.tsx`, `components/SymbolSelectionPopup.module.css`
- **Purpose:** Modal popup for selecting `currentSymbol`.
- **Props (Inputs):**
  - `isOpen: boolean`: Controls if the popup is visible.
  - `popupType: 'next' | null`: Determines the title ("Select Symbol").
  - `onClose: () => void`: Callback function to close the popup.
  - `onSelectSymbol: (e: React.MouseEvent, symbolName: string) => void`: Callback function triggered when a `SymbolButton` inside is clicked.
  - `availableSymbols: string[]`: List of symbol filenames to display based on the active tag filter.
  - `tags?: string[]`: Available tags for filtering symbols (includes 'All' and 'Favorites').
  - `activeTag?: string | 'Favorites' | 'All'`: Currently selected tag.
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
  - Handles closing via backdrop click or close button.

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
   - `App.tsx` initializes state (`currentSymbol`, `isPopupOpen`, etc.).
   - Reads `favoriteSymbols` from `localStorage`.
   - Sets default `currentSymbol`.
   - Preloads audio files for all symbols.

2. **User Interaction -> State Change -> UI Update:**
   - **Example: Changing Symbol**
     - User **long presses** `ActivityCard`.
     - `ActivityCard` detects long press, calls `onChangeSymbol` prop.
     - `App.tsx` (`handleChangeSymbol`) sets `isPopupOpen` state to `'next'`. → `SymbolSelectionPopup` visible.
     - User clicks a tag tab (e.g., 'food').
     - `SymbolSelectionPopup` calls `setActiveTag` prop.
     - `App.tsx` updates `activeTag` state. → `SymbolSelectionPopup` filters symbols.
     - User clicks a `SymbolButton`.
     - `SymbolButton` calls `onClick` (`SymbolSelectionPopup`).
     - `SymbolSelectionPopup` calls `onSelectSymbol` prop.
     - `App.tsx` updates `currentSymbol` state and sets `isPopupOpen` to `null`. → `ActivityCard` updates, `SymbolSelectionPopup` hides.
   - **Example: Playing Audio**
     - User **short presses** `ActivityCard`.
     - `ActivityCard` detects short press, calls `playAudioForWord` from `utils/speech.ts`.
     - `speech.ts` plays audio.
   - **Example: Toggling Favorite**
     - User clicks star icon on `SymbolButton`.
     - `SymbolButton` calls `onToggleFavorite` (`SymbolSelectionPopup`).
     - `SymbolSelectionPopup` calls `toggleFavorite` (`App.tsx`).
     - `App.tsx` updates `favoriteSymbols` state and writes to `localStorage`. → Star icon toggles.

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
   - Filenames should correspond to the formatted `displayName` of symbols (lowercase, spaces replaced with underscores).
   - Use the Python script: `python scripts/generate_audio.py` to attempt automatic generation using `gTTS`.
   - Verify generated files and manually create/adjust if needed.
   - Ensure you have the necessary Python dependencies installed (`pip install gTTS`).

## Key Libraries & Services

- **React:** Core UI library.
- **Vite:** Build tool and development server.
- **TypeScript:** Language for static typing.
- **ESLint:** Code linting with TypeScript and React Hooks support.
- **CSS Modules:** For component-scoped styling.
- **localStorage:** Used for persisting `favoriteSymbols`.
- **gTTS (Python library):** Used by the *optional* `scripts/generate_audio.py` script.
- **Web Audio API:** Used implicitly by `utils/speech.ts` for playback.

## Key Features

1. **Activity Display:** Shows current activity symbol.
2. **Symbol Selection:** Long press symbol to open popup; filter by tags/favorites.
3. **Tag-Based Organization:** Flexible symbol tagging.
4. **Audio Playback:** Short press symbol to hear pronunciation.
5. **Responsive Design & PWA:** Optimized for desktop/mobile.
6. **Long Press Feedback:** Visual indicator for long press interactions.
7. **Keyboard Accessibility:** Support for keyboard navigation and interactions.

## Future Enhancements

1. **Persistence & Sync:** Cloud sync for favorites/tags.
2. **Enhanced Symbol Management:** Custom symbol upload, tag management.
3. **User Experience:** Haptic feedback on mobile devices.
4. **Timer Integration:** Optional timers for activities.
5. **Multi-User Support:** User profiles for different family members.
6. **Progress Tracking:** Daily/weekly activity completion stats.
7. **Tailwind Integration:** Complete Tailwind CSS setup for consistent styling.

These enhancements would expand the app's functionality while maintaining its core simplicity and ease of use. Implementation priority should be based on user feedback and specific needs.