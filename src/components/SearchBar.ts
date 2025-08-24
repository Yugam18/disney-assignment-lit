import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('search-bar')
export class SearchBar extends LitElement {
  @property({ type: String }) searchTerm = '';
  @property({ type: Function }) onSearch = (term: string) => { };
  @property({ type: Array }) suggestions: string[] = [];
  @property({ type: Function }) onSelectSuggestion = (term: string) => { };
  @property({ type: Function }) onType = (term: string) => { };

  private highlightedIndex: number = -1;

  static styles = css`
    :host {
      display: block;
      margin: 1rem 0;
    }

    .search-container {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      max-width: 600px;
      margin: 0 auto;
    }

    .search-input {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      background: white;
      width: 90%;
    }

    .search-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }

    .search-button:focus,
    .clear-button:focus {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }

    .search-button {
      padding: 0.75rem 1.5rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      white-space: nowrap;
    }

    .clear-button {
      padding: 0.75rem 1rem;
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
    }

    @media (max-width: 640px) {
      .search-container {
        flex-direction: column;
        gap: 0.75rem;
      }
      
      .search-input {
        width: 100%;
      }
      
      .search-button,
      .clear-button {
        width: 100%;
      }
    }

    .autocomplete {
      position: relative;
      width: 100%;
    }

    .suggestions {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #e5e7eb;
      border-top: none;
      border-radius: 0 0 8px 8px;
      max-height: 240px;
      overflow-y: auto;
      z-index: 10;
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
    }

    .suggestion-item {
      padding: 0.5rem 0.75rem;
      cursor: pointer;
    }

    .suggestion-item:hover,
    .suggestion-item.active {
      background: #f3f4f6;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  `;

  private handleInputChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.highlightedIndex = -1;
    this.onType(this.searchTerm);
  }

  private handleSearch() {
    this.onSearch(this.searchTerm);
  }

  private handleClear() {
    this.searchTerm = '';
    this.onSearch('');
  }

  private handleKeyPress(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.suggestions.length > 0) {
        this.highlightedIndex = (this.highlightedIndex + 1) % this.suggestions.length;
        this.requestUpdate();
      }
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.suggestions.length > 0) {
        this.highlightedIndex = (this.highlightedIndex - 1 + this.suggestions.length) % this.suggestions.length;
        this.requestUpdate();
      }
      return;
    }
    if (e.key === 'Enter') {
      if (this.highlightedIndex >= 0 && this.highlightedIndex < this.suggestions.length) {
        this.selectSuggestion(this.suggestions[this.highlightedIndex]);
      } else {
        this.handleSearch();
      }
    }
  }

  private selectSuggestion(term: string) {
    this.onSelectSuggestion(term);
  }

  render() {
    const showSuggestions = this.searchTerm && this.suggestions && this.suggestions.length > 0;
    return html`
      <div class="search-container" role="search" aria-label="Search Disney characters, films, TV shows, games, and more">
        <div class="autocomplete">
          <label for="search-input" class="sr-only">Search</label>
          <input
            id="search-input"
            type="text"
            class="search-input"
            placeholder="Search characters with keywords like name ,films, tv shows"
            .value="${this.searchTerm}"
            @input="${this.handleInputChange}"
            @keydown="${this.handleKeyPress}"
            aria-autocomplete="list"
            aria-expanded="${showSuggestions}"
            aria-controls="suggestions-list"
            aria-activedescendant="${this.highlightedIndex >= 0 ? `suggestion-${this.highlightedIndex}` : ''}"
            role="combobox"
            aria-label="Search for Disney characters, films, TV shows"
          >
          ${showSuggestions ? html`
            <div 
              class="suggestions" 
              id="suggestions-list"
              role="listbox"
              aria-label="Search suggestions"
            >
              ${this.suggestions.map((s, idx) => html`
                <div 
                  class="suggestion-item ${idx === this.highlightedIndex ? 'active' : ''}"
                  @click="${() => this.selectSuggestion(s)}"
                  role="option"
                  id="suggestion-${idx}"
                  aria-selected="${idx === this.highlightedIndex}"
                >${s}</div>
              `)}
            </div>
          ` : ''}
        </div>
        <button 
          class="search-button"
          @click="${this.handleSearch}"
          aria-label="Search for characters, films, TV shows, games, and more"
          type="button"
        >
          Search
        </button>
        ${this.searchTerm ? html`
          <button 
            class="clear-button"
            @click="${this.handleClear}"
            aria-label="Clear search"
            type="button"
          >
            Clear
          </button>
        ` : ''}
      </div>
    `;
  }
}
