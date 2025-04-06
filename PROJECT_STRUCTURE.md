# Now-Next App Project Structure

This document provides an overview of the Now-Next application structure, explaining the purpose of each file and how components interact with each other. It is tailored to assist AI in understanding the app's architecture and functionality.

## Main Application Files

- **App.tsx**: The main application component that manages the overall state (`nowSymbol`, `nextSymbol`, `isPopupOpen`, `isEditMode`, `autoAnnounce`) and renders the primary UI.
- **App.module.css**: Component-specific styles for the App component layout.
- **main.tsx**: Entry point for the React application. Includes standalone mode detection for iOS.
- **index.css**: Global CSS styles including resets, animations, typography defaults, and PWA-specific styles.
- **index.html**: Main HTML file with mobile meta tags, PWA configurations, and the root div (`#root`).
- **manifest.json**: PWA manifest file for home screen installation on mobile devices.
- **data/symbols.ts**: Central data file containing all symbol definitions, categories, and utility functions for symbol management.
- **data/sequences.ts**: Data file containing the Sequence interface definition, predefined sequences, and helper functions for sequence management.
- **components/AppBar.tsx**: Component for the top application bar, including title, edit mode toggle, and auto-announce toggle.
- **components/AppBar.module.css**: Styles specific to the `AppBar` component.

## Component Structure & Responsibilities

### App.tsx
- **State Managed:**
  - `nowSymbol: string | null`: Filename of the symbol for the "Now" activity.
  - `nextSymbol: string | null`: Filename of the symbol for the "Next" activity.
  - `isPopupOpen: 'now' | 'next' | null`: Controls which symbol selection popup is open.
  - `isEditMode: boolean`: Tracks whether the app is in edit mode or view mode.
  - `favoriteSymbols: string[]`: Array of filenames for favorited symbols, persisted in localStorage.
  - `activeCategory: string | 'Favorites'`: Currently selected category in the symbol selection popup.
  - `sequences: Sequence[]`: Array of available activity sequences.
  - `selectedSequenceId: string | null`: ID of the currently selected sequence.
  - `currentStepIndex: number`: Current position in the selected sequence.
  - `userCreatedSequences: boolean[]`: Tracks which sequences are user-created vs. default.
  - `autoAnnounce: boolean`: Tracks whether the "Now" activity name should be automatically announced via speech synthesis.
- **Renders:**
  - `AppBar`: The top application bar containing controls.
  - `ActivityCard` (x2): For "Now" and "Next".
  - `SymbolSelectionPopup`: The popup for choosing symbols.
  - `SequenceBar`: For managing and navigating activity sequences.
  - `SequenceEditor`: For creating and editing sequences.
- **Responsibilities:**
  - Manages the main state of the application.
  - Handles user interactions for selecting symbols.
  - Passes state and callbacks to the `AppBar` for toggling edit mode and auto-announce.
  - Initializes default symbols if none are selected.
  - Persists favorite symbols to localStorage.
  - Filters and provides symbols based on selected category.
  - Manages sequences, including creation, editing, and navigation through sequence steps.

### AppBar Component
- **Files:** `components/AppBar.tsx`, `components/AppBar.module.css`
- **Purpose:** Displays the top application bar with the title and primary controls.
- **Props (Inputs):**
  - `title: string`: The title to display in the app bar.
  - `onEditModeToggle: () => void`: Callback to toggle edit mode.
  - `isEditMode: boolean`: Current state of edit mode.
  - `autoAnnounce: boolean`: Current state of auto-announce feature.
  - `onToggleAutoAnnounce: () => void`: Callback to toggle auto-announce.
  - `onVoiceChange: () => void`: Placeholder for future voice selection functionality.
- **Responsibilities:**
  - Displays the application title.
  - Renders toggle switches for Edit Mode and Auto-Announce features.
  - Calls back to `App.tsx` when toggles are changed.

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
  - Applies focus styling for the "Now" card with subtle pulsing animation.
  - Shows placeholder when no symbol is selected.

### SymbolButton Component
- **Files:** `components/SymbolButton.tsx`, `components/SymbolButton.module.css`
- **Purpose:** A reusable button displaying a single symbol image and name.
- **Props (Inputs):**
  - `symbolName: string`: The filename of the symbol.
  - `onClick: (e: React.MouseEvent) => void`: Callback function triggered when the button is clicked.
  - `isNow?: boolean`: Indicates if this button represents the current "now" activity.
  - `isFavorite?: boolean`: Whether this symbol is marked as favorite.
  - `onToggleFavorite?: () => void`: Callback to toggle favorite status.
- **Responsibilities:**
  - Displays a symbol with its properly formatted name using data from symbols.ts.
  - Provides favorite toggling functionality with star icon.
  - Handles click events while preventing event propagation for favorite toggling.
  - Applies special styling for "now" symbols.

### SymbolSelectionPopup Component
- **Files:** `components/SymbolSelectionPopup.tsx`, `components/SymbolSelectionPopup.module.css`
- **Purpose:** A modal popup for selecting symbols, displayed in full screen.
- **Props (Inputs):**
  - `isOpen: boolean`: Controls if the popup is visible.
  - `popupType: 'now' | 'next' | 'sequence' | null`: Determines the title and behavior of the popup.
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
  - Provides category tabs for filtering symbols.
  - Displays a grid of symbols with favorites functionality.
  - Handles closing via backdrop click or close button.
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
  - Provides navigation controls for moving through sequence steps.
  - Displays dropdown for selecting sequences, grouped by default and user-created.
  - Shows step indicator (e.g., "3/8") for the current sequence.
  - Manages sequence CRUD operations via buttons.
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
  - Integrates with SymbolSelectionPopup for more symbol options.
  - Handles validation and error messaging.
  - Generates unique IDs for new sequences.

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
   - `App.tsx` initializes `nowSymbol` and `nextSymbol` with default values if they are not already set.
   - Favorite symbols are loaded from localStorage if available.
   - Default sequences are loaded from `sequences.ts` and any user-created sequences from localStorage.

2. **User Interaction:**
   - Clicking on the "Now" or "Next" card opens the `SymbolSelectionPopup` when in edit mode.
   - Users can filter symbols by category using the tabs in the popup.
   - Selecting a symbol in the popup updates the corresponding state and closes the popup.
   - Users can toggle favorite status on symbols which persists to localStorage.
   - The Edit Mode and Auto-Announce toggles in the `AppBar` control application behavior.
   - Users can select sequences from the dropdown in the SequenceBar.
   - Navigation through sequence steps with prev/next buttons updates Now/Next cards.

3. **Sequence Management:**
   - Creating a new sequence opens the SequenceEditor modal.
   - Editing an existing user-created sequence populates the editor with sequence data.
   - Saving a sequence updates the sequences array and persists to localStorage.
   - Deleting a sequence removes it from the array and localStorage.
   - Sequences are categorized as default or user-created in the dropdown.

4. **Data Flow:**
   - Symbol data flows from `symbols.ts` → `App.tsx` → `SymbolSelectionPopup` → `SymbolButton`
   - Sequence data flows from `sequences.ts` → `App.tsx` → `SequenceBar` → `SequenceEditor`
   - User interactions flow in reverse: `SymbolButton` → `SymbolSelectionPopup` → `App.tsx`
   - Favorites are stored in `App.tsx` state and persisted to localStorage
   - Category filtering happens at the App level with `getDisplaySymbols()` function
   - Sequence navigation updates the current step index which determines Now/Next symbols

5. **Edit Mode Flow:**
   - Edit mode toggle in the `AppBar` toggles app interaction mode.
   - When enabled, cards become clickable to change symbols and sequence controls are accessible.
   - When disabled, cards simply display the current symbols without interaction and sequence bar may collapse.

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
  5. Save the sequence
- **Navigation:**
  1. Select a sequence from the dropdown
  2. Use prev/next buttons to move through steps
  3. Current step updates the "Now" symbol and next step updates the "Next" symbol
  4. Visual indicators show progress through the sequence (e.g., "3/8")
- **Editing/Deleting:**
  - Only user-created sequences can be edited or deleted
  - Default sequences are read-only

## UI/UX Features

- **Full Screen Popup:** Symbol selection appears as a full-screen modal
- **Category Filtering:** Tab navigation for filtering symbols by category
- **Favorites System:** Star icons to mark frequently used symbols
- **Now Card Animation:** Subtle pulsing effect (scale: 1.02) to highlight current activity
- **Edit Mode Toggle:** Always visible toggle in the `AppBar` for switching modes
- **Auto-Announce Toggle:** Always visible toggle in the `AppBar` to enable/disable automatic speech for the "Now" activity
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
   - Add entry in `src/data/symbols.ts`

5. **Create New Sequences:**
   - Add entry to `src/data/sequences.ts` for predefined sequences
   - Use the UI to create user sequences

## Key Features

1. **Activity Management:**
   - Set "Now" and "Next" activities using symbols.
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
   - Navigate through sequence steps with prev/next controls.
   - Visual step indicators to track progress through a sequence.
7. **Auto Announce:**
   - Automatically speaks the name of the "Now" activity using speech synthesis when it changes (can be toggled off).

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