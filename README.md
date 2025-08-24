# Disney Explorer

A modern web application built with Lit framework to explore Disney characters. Browse, search, and discover your favorite Disney characters with a beautiful, responsive interface.

## Features

- 🎭 Browse Disney characters with beautiful cards
- 🔍 **Enhanced search** - Search by character names, films, TV shows
- 🔤 **Smart autocomplete** - Get character name suggestions as you type
- 🎛️ **Advanced filtering** - Filter by films, TV shows, and video games
- ❤️ Add characters to favorites
- 📱 Responsive design for all devices
- 🎨 Modern UI with smooth animations
- 📊 Detailed character profiles
- 🔗 **URL state management** - Share and bookmark filtered results

## Tech Stack

- **Framework**: Lit (Web Components)
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: CSS-in-JS with Lit
- **API**: Disney API

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd disney-explorer-lit
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

## Build for Production

```bash
npm run build
# or
yarn build
```

## Project Structure

```
src/
├── components/          # Web components
│   ├── CharacterCard.ts
│   ├── CharacterProfile.ts
│   ├── FilterPanel.ts
│   ├── Header.ts
│   ├── SearchBar.ts
│   └── StructuredData.ts
├── types/              # TypeScript type definitions
│   └── index.ts        # Character and filter interfaces
├── utils/              # Utility functions
│   ├── api.ts          # Disney API integration
│   ├── appUtils.ts     # URL state management and filtering
│   ├── characterUtils.ts # Character-specific utilities
│   └── searchUtils.ts  # Search and suggestion utilities
└── lit-app.ts          # Main application component
```

## Usage

### Search Functionality
- **Keyword Search**: Type any keyword to search across:
  - Character names (e.g., "Mickey", "Elsa")
  - Films (e.g., "Frozen", "The Lion King")
  - TV shows (e.g., "Mickey Mouse Clubhouse", "Phineas and Ferb")

- **Smart Autocomplete**: Get instant character name suggestions as you type
- **Advanced Filters**: Use the filter panel to narrow results by specific films, TV shows, or video games

## Code Architecture

### Recent Improvements
- **Enhanced Search**: Implemented comprehensive keyword search across all character properties
- **Utility Refactoring**: Extracted search and formatting utilities into dedicated modules
- **Performance Optimization**: Improved search algorithms and suggestion generation
- **Accessibility**: Enhanced ARIA labels and keyboard navigation

### Key Components
- **SearchBar**: Handles user input with autocomplete suggestions
- **FilterPanel**: Provides advanced filtering options
- **CharacterCard**: Displays character information in an attractive card format
- **SearchUtils**: Contains search logic and suggestion generation
- **AppUtils**: Manages URL state and character filtering
