import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('app-header')
export class Header extends LitElement {
  @property({ type: Number }) favoritesCount = 0;
  @property({ type: Function }) onViewFavorites = () => { };

  static styles = css`
    :host {
      display: block;
      background:rgb(69 98 146);
      color: white;
      padding: 1rem 0;
      border-bottom: 1px solid #e5e7eb;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }

    .header-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }



    .app-title {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0;
    }

    .app-subtitle {
      font-size: 0.875rem;
      opacity: 0.9;
      margin: 0;
      font-weight: 300;
    }

    .nav-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .favorites-button {
      background: #6b7280;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .favorites-count {
      background: #ef4444;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 600;
      min-width: 20px;
    }

    /* Focus styles for better accessibility */
    .favorites-button:focus {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }

    @media (max-width: 768px) {
      .header-container {
        flex-direction: column;
        text-align: center;
        gap: 1.5rem;
      }

      .app-title {
        font-size: 1.5rem;
      }

      .nav-section {
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .app-title {
        font-size: 1.25rem;
      }

      .favorites-button {
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
      }
    }
  `;

  private handleHeaderClick() {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new CustomEvent('reset-app', { detail: { path: '/' } }));
  }

  private handleFavoritesClick(event: Event) {
    // Stop the event from bubbling up to the header
    event.stopPropagation();
    // Call the original favorites handler
    this.onViewFavorites();
  }

  render() {
    return html`
      <header 
        role="banner" 
        aria-label="Disney Character Explorer Header"
        @click="${this.handleHeaderClick}"
        style="cursor: pointer;"
      >
        <div class="header-container">
          <div class="logo-section">
            <div>
              <h1 class="app-title" id="main-title">Disney Character Explorer</h1>

            </div>
          </div>

          <nav class="nav-section" role="navigation" aria-label="Main navigation">
            <button 
              class="favorites-button"
              @click="${this.handleFavoritesClick}"
              aria-label="${this.favoritesCount > 0 ? `View ${this.favoritesCount} favorite character${this.favoritesCount !== 1 ? 's' : ''}` : 'View favorites'}"
              aria-describedby="favorites-count"
            >
              <span>Favorites</span>
              ${this.favoritesCount > 0 ? html`
                <span class="favorites-count" id="favorites-count" aria-label="${this.favoritesCount} favorite${this.favoritesCount !== 1 ? 's' : ''}">${this.favoritesCount}</span>
              ` : ''}
            </button>
          </nav>
        </div>
      </header>
    `;
  }
}
