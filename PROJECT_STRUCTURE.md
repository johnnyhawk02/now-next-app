# Now-Next App Project Structure

This document provides an overview of the Now-Next application structure, explaining the purpose of each file and how components interact with each other.

## Main Application Files

- **App.tsx**: The main application component that manages the overall state and renders the primary UI
- **App.module.css**: Component-specific styles for the App component
- **main.tsx**: Entry point for the React application
- **index.css**: Global CSS styles that apply across the entire application

## Component Structure

### Activity Card Component
- **components/ActivityCard.tsx**: Displays either the "Now" or "Next" activity with its symbol
- **components/ActivityCard.module.css**: Styles specific to the ActivityCard component

### Symbol Button Component
- **components/SymbolButton.tsx**: Reusable button component that displays a symbol with its name
- **components/SymbolButton.module.css**: Styles for the symbol buttons

### Symbol Selection Popup Component
- **components/SymbolSelectionPopup.tsx**: Popup that allows users to select symbols for Now, Next, or Sequence
- **components/SymbolSelectionPopup.module.css**: Styles for the popup including the 3-column grid layout

### Burger Menu Component
- **components/BurgerMenu.tsx**: Menu that provides access to app functions (Choose Now/Next, Finish Now, etc.)
- **components/BurgerMenu.module.css**: Styles for the burger menu

## Component Interactions

1. **App.tsx**:
   - Manages the main state (nowSymbol, nextSymbol, sequence, popups)
   - Renders ActivityCard, BurgerMenu, and SymbolSelectionPopup components
   - Passes state and callback functions to these components

2. **ActivityCard.tsx**:
   - Receives `title`, `symbolFilename`, and `onClick` props from App.tsx
   - Displays the symbol image and title
   - When clicked, triggers the parent's onClick function to open the relevant popup

3. **SymbolButton.tsx**:
   - Used within SymbolSelectionPopup
   - Receives `symbolName` and `onClick` props
   - When clicked, triggers its onClick prop to select the symbol

4. **SymbolSelectionPopup.tsx**:
   - Receives props from App.tsx including `popupType`, `availableSymbols`, etc.
   - Uses SymbolButton components to display available symbols in a 3-column grid
   - When a symbol is clicked, calls onSelectSymbol which updates state in App.tsx

5. **BurgerMenu.tsx**:
   - Receives isOpen state and callback functions from App.tsx
   - When menu items are clicked, triggers the appropriate callback function

## Data Flow

1. User clicks on "Now" or "Next" card → opens symbol selection popup
2. User selects a symbol → updates nowSymbol or nextSymbol state in App.tsx
3. Updated state is passed to ActivityCard → displays the selected symbol

## Symbols

Symbols are stored in `public/symbols/` and include:
- bath.png
- brush teeth girl.png
- bunk beds.png
- dream machine.png
- finished.png

## Key Features

1. **Activity Management**:
   - Set "Now" and "Next" activities using symbols
   - Finish current activity and advance to next

2. **Sequence Creation**:
   - Create a sequence of activities
   - Feed from the sequence to automatically update Now/Next

3. **UI Features**:
   - Responsive design that works on different screen sizes
   - 3-column grid for symbol selection
   - CSS Modules for component-specific styling and preventing style conflicts

## CSS Structure

The project uses CSS Modules for component-scoped styling:
- Each component has its own `.module.css` file
- Global styles are in `index.css`
- Legacy styles may remain in `styles.css` (can be migrated to modules)

## Technical Implementation

- Built with React + TypeScript
- Uses Vite as the build tool
- CSS Modules for scoped styling
- Interactive UI with popups and clickable components