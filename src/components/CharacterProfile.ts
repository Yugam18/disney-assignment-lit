import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DisneyCharacter } from '../types/index.js';
import { CharacterUtils } from '../utils/characterUtils.js';

@customElement('character-profile')
export class CharacterProfile extends LitElement {
  @property({ type: Object }) character!: DisneyCharacter;
  @property({ type: Boolean }) isOpen = false;

  static styles = css`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border: 1px solid #ccc;
      padding: 20px;
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }

    .close-button {
      float: right;
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      margin-bottom: 10px;
    }

    .character-image {
      width: 100px;
      height: 100px;
      display: block;
      margin: 0 auto 10px auto;
    }

    .character-name {
      text-align: center;
      font-size: 24px;
      margin: 10px 0;
    }

    .section {
      margin: 15px 0;
    }

    .section-title {
      font-weight: bold;
      margin-bottom: 5px;
    }

    .info-item {
      margin: 5px 0;
      padding: 5px;
      background: #f5f5f5;
    }

    .favorite-btn {
      background: #ff4444;
      color: white;
      border: none;
      padding: 10px 20px;
      cursor: pointer;
      margin-top: 15px;
    }

    .favorite-btn.favorited {
      background: #44aa44;
    }
  `;

  private closeModal() {
    this.isOpen = false;
    this.dispatchEvent(new CustomEvent('close'));
  }

  private handleOverlayClick(e: Event) {
    if (e.target === e.currentTarget) {
      this.closeModal();
    }
  }



  private toggleFavorite() {
    if (CharacterUtils.isFavorite(this.character._id)) {
      CharacterUtils.removeFromFavorites(this.character._id);
    } else {
      CharacterUtils.addToFavorites(this.character);
    }
    this.requestUpdate();
  }

  private renderSection(title: string, data: string[] | undefined) {
    if (!data || data.length === 0) {
      return html`
        <div class="section">
          <div class="section-title">${title}</div>
          <div>No ${title.toLowerCase()} available</div>
        </div>
      `;
    }

    return html`
      <div class="section">
        <div class="section-title">${title}</div>
        ${data.map(item => html`
          <div class="info-item">${item}</div>
        `)}
      </div>
    `;
  }

  render() {
    if (!this.character) return html``;

    const isFavorited = CharacterUtils.isFavorite(this.character._id);
    const imageUrl = CharacterUtils.getCharacterImageUrl(this.character);

    return html`
      ${this.isOpen ? html`
        <div class="modal-overlay" @click="${this.handleOverlayClick}">
          <div class="modal-content">
            <button class="close-button" @click="${this.closeModal}">×</button>
            
            <img 
              class="character-image" 
              src="${imageUrl}" 
              alt="${this.character.name}"
              @error="${(e: Event) => {
                const target = e.target as HTMLImageElement;
                target.src = CharacterUtils.getCharacterImageUrl({} as DisneyCharacter);
              }}"
            >
            
            <div class="character-name">${this.character.name}</div>
            <div>Character ID: ${this.character._id}</div>

            ${this.renderSection('Films', this.character.films)}
            ${this.renderSection('TV Shows', this.character.tvShows)}
            ${this.renderSection('Video Games', this.character.videoGames)}
            ${this.renderSection('Park Attractions', this.character.parkAttractions)}
            ${this.renderSection('Allies', this.character.allies)}
            ${this.renderSection('Enemies', this.character.enemies)}

            <div style="text-align: center; margin-top: 20px;">
              <button 
                class="favorite-btn ${isFavorited ? 'favorited' : ''}"
                @click="${this.toggleFavorite}"
              >
                ${isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
            </div>
          </div>
        </div>
      ` : ''}
    `;
  }
}
