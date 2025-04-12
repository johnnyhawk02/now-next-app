# Next Up App Project Structure

*(Last Updated: 2024-08-02)*

This document provides an overview of the Next Up application structure, explaining the purpose of each file and how components interact with each other. It is tailored to assist AI in understanding the app's architecture and functionality.

## Main Application Files

- **App.tsx**: The main application component that manages the overall state (`currentSymbol`, `isPopupOpen`, `isEditMode`, sequences, etc.) and renders the primary UI.
- **App.module.css**: Component-specific styles for the App component layout.
- **main.tsx**: Entry point for the React application. Includes standalone mode detection for iOS.
- **index.css**: Global CSS styles including resets, animations, typography defaults, and PWA-specific styles.
- **index.html**: Main HTML file with mobile meta tags, PWA configurations, and the root div (`#root`).
- **manifest.json**: PWA manifest file for home screen installation on mobile devices.
- **data/symbols.ts**: Central data file containing all symbol definitions, categories, and utility functions for symbol management.
- **data/sequences.ts**: Data file containing the Sequence interface definition, predefined sequences, and helper functions for sequence management.
- **utils/speech.ts**: Utility for playing pre-generated audio files associated with symbols.
- **components/AppBar.tsx**: Component for the top application bar, including title and edit mode toggle.
- **components/AppBar.module.css**: Styles specific to the `AppBar` component.
- **scripts/resizeSymbols.js**: Script for batch resizing of symbol images from 1024x1024 to 512x512.
- **scripts/resizeSymbolsPng.js**: Script for selectively resizing only 1024x1024 PNG images while preserving originals.
- **scripts/generate_audio.py**: Python script for generating audio files for symbols using the `gTTS` (Google Text-to-Speech) Python library. It processes symbols based on their `displayName` and saves MP3 audio files in the `public/audio` directory. (Note: Not currently integrated as an npm script).

## Component Structure & Responsibilities

### App.tsx
- **State Managed:**
  - `currentSymbol: string | null`: Filename of the symbol for the currently displayed activity.
  - `isPopupOpen: 'next' | null`: Controls if the symbol selection popup is open (only 'next' type is used).
  - `isEditMode: boolean`: Tracks whether the app is in edit mode or view mode.
  - `favoriteSymbols: string[]`: Array of filenames for favorited symbols, persisted in localStorage.
  - `activeCategory: string | 'Favorites'`: Currently selected category in the symbol selection popup.
  - `userSequences: Sequence[]`: Array of user-created sequences, persisted in localStorage.
  - `selectedSequenceId: string | null`: ID of the currently selected sequence.
  - `currentStepIndex: number`: Current position in the selected sequence.
  - `userCreatedSequences: boolean[]`: Tracks which sequences are user-created vs. default.
  - `isSequenceEditorOpen: boolean`: Controls visibility of the sequence editor modal.
  - `sequenceToEdit: Sequence | undefined`: Holds the sequence currently being edited.
- **Renders:**
  - `AppBar`: The top application bar containing controls.
  - `ActivityCard` (x1): For the `currentSymbol`.
  - `SymbolSelectionPopup`: The popup for choosing the `currentSymbol`.
  - `SequenceBar`: For managing and navigating activity sequences.
  - `SequenceEditor`: For creating and editing sequences.
- **Responsibilities:**
  - Manages the main state of the application (`currentSymbol`, `isPopupOpen`, `isEditMode`, sequences, etc.).
  - Handles user interactions originating from child components to update state (e.g., receiving symbol selection from `SymbolSelectionPopup`, edit toggle from `AppBar`, sequence actions from `SequenceBar` / `SequenceEditor`).
  - Passes state and callbacks down to child components (`AppBar`, `ActivityCard`, `SymbolSelectionPopup`, `SequenceBar`, `SequenceEditor`).
  - Initializes a default `currentSymbol` if none is selected and no sequence is active.
  - Persists `favoriteSymbols` and user-created `sequences` (`userSequences` state) to `localStorage`.
  - Filters and provides symbols to `SymbolSelectionPopup` based on selected category using `getDisplaySymbols()`.
  - Manages sequence selection, step navigation (updating `currentSymbol` based on the *next* step, `currentStepIndex`), creation, editing, and deletion. Appends a 'finished' symbol automatically when saving sequences.
  - Preloads audio files for all symbols on initial mount using `fetch`.

### AppBar Component
- **Files:** `components/AppBar.tsx`, `components/AppBar.module.css`
- **Purpose:** Displays the top application bar with the title and primary controls.
- **Props (Inputs):**
  - `title: string`: The title to display in the app bar.
  - `onEditModeToggle: () => void`: Callback to toggle edit mode.
  - `isEditMode: boolean`: Current state of edit mode.
- **Responsibilities:**
  - Displays the application title.
  - Renders toggle switch for Edit Mode.
  - Calls back to `App.tsx` (`onEditModeToggle`) when toggle is changed, triggering a state update in `App.tsx`.

### ActivityCard Component
- **Files:** `components/ActivityCard.tsx`, `components/ActivityCard.module.css`
- **Purpose:** Displays the current activity card based on `currentSymbol`.
- **Props (Inputs):**
  - `title: string`: The display name of the current symbol, or a placeholder.
  - `symbolFilename: string | null`: The filename of the symbol to display.
  - `onClick?: () => void`: Callback function triggered when the card is clicked in edit mode.
  - `isEditMode: boolean`: Determines whether the card is clickable (edit mode) or plays audio (view mode).
  - `onRemove?: () => void`: Optional callback for handling removal (e.g., in sequence editor). Displays an 'X' button in edit mode if provided (except for 'finished.png').
- **Responsibilities:**
  - Displays the symbol image and title for the current activity.
  - Triggers the parent (`App.tsx`) callback (`onClick`) when clicked in edit mode, initiating the symbol selection process via `SymbolSelectionPopup`.
  - Triggers audio playback for the displayed symbol using `utils/speech.ts` when clicked in view mode.
  - Shows placeholder text when no symbol is selected.
  - Optionally displays a remove button in edit mode.

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
  - `popupType: 'next' | null`: Determines the title ("Select Symbol") and behavior. Only 'next' is used by App.tsx.
  - `onClose: () => void`: Callback function to close the popup.
  - `onSelectSymbol: (e: React.MouseEvent, symbolName: string) => void`: Callback function triggered when a `SymbolButton` inside is clicked.
  - `availableSymbols: string[]`: List of symbol filenames to display.
  - `categories?: string[]`: Available categories for filtering symbols.
  - `activeCategory?: string | 'Favorites'`: Currently selected category.
  - `setActiveCategory?: (category: string | 'Favorites') => void`: Callback to change the category.
  - `favoriteSymbols?: string[]`: Array of favorite symbol filenames.
  - `toggleFavorite?: (symbolName: string) => void`: Callback to toggle a symbol's favorite status.
  - `sequenceLength?: number`: Number of symbols in the sequence (when used in sequence mode).
- **Responsibilities:**
  - Presents a full-screen modal for symbol selection.
  - Provides fixed (sticky) category tabs that remain visible when scrolling through symbols.
  - Displays a grid of `SymbolButton` components.
  - Handles category selection, calling back (`setActiveCategory`) to `App.tsx` to update the active category state.
  - Handles symbol selection, calling back (`onSelectSymbol`) to `App.tsx` to update `currentSymbol` state.
  - Handles favorite toggling, calling back (`toggleFavorite`) to `App.tsx`.
  - Features an 'X' close button in the header instead of a bottom close button.
  - Handles closing via backdrop click or close button, calling back (`onClose`) to `App.tsx` to update `isPopupOpen` state.
  - Supports sequence creation mode with count indicator.

### SequenceBar Component
- **Files:** `components/SequenceBar.tsx`, `components/SequenceBar.module.css`
- **Purpose:** Displays and manages activity sequences with navigation controls.
- **Props (Inputs):**
  - `sequences: Sequence[]`: Array of available sequences.
  - `selectedSequenceId: string | null`: The ID of the currently selected sequence.
  - `currentStepIndex: number`: The index of the current step in the selected sequence.
  - `onSelectSequence: (sequenceId: string) => void`: Callback when a sequence is selected.
  - `onPrevStep: () => void`: Callback to navigate to the previous step.
  - `onNextStep: () => void`: Callback to navigate to the next step.
  - `onCreateSequence: () => void`: Callback to create a new sequence.
  - `onEditSequence: (sequence: Sequence) => void`: Callback to edit a sequence.
  - `onDeleteSequence: (sequenceId: string) => void`: Callback to delete a sequence.
  - `userCreatedSequences: boolean[]`: Array indicating which sequences are user-created.
  - `isEditMode: boolean`: Whether the app is in edit mode.
- **Responsibilities:**
  - Provides navigation controls (Prev/Next buttons) which call back (`onPrevStep`, `onNextStep`) to `App.tsx` to update `currentStepIndex`.
  - Displays dropdown for selecting sequences, calling back (`onSelectSequence`) to `App.tsx` to update `selectedSequenceId`.
  - Shows step indicator (e.g., "3/8") for the current sequence.
  - Manages sequence CRUD operations via buttons, calling back (`onCreateSequence`, `onEditSequence`, `onDeleteSequence`) to `App.tsx` to open the editor or modify sequence state and `localStorage`.
  - Displays a visual preview of all steps in the current sequence.
  - Can be expanded or collapsed to save screen space.

### SequenceEditor Component
- **Files:** `components/SequenceEditor.tsx`, `components/SequenceEditor.module.css`
- **Purpose:** Modal editor for creating and editing activity sequences.
- **Props (Inputs):**
  - `isOpen: boolean`: Controls if the editor is visible.
  - `onClose: () => void`: Callback to close the editor.
  - `onSaveSequence: (sequence: Sequence) => void`: Callback to save the sequence.
  - `initialSequence?: Sequence`: Optional existing sequence for editing.
  - `allSequences: Sequence[]`: All existing sequences (to avoid ID conflicts).
- **Responsibilities:**
  - Provides form for naming sequences.
  - Allows adding, removing, and reordering symbols in a sequence.
  - Offers "Quick Add" for commonly used symbols.
  - Integrates with `SymbolSelectionPopup` (invoked by `App.tsx`) for more symbol options.
  - Handles validation and error messaging.
  - Generates unique IDs for new sequences.
  - Calls back (`onSaveSequence`) to `App.tsx` upon saving to update sequence state and `localStorage`.
  - Calls back (`onClose`) to `App.tsx` to close the editor modal.

### utils/speech.ts
- **File:** `src/utils/speech.ts`
- **Purpose:** Provides functionality to play pre-generated audio files.
- **Key Functions:**
  - `playAudioForWord(word: string)`: Takes a word (expected to match the base filename in `public/audio/`, like 'get_dressed'), constructs the path (`/audio/get_dressed.mp3`), creates an `Audio` element, and plays it. Handles basic input processing (path extraction, extension removal) and fallback to lowercase if the initial attempt fails.
- **Responsibilities:**
  - Encapsulates the logic for finding and playing `.mp3` files from the `/public/audio/` directory based on symbol names.
  - Provides a simple Promise-based interface for audio playback.
  - Called by `ActivityCard` in view mode.

## Data Management

### Symbols Data Structure
- **File:** `data/symbols.ts`
- **Key Components:**
  - `Symbol` interface: Defines the structure for symbol data.
  - `CATEGORIES` object: Contains all available symbol categories.
  - `SYMBOLS` array: Contains all symbol definitions with metadata.
  - Helper functions: Utilities for retrieving and filtering symbols.
- **Symbol Structure:**
  ```typescript
  interface Symbol {
    id: string;           // Unique identifier
    filename: string;     // Filename in /public/symbols/ directory
    displayName: string;  // Human-friendly name for display
    categories: string[]; // Categories this symbol belongs to (can be multiple)
  }
  ```
- **Categories:** Morning Routine, Mealtime, Bedtime, Activities
- **Multi-Category Support:** Symbols can belong to multiple categories (e.g., "toilet" appears in all categories)

### Sequences Data Structure
- **File:** `data/sequences.ts`
- **Key Components:**
  - `Sequence` interface: Defines the structure for sequence data.
  - `SEQUENCES` array: Contains predefined sequence definitions.
  - Helper functions: Utilities for retrieving sequences.
- **Sequence Structure:**
  ```typescript
  interface Sequence {
    id: string;           // Unique identifier
    name: string;         // Display name for the sequence
    description?: string; // Optional description
    symbolIds: string[];  // Array of symbol IDs from symbols.ts
  }
  ```
- **Predefined Sequences:** Bedtime Routine, Morning Routine, Mealtime Routine
- **User-Created Sequences:** Can be created, edited, and deleted through the UI

## State Flow

1. **Initialization:**
   - `App.tsx` initializes state variables.
   - Reads `favoriteSymbols` and user-created `sequences` from `localStorage`.
   - Loads default sequences from `sequences.ts`.

2. **User Interaction -> State Change -> UI Update:**
   - **Example: Changing Current Symbol (Edit Mode)**
     - User clicks `ActivityCard`.
     - `ActivityCard` calls `onClick` prop (passed from `App.tsx`).
     - `App.tsx` sets `isPopupOpen` state to `'next'`. → `SymbolSelectionPopup` becomes visible.
     - User clicks a category tab in `SymbolSelectionPopup`.
     - `SymbolSelectionPopup` calls `setActiveCategory` prop.
     - `App.tsx` updates `activeCategory` state. → `SymbolSelectionPopup` filters displayed symbols.
     - User clicks a `SymbolButton` in `SymbolSelectionPopup`.
     - `SymbolButton` calls `onClick` prop (passed from `SymbolSelectionPopup`).
     - `SymbolSelectionPopup` calls `onSelectSymbol` prop.
     - `App.tsx` updates `currentSymbol` state and sets `isPopupOpen` to `null`. → `ActivityCard` updates its display, `SymbolSelectionPopup` hides.
   - **Example: Playing Audio (View Mode)**
     - User clicks `ActivityCard`.
     - `ActivityCard` calls `playAudioForWord` from `utils/speech.ts` with the symbol's name.
     - `speech.ts` finds and plays the corresponding `/public/audio/*.mp3` file.
   - **Example: Toggling Favorite**
     - User clicks star icon on `SymbolButton` (inside `SymbolSelectionPopup`).
     - `SymbolButton` calls `onToggleFavorite` prop.
     - `SymbolSelectionPopup` calls `toggleFavorite` prop.
     - `App.tsx` updates `favoriteSymbols` state and writes to `localStorage`. → Star icon toggles state on `SymbolButton`.
   - **Example: Selecting a Sequence**
     - User selects sequence from dropdown in `SequenceBar`.
     - `SequenceBar` calls `onSelectSequence` prop.
     - `App.tsx` updates `selectedSequenceId`, resets `currentStepIndex` to -1, and updates `currentSymbol` based on the symbol at index 0 of the selected sequence. → `SequenceBar` updates display, `ActivityCard` updates.
   - Similar flows exist for toggling edit mode (`AppBar` -> `App.tsx`), navigating steps (`SequenceBar` -> `App.tsx` -> updates `currentSymbol`), and saving sequences (`SequenceEditor` -> `App.tsx`).

3. **Sequence Management:**
   - Creating a new sequence opens the SequenceEditor modal.
   - Editing an existing user-created sequence populates the editor with sequence data.
   - Saving a sequence updates the `userSequences` array in `App.tsx` state and persists to localStorage. Automatically appends a 'finished' symbol ID.
   - Deleting a sequence removes it from the `userSequences` array and localStorage.
   - Sequences are categorized as default or user-created in the dropdown.

4. **Data Flow:**
   - Symbol data flows from `symbols.ts` → `App.tsx` → `SymbolSelectionPopup` → `SymbolButton` / `ActivityCard`
   - Sequence data flows from `sequences.ts` / `localStorage` → `App.tsx` → `SequenceBar` → `SequenceEditor`
   - User interactions flow in reverse: `SymbolButton` → `SymbolSelectionPopup` → `App.tsx`, `ActivityCard` → `App.tsx` (edit) or `speech.ts` (view), `SequenceBar`/`Editor` -> `App.tsx`.
   - Favorites are stored in `App.tsx` state and persisted to localStorage
   - Category filtering happens at the App level with `getDisplaySymbols()` function
   - Sequence navigation updates `currentStepIndex`, which determines the `currentSymbol` (based on the *next* step).
   - Audio file paths are derived from `symbol.displayName` in `App.tsx` (for preloading) and `ActivityCard.tsx` (for playback via `speech.ts`).

5. **Edit Mode Flow:**
   - Edit mode toggle in the `AppBar` toggles app interaction mode.
   - When enabled, the `ActivityCard` becomes clickable to change the `currentSymbol`, and sequence controls are accessible.
   - When disabled, the `ActivityCard` plays audio when clicked, and sequence bar may collapse/hide controls.

## Symbol Management

- **Data Source:** Symbols are defined in `src/data/symbols.ts`
- **Storage:** Symbol images are stored in `public/symbols/`
- **Categories:** Symbols are organized into categories (Morning Routine, Mealtime, Bedtime, Activities)
- **Favorites:** Users can mark symbols as favorites which are stored in localStorage
- **Multi-Category:** Symbols can belong to multiple categories, appearing in each relevant filter
- **Adding New Symbols:**
  1. Add the image file to `public/symbols/` directory
  2. Add a new entry to the `SYMBOLS` array in `src/data/symbols.ts`
  3. Assign it to one or more categories

## Sequence Management

- **Data Source:** Predefined sequences in `src/data/sequences.ts`
- **Storage:** User-created sequences are stored in localStorage
- **Creation Process:**
  1. Click "New" button in the sequence bar
  2. Enter a sequence name in the editor
  3. Add symbols via quick add or symbol selection popup
  4. Reorder symbols using up/down arrows
  5. Save the sequence (a 'finished' symbol is automatically appended)
- **Navigation:**
  1. Select a sequence from the dropdown
  2. Use prev/next buttons to move through steps
  3. The `currentSymbol` displayed on the `ActivityCard` updates to reflect the symbol associated with the *next* step index (`currentStepIndex + 1`).
  4. Visual indicators show progress through the sequence (e.g., "3/8") based on `currentStepIndex`.
- **Editing/Deleting:**
  - Only user-created sequences can be edited or deleted
  - Default sequences are read-only

## UI/UX Features

- **Full Screen Popup:** Symbol selection appears as a full-screen modal
- **Fixed Category Tabs:** Category tabs remain fixed at the top when scrolling through symbols
- **Category Filtering:** Tab navigation for filtering symbols by category
- **Favorites System:** Star icons to mark frequently used symbols
- **Symbol Grid Layout:** Symbols display in a responsive grid with consistent square proportions
- **Now Card Animation:** Subtle pulsing effect (scale: 1.02) to highlight current activity
- **Edit Mode Toggle:** Always visible toggle in the `AppBar` for switching modes
- **Safe Area Support:** All UI elements respect device notches and home indicators
- **Sequence Navigation:** Prev/next buttons and dropdown for selecting and navigating sequences
- **Sequence Bar:** Collapsible interface that can be minimized when not in use
- **Sequence Editor:** Modal interface for creating and managing sequences
- **Mobile Optimization:**
  - Touch-friendly tap targets (minimum 44px)
  - iOS-specific fixes for tap highlights and scrolling
  - Standalone mode for home screen installation
  - Proper handling of safe areas on notched devices

## Styling Architecture

- **CSS Modules:**
  - Each component has its own `.module.css` file for component-scoped styling:
    - `App.module.css`: Layout styles for the main App component.
    - `AppBar.module.css`: Styles for the top application bar and its controls.
    - `ActivityCard.module.css`: Card styling and animations
    - `SymbolButton.module.css`: Button and image styles
    - `SymbolSelectionPopup.module.css`: Popup and grid layout styles
    - `SequenceBar.module.css`: Sequence navigation and control styles
    - `SequenceEditor.module.css`: Sequence editing modal styles
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
- **localStorage:** Browser API used for persisting user's favorite symbols and custom sequences locally on their device.
- **gTTS (Python library):** Used by the *optional* `scripts/generate_audio.py` script to generate audio files for symbols from text. This is a development utility, not a runtime dependency of the web app itself.
- **Web Audio API (via `<audio>` element):** Used implicitly by `utils/speech.ts` for playback.

## Key Features

1. **Activity Display:**
   - Set and display the current activity using a symbol (`currentSymbol`).
2. **Symbol Selection:**
   - Choose from a variety of symbols to represent tasks.
   - Filter symbols by categories (Morning Routine, Mealtime, Bedtime, Activities)
   - Mark symbols as favorites for quick access
3. **Responsive Design:**
   - Optimized for both desktop and mobile devices.
4. **Progressive Web App (PWA):**
   - Installable on mobile devices for a native-like experience.
5. **Edit Mode Toggle:**
   - Easily switch between edit and view modes using the toggle switch in the `AppBar`.
6. **Activity Sequences:**
   - Choose from predefined sequences like Bedtime Routine and Morning Routine.
   - Create, edit, and delete custom sequences.
   - Navigate through sequence steps with prev/next controls, updating the displayed `currentSymbol`.
   - Visual step indicators to track progress through a sequence.
7. **On-Demand Audio:**
   - Plays audio pronunciation for the displayed symbol when its card is clicked (in view mode).
   - Uses pre-generated MP3 files from `public/audio/` for consistent audio quality.
   - Audio files are preloaded for potentially faster playback.

## Future Enhancements

1. **Activity Sequences - Advanced Features:**
   - Add drag-and-drop reordering of sequence items
   - Add batch import/export functionality for sequences
   - Support for branching sequences with conditional paths
   - Add visual timeline view for longer sequences

2. **Persistence & Sync:**
   - Optional cloud sync for sharing schedules across devices
   - Multi-device synchronization
   - User accounts for accessing sequences from anywhere

3. **Accessibility Improvements:**
   - Add screen reader support with ARIA labels
   - High contrast mode option
   - Support for keyboard navigation
   - Customizable animation settings

4. **Enhanced Symbol Management:**
   - Custom symbol upload feature
   - Symbol search and filtering
   - Advanced category management
   - Support for custom categories

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