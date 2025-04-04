# Now-Next App Project Structure

This document provides an overview of the Now-Next application structure, explaining the purpose of each file and how components interact with each other.

## Main Application Files

- **App.tsx**: The main application component that manages the overall state (`nowSymbol`, `nextSymbol`, `sequence`, `isPopupOpen`, `isMenuOpen`) and renders the primary UI.
- **App.module.css**: Component-specific styles for the App component.
- **main.tsx**: Entry point for the React application, includes standalone mode detection for iOS.
- **index.css**: Global CSS styles that apply across the entire application, including mobile optimizations and base element styling.
- **index.html**: Main HTML file with mobile meta tags, PWA configurations, and the root div (`#root`).
- **manifest.json**: PWA manifest file for home screen installation on mobile devices.

## Component Structure & Interactions

This section details each component, its props (inputs), and how it interacts with its parent (outputs/callbacks).

### App.tsx
- **State Managed:**
  - `nowSymbol: string | null`: Filename of the symbol for the "Now" activity.
  - `nextSymbol: string | null`: Filename of the symbol for the "Next" activity.
  - `isPopupOpen: 'now' | 'next' | 'sequence' | null`: Controls which symbol selection popup is open.
  - `sequence: string[]`: Array of symbol filenames for the activity sequence.
  - `isMenuOpen: boolean`: Controls the visibility of the burger menu.
- **Renders:**
  - `ActivityCard` (x2): For "Now" and "Next".
  - `BurgerMenu`: The main menu.
  - `SymbolSelectionPopup`: The popup for choosing symbols.
- **Provides Callbacks:**
  - `openPopup`: Opens the symbol selection popup for 'now', 'next', or 'sequence'.
  - `handleSelectSymbol`: Updates `nowSymbol`, `nextSymbol`, or `sequence` based on popup type.
  - `handleFinishNow`: Moves `nextSymbol` to `nowSymbol`.
  - `handleFeedSequence`: Takes symbols from `sequence` and puts them into `nowSymbol` and `nextSymbol`.

### ActivityCard Component
- **Files:** `components/ActivityCard.tsx`, `components/ActivityCard.module.css`
- **Purpose:** Displays either the "Now" or "Next" activity card.
- **Props (Inputs):**
  - `title: string`: The title of the card ("Now" or "Next").
  - `symbolFilename: string | null`: The filename of the symbol to display.
  - `onClick?: () => void`: Callback function triggered when the card is clicked.
  - `isFocus?: boolean`: If true, applies focus styling (used for the "Now" card).
- **Interactions (Outputs):**
  - Calls the `onClick` prop when the card div is clicked (used by `App.tsx` to trigger `openPopup`).

### SymbolButton Component
- **Files:** `components/SymbolButton.tsx`, `components/SymbolButton.module.css`
- **Purpose:** A reusable button displaying a single symbol image and name.
- **Props (Inputs):**
  - `symbolName: string`: The filename of the symbol.
  - `onClick: (e: React.MouseEvent) => void`: Callback function triggered when the button is clicked.
  - `isNow?: boolean`: If true, applies special styling (currently used for a 'NOW' badge and pulsing effect, though the effect is applied to the card now).
- **Interactions (Outputs):**
  - Calls the `onClick` prop when the button is clicked (used by `SymbolSelectionPopup` to trigger `handleSelectSymbol`).

### SymbolSelectionPopup Component
- **Files:** `components/SymbolSelectionPopup.tsx`, `components/SymbolSelectionPopup.module.css`
- **Purpose:** A modal popup for selecting symbols.
- **Props (Inputs):**
  - `isOpen: boolean`: Controls if the popup is visible.
  - `popupType: 'now' | 'next' | 'sequence' | null`: Determines the title and behavior of the popup.
  - `onClose: () => void`: Callback function to close the popup.
  - `onSelectSymbol: (e: React.MouseEvent, symbolName: string) => void`: Callback function triggered when a `SymbolButton` inside is clicked.
  - `availableSymbols: string[]`: List of symbol filenames to display.
  - `sequenceLength?: number`: The current length of the sequence (used for display when `popupType` is 'sequence').
- **Interactions (Outputs):**
  - Calls `onClose` when the overlay or close button is clicked.
  - Calls `onSelectSymbol` when a `SymbolButton` is clicked, passing the event and symbol name.

### BurgerMenu Component
- **Files:** `components/BurgerMenu.tsx`, `components/BurgerMenu.module.css`
- **Purpose:** A full-screen menu providing access to main app actions.
- **Props (Inputs):**
  - `isOpen: boolean`: Controls if the menu is visible.
  - `onClose: () => void`: Callback function to close the menu.
  - `onSelectOption: (option: 'now' | 'next' | 'sequence') => void`: Callback triggered when "Choose Now", "Choose Next", or "Create Sequence" is clicked.
  - `onFinishNow: () => void`: Callback triggered when "Finish Now" is clicked.
  - `onFeedSequence: () => void`: Callback triggered when "Feed Sequence" is clicked.
- **Interactions (Outputs):**
  - Calls `onClose` when the close button is clicked.
  - Calls the appropriate callback (`onSelectOption`, `onFinishNow`, `onFeedSequence`) when a menu button is clicked.

## Data Flow

1.  User clicks on "Now" `ActivityCard` -> `ActivityCard` calls its `onClick` prop -> `App.tsx` calls `openPopup('now')` -> `SymbolSelectionPopup` opens for 'now'.
2.  User clicks a `SymbolButton` in the popup -> `SymbolButton` calls its `onClick` prop -> `SymbolSelectionPopup` calls its `onSelectSymbol` prop -> `App.tsx` calls `handleSelectSymbol` -> updates `nowSymbol` state and closes popup.
3.  `App.tsx` re-renders, passing the new `nowSymbol` to the "Now" `ActivityCard`.

## Symbols

Symbols are stored in `public/symbols/` and include:
- bath.png
- brush teeth girl.png
- bunk beds.png
- dream machine.png
- finished.png

## Mobile Optimization

The app is optimized for iPhone and other mobile devices with:

1. **iOS PWA Support**:
   - Configured as a Progressive Web App for home screen installation
   - `manifest.json` for proper icon display and full-screen experience
   - Apple-specific meta tags in `index.html` for iOS web app capabilities

2. **Full-Screen Mode**:
   - Standalone mode detection in `main.tsx`
   - CSS optimizations for iPhone notches and home indicators
   - Safe area inset padding with `env()` variables

3. **Touch Optimizations**:
   - Appropriate button sizes for touch targets (minimum 44px)
   - Disabled unwanted behaviors like tap highlighting and double-tap zooming
   - Touch-specific interaction feedback

4. **iOS-Specific Features**:
   - Prevents bounce/scroll on iOS
   - Optimized for iOS safe areas
   - Proper home screen icon and startup image

## Key Features

1. **Activity Management**:
   - Set "Now" and "Next" activities using symbols
   - Finish current activity and advance to next

2. **Sequence Creation**:
   - Create a sequence of activities
   - Feed from the sequence to automatically update Now/Next

3. **UI Features**:
   - Responsive design for all screen sizes from desktop to mobile
   - 3-column grid for symbol selection
   - CSS Modules for component-specific styling and preventing style conflicts
   - Mobile-first design with touch-friendly interactions

## CSS Structure

The project uses CSS Modules for component-scoped styling:
- Each component has its own `.module.css` file
- Global styles are in `index.css` with mobile optimizations
- Custom animations for UI interactions

## Technical Implementation

- Built with React + TypeScript
- Uses Vite as the build tool
- CSS Modules for scoped styling
- Interactive UI with popups and clickable components
- Progressive Web App (PWA) capabilities
- Mobile optimization for iOS devices