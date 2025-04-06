# Now-Next App Project Structure

This document provides an overview of the Now-Next application structure, explaining the purpose of each file and how components interact with each other. It is tailored to assist AI in understanding the app's architecture and functionality.

## Main Application Files

- **App.tsx**: The main application component that manages the overall state (`nowSymbol`, `nextSymbol`, `isPopupOpen`, `isEditMode`) and renders the primary UI.
- **App.module.css**: Component-specific styles for the App component, including styles for the Edit Mode toggle switch and layout.
- **main.tsx**: Entry point for the React application. Includes standalone mode detection for iOS.
- **index.css**: Global CSS styles including resets, animations, typography defaults, and PWA-specific styles.
- **index.html**: Main HTML file with mobile meta tags, PWA configurations, and the root div (`#root`).
- **manifest.json**: PWA manifest file for home screen installation on mobile devices.
- **data/symbols.ts**: Central data file containing all symbol definitions, categories, and utility functions for symbol management.

## Component Structure & Responsibilities

### App.tsx
- **State Managed:**
  - `nowSymbol: string | null`: Filename of the symbol for the "Now" activity.
  - `nextSymbol: string | null`: Filename of the symbol for the "Next" activity.
  - `isPopupOpen: 'now' | 'next' | null`: Controls which symbol selection popup is open.
  - `isEditMode: boolean`: Tracks whether the app is in edit mode or view mode.
  - `favoriteSymbols: string[]`: Array of filenames for favorited symbols, persisted in localStorage.
  - `activeCategory: string | 'Favorites'`: Currently selected category in the symbol selection popup.
- **Renders:**
  - `ActivityCard` (x2): For "Now" and "Next".
  - `SymbolSelectionPopup`: The popup for choosing symbols.
  - Edit Mode toggle switch: A toggle switch in the top-right corner to enable or disable edit mode.
- **Responsibilities:**
  - Manages the main state of the application.
  - Handles user interactions for selecting symbols.
  - Toggles between edit and view modes using the Edit Mode toggle switch.
  - Initializes default symbols if none are selected.
  - Persists favorite symbols to localStorage.
  - Filters and provides symbols based on selected category.

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
- **Responsibilities:**
  - Presents a full-screen modal for symbol selection.
  - Provides category tabs for filtering symbols.
  - Displays a grid of symbols with favorites functionality.
  - Handles closing via backdrop click or close button.
  - Makes sure the edit toggle remains accessible with a top-right cutout.

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

## State Flow

1. **Initialization:**
   - `App.tsx` initializes `nowSymbol` and `nextSymbol` with default values if they are not already set.
   - Favorite symbols are loaded from localStorage if available.

2. **User Interaction:**
   - Clicking on the "Now" or "Next" card opens the `SymbolSelectionPopup` when in edit mode.
   - Users can filter symbols by category using the tabs in the popup.
   - Selecting a symbol in the popup updates the corresponding state and closes the popup.
   - Users can toggle favorite status on symbols which persists to localStorage.
   - The Edit Mode toggle controls whether cards are interactive or static.

3. **Data Flow:**
   - Symbol data flows from `symbols.ts` → `App.tsx` → `SymbolSelectionPopup` → `SymbolButton`
   - User interactions flow in reverse: `SymbolButton` → `SymbolSelectionPopup` → `App.tsx`
   - Favorites are stored in `App.tsx` state and persisted to localStorage
   - Category filtering happens at the App level with `getDisplaySymbols()` function

4. **Edit Mode Flow:**
   - Edit mode toggle in top-right corner (z-index: 10000) toggles app interaction mode
   - When enabled, cards become clickable to change symbols
   - When disabled, cards simply display the current symbols without interaction

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

## UI/UX Features

- **Full Screen Popup:** Symbol selection appears as a full-screen modal
- **Category Filtering:** Tab navigation for filtering symbols by category
- **Favorites System:** Star icons to mark frequently used symbols
- **Now Card Animation:** Subtle pulsing effect (scale: 1.02) to highlight current activity
- **Edit Mode Toggle:** Always visible toggle in top-right corner for switching modes
- **Safe Area Support:** All UI elements respect device notches and home indicators
- **Mobile Optimization:**
  - Touch-friendly tap targets (minimum 44px)
  - iOS-specific fixes for tap highlights and scrolling
  - Standalone mode for home screen installation
  - Proper handling of safe areas on notched devices

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
- **Z-Index Management:**
  - Edit toggle: 10000 (highest)
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
   - Custom symbol upload feature
   - Symbol search and filtering
   - Advanced category management

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