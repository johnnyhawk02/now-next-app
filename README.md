# Now & Next App

This project is a React + TypeScript application built with Vite. It is designed to help users plan and manage activities using visual symbols for "Now" and "Next" tasks.

## Features

- **Activity Management**: Set "Now" and "Next" activities using symbols.
- **Symbol Selection**: Choose from a variety of symbols to represent tasks.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Progressive Web App (PWA)**: Installable on mobile devices for a native-like experience.

## File Structure

```
public/
  symbols/          # Contains all the activity symbols (e.g., bath.png, pyjamas.png)
  manifest.json     # PWA configuration
src/
  components/       # Reusable React components (e.g., ActivityCard, SymbolButton)
  App.tsx           # Main application component
  index.css         # Global styles
  main.tsx          # Application entry point
  vite-env.d.ts     # TypeScript environment definitions
```

## Development

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open the app in your browser at `http://localhost:5173`.

### Building for Production

To create a production build:
```bash
npm run build
```

The build output will be in the `dist/` directory.

### Linting

This project uses ESLint for code quality. To run the linter:
```bash
npm run lint
```

## Expanding the ESLint Configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

## License

This project is licensed under the MIT License.
