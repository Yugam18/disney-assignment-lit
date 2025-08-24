import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DisneyCharacter } from '../types/index.js';
import { CharacterUtils } from '../utils/characterUtils.js';
import './CharacterProfile.js';

@customElement('character-card')
export class CharacterCard extends LitElement {
  @property({ type: Object }) character!: DisneyCharacter;
  @property({ type: Boolean }) showProfile = false;

  static styles = css`
    :host {
      display: block;
      margin: 1rem;
    }

    .card {
      background: white;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      overflow: hidden;
      cursor: pointer;
      max-width: 300px;
    }

    .card-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      background: #f3f4f6;
    }

    .card-content {
      padding: 1rem;
    }

    .character-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }

    .character-info {
      color: #6b7280;
      font-size: 0.875rem;
      margin: 0.25rem 0;
    }

    .favorite-btn {
      background:cornflowerblue;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }

    .favorite-btn.favorited {
      background: #10b981;
    }

    @media (max-width: 768px) {
      .card {
        max-width: 100%;
        margin: 0.5rem 0;
      }
    }
  `;

  private toggleFavorite() {
    if (CharacterUtils.isFavorite(this.character._id)) {
      CharacterUtils.removeFromFavorites(this.character._id);
    } else {
      CharacterUtils.addToFavorites(this.character);
    }
    this.requestUpdate();
  }

  private openProfile() {
    this.showProfile = true;
  }

  private closeProfile() {
    this.showProfile = false;
  }

  render() {
    const isFavorited = CharacterUtils.isFavorite(this.character._id);
    const imageUrl = CharacterUtils.getCharacterImageUrl(this.character);

    return html`
      <div class="card" @click="${this.openProfile}">
        <img 
          class="card-image" 
          src="${imageUrl}" 
          alt="${this.character.name}"
          @error="${(e: Event) => {
        const target = e.target as HTMLImageElement;
        target.src = CharacterUtils.getCharacterImageUrl({} as DisneyCharacter);
      }}"
        >
        <div class="card-content">
          <h3 class="character-name">${this.character.name}</h3>
          
          ${this.character.films && this.character.films.length > 0
        ? html`<p class="character-info">Films: ${CharacterUtils.formatArrayData(this.character.films)}</p>`
        : ''
      }
          
          ${this.character.tvShows && this.character.tvShows.length > 0
        ? html`<p class="character-info">TV Shows: ${CharacterUtils.formatArrayData(this.character.tvShows)}</p>`
        : ''
      }

          <button 
            class="favorite-btn ${isFavorited ? 'favorited' : ''}"
            @click="${(e: Event) => {
              e.stopPropagation();
              this.toggleFavorite();
            }}"
          >
                          ${isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>
        </div>
      </div>

      <character-profile 
        .character=${this.character}
        .isOpen=${this.showProfile}
        @close=${this.closeProfile}
      ></character-profile>
    `;
  }
}
