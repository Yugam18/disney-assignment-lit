import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { DisneyCharacter, SearchFilters } from './types/index.js';
import { disneyAPI } from './utils/api.js';
import { CharacterUtils } from './utils/characterUtils.js';
import { filterCharacters, parseStateFromURL, updateURLWithState } from './utils/appUtils.js';
import { generateSearchSuggestions, formatCountText } from './utils/searchUtils.js';
import './components/Header.js';
import './components/SearchBar.js';
import './components/FilterPanel.js';
import './components/CharacterCard.js';
import './components/CharacterProfile.js';


@customElement('disney-app')
export class DisneyApp extends LitElement {
    @state() private loadedCharacters: DisneyCharacter[] = [];
    @state() private filteredCharacters: DisneyCharacter[] = [];
    @state() private displayedCharacters: DisneyCharacter[] = [];
    @state() private loading = false;
    @state() private filtering = false;
    @state() private error: string | null = null;
    @state() private searchTerm = '';
    @state() private filters: SearchFilters = {};

    @state() private showFavorites = false;
    @state() private favorites: DisneyCharacter[] = [];

    @state() private totalCount = 0;
    @state() private suggestions: string[] = [];

    static styles = css`
        :host {
            display: block;
            min-height: 100vh;
            background: #f8f9fa;
            padding-top: 100px;
        }

        .main-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 1rem;
        }

        .content-section {
            background: white;
            border-radius: 8px;
            padding: 1.5rem;
            margin: 1.5rem 0;
            border: 1px solid #e5e7eb;
        }

        .section-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #374151;
            margin: 0 0 1.5rem 0;
            text-align: center;
        }

        .characters-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 1.5rem;
            margin: 2rem 0;
            justify-content: center;
        }

        .characters-grid > * {
            flex: 0 1 280px;
            min-width: 280px;
            max-width: 100%;
        }

        .loading-spinner {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 4rem 2rem;
            color: #6b7280;
        }

        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #e5e7eb;
            border-top: 4px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
        }

        .loading-text {
            font-size: 1.125rem;
            font-weight: 500;
            margin-bottom: 0.5rem;
        }

        .loading-subtext {
            font-size: 0.875rem;
            color: #9ca3af;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .error-message {
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #dc2626;
            padding: 1rem;
            border-radius: 8px;
            text-align: center;
            margin: 2rem 0;
        }

        .no-results {
            text-align: center;
            padding: 3rem;
            color: #6b7280;
            font-size: 1.125rem;
        }

        .back-button {
            background: #6b7280;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.875rem;
            margin-bottom: 1rem;
        }

        .stats-info {
            text-align: center;
            color: #6b7280;
            margin: 1rem 0;
            font-size: 0.875rem;
        }

        .load-more-container {
            text-align: center;
            margin: 2rem 0;
        }

        .load-more-button {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
        }

        .load-more-button:disabled {
            background: #9ca3af;
            cursor: not-allowed;
        }

        .load-more-info {
            color: #6b7280;
            font-size: 0.875rem;
            margin-top: 0.5rem;
        }

        .main-content-layout {
            display: flex;
            gap: 1.5rem;
            align-items: flex-start;
            margin-top: 20px;
        }

        .characters-section {
            flex: 1;
            background: white;
            border-radius: 8px;
            padding: 1.5rem;
            border: 1px solid #e5e7eb;
        }

        .section-header {
            margin-bottom: 1.5rem;
        }

        .breadcrumb-nav {
            margin-bottom: 1rem;
        }

        /* Focus styles for better accessibility */
        .back-button:focus {
            outline: 2px solid #3b82f6;
            outline-offset: 2px;
        }

        @media (max-width: 1024px) {
            .main-content-layout {
                flex-direction: column;
            }
        }

        @media (max-width: 768px) {
            .main-container {
                padding: 0.5rem;
            }

            .content-section {
                padding: 1rem;
                margin: 1rem 0;
            }

            .characters-grid {
                grid-template-columns: 1fr;
                gap: 1rem;
            }
        }
    `;

    constructor() {
        super();
        this.loadFavorites();
        this.loadFromURL();
        this.loadInitialCharacters();
        window.addEventListener('reset-app', this.handleResetApp.bind(this));
    }

    private async loadInitialCharacters() {
        this.loading = true;
        this.error = null;

        try {
            const response = await disneyAPI.getAllCharacters();

            let characters: DisneyCharacter[] = [];
            if (Array.isArray(response)) {
                characters = response;
            } else if (response.data && Array.isArray(response.data)) {
                characters = response.data;
                this.totalCount = response.count || 0;
            } else {
                console.warn('Unexpected API response format:', response);
                characters = [];
            }

            this.loadedCharacters = characters;
            this.applyFiltersAndSearch();
        } catch (err) {
            this.error = 'Failed to load characters. Please try again later.';
        } finally {
            this.loading = false;
            this.requestUpdate();
        }
    }

    private async applyFiltersAndSearch() {
        if (this.loadedCharacters.length === 0) return;

        this.filtering = true;
        
        // Add a small delay to show loading state for better UX
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const filtered = filterCharacters(this.loadedCharacters, this.searchTerm, this.filters);
        this.filteredCharacters = filtered;
        this.totalCount = filtered.length;

        this.updateDisplayedCharacters();
        this.filtering = false;
    }

    private updateDisplayedCharacters() {
        this.displayedCharacters = this.filteredCharacters;
    }




    private loadFromURL() {
        const { searchTerm, filters } = parseStateFromURL();
        this.searchTerm = searchTerm;
        this.filters = filters;
    }

    private updateURL() {
        updateURLWithState(this.searchTerm, this.filters);
    }

    private loadFavorites() {
        this.favorites = CharacterUtils.getFavorites();
    }

    private handleSearch(searchTerm: string) {
        this.searchTerm = searchTerm;


        if (searchTerm.trim()) {
            this.filters = { ...this.filters, name: searchTerm.trim() };
        } else {
            const { name, ...otherFilters } = this.filters;
            this.filters = otherFilters;
        }

        this.applyFiltersAndSearch();

        this.updateURL(); // Update URL with new state
    }

    private handleType(term: string) {
        this.suggestions = generateSearchSuggestions(this.loadedCharacters, term);
    }

    private handleSelectSuggestion(term: string) {
        this.searchTerm = term;
        this.filters = { ...this.filters, name: term };
        this.applyFiltersAndSearch();
        this.updateURL();
        this.suggestions = [];
    }

    private handleFiltersChange(newFilters: SearchFilters) {
        console.log('🎛️ Filters changed:', newFilters);
        this.filters = { ...newFilters }; // Create new object reference

        // Apply client-side filtering on currently loaded data
        this.applyFiltersAndSearch();

        this.updateURL(); // Update URL with new state
    }

    private handleViewFavorites() {
        this.showFavorites = !this.showFavorites;
        if (this.showFavorites) {
            this.loadFavorites();
        }
    }

    private handleBackToMain() {
        this.showFavorites = false;
    }

    private handleResetApp() {
        // Reset search state and filters
        this.searchTerm = '';
        this.filters = {};
        this.suggestions = [];
        this.showFavorites = false;

        this.applyFiltersAndSearch();

        this.updateURL();
    }

        private renderCharactersSection() {
        if (this.loading) {
            return html`
                <div class="loading-spinner" role="status" aria-live="polite">
                    <div class="spinner"></div>
                    <div class="loading-text">Loading Disney characters...</div>
                    <div class="loading-subtext">Please wait while we fetch the magic</div>
                </div>
            `;
        }
        
        if (this.filtering) {
            return html`
                <div class="loading-spinner" role="status" aria-live="polite">
                    <div class="spinner"></div>
                    <div class="loading-text">Filtering characters...</div>
                    <div class="loading-subtext">Finding the perfect matches</div>
                </div>
            `;
        }
        
        if (this.error) {
            return html`
                <div class="error-message" role="alert" aria-live="assertive">
                    ${this.error}
                </div>
            `;
        }
        
        if (this.loadedCharacters.length === 0) {
            return html`
                <div class="loading-spinner" role="status" aria-live="polite">
                    <div class="spinner"></div>
                    <div class="loading-text">No characters available</div>
                    <div class="loading-subtext">Please try refreshing the page</div>
                </div>
            `;
        }
        
        if (this.displayedCharacters.length === 0) {
            return html`
                <div class="no-results" role="status" aria-live="polite">
                    <p>No characters found matching your criteria.</p>
                    <p>Try adjusting your search or filters.</p>
                </div>
            `;
        }
        
        return html`
            <div class="stats-info" role="status" aria-live="polite">
                Showing ${formatCountText(this.filteredCharacters.length, 'character')}
            </div>
            
            <div class="characters-grid" role="grid" aria-label="Disney characters">
                ${this.displayedCharacters.map(character => html`
                    <character-card 
                        .character=${character}
                    ></character-card>
                `)}
            </div>
        `;
    }

    render() {
        const displayCharacters = this.showFavorites ? this.favorites : this.displayedCharacters;
        const favoritesCount = this.favorites.length;

        return html`
            <app-header 
                .favoritesCount=${favoritesCount}
                .onViewFavorites=${this.handleViewFavorites.bind(this)}
            ></app-header>

            <main class="main-container" role="main" aria-labelledby="main-title" id="main-content">
                ${this.showFavorites ? html`
                    <section class="content-section" aria-labelledby="favorites-title">
                        <nav class="breadcrumb-nav" aria-label="Breadcrumb navigation">
                            <button 
                                class="back-button"
                                @click="${this.handleBackToMain.bind(this)}"
                                aria-label="Return to character explorer"
                            >
                                ← Back to Character Explorer
                            </button>
                        </nav>
                        
                        <header class="section-header">
                            <h2 class="section-title" id="favorites-title">❤️ Your Favorite Characters</h2>
                        </header>
                        
                        ${favoritesCount === 0 ? html`
                            <div class="no-results" role="status" aria-live="polite">
                                <p>You haven't added any favorites yet.</p>
                                <p>Start exploring characters and add them to your favorites!</p>
                            </div>
                        ` : html`
                            <div class="stats-info" role="status" aria-live="polite">
                                You have ${formatCountText(favoritesCount, 'favorite character')}
                            </div>
                            
                            <div class="characters-grid" role="grid" aria-label="Favorite characters">
                                ${displayCharacters.map(character => html`
                                    <character-card 
                                        .character=${character}
                                    ></character-card>
                                `)}
                            </div>
                        `}
                    </section>
                ` : html`
                    <section class="content-section" aria-labelledby="search-title">
                        <header class="section-header">
                            <h2 class="section-title" id="search-title">Search Character</h2>
                        </header>
                        
                        <search-bar 
                            .searchTerm=${this.searchTerm}
                            .onSearch=${this.handleSearch.bind(this)}
                            .suggestions=${this.suggestions}
                            .onType=${this.handleType.bind(this)}
                            .onSelectSuggestion=${this.handleSelectSuggestion.bind(this)}
                        ></search-bar>
                    </section>

                    <div class="main-content-layout">
                        <filter-panel 
                            .filters=${this.filters}
                            .onFiltersChange=${this.handleFiltersChange.bind(this)}
                        ></filter-panel>

                        <section class="characters-section" aria-labelledby="characters-title">
                            ${this.renderCharactersSection()}
                        </section>
                    </div>
                `}
            </main>
        `;
    }
}
