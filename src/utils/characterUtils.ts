import { DisneyCharacter } from '../types/index.js';

export class CharacterUtils {
    private static readonly FAVORITES_KEY = 'disney_favorites';

    static getFavorites(): DisneyCharacter[] {
        try {
            const favorites = localStorage.getItem(this.FAVORITES_KEY);
            return favorites ? JSON.parse(favorites) : [];
        } catch (error) {
            console.error('Error reading favorites from localStorage:', error);
            return [];
        }
    }

    static addToFavorites(character: DisneyCharacter): void {
        try {
            const favorites = this.getFavorites();
            if (!favorites.find(fav => fav._id === character._id)) {
                favorites.push(character);
                localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
            }
        } catch (error) {
            console.error('Error adding to favorites:', error);
        }
    }

    static removeFromFavorites(characterId: number): void {
        try {
            const favorites = this.getFavorites();
            const filteredFavorites = favorites.filter(fav => fav._id !== characterId);
            localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(filteredFavorites));
        } catch (error) {
            console.error('Error removing from favorites:', error);
        }
    }

    static isFavorite(characterId: number): boolean {
        const favorites = this.getFavorites();
        return favorites.some(fav => fav._id === characterId);
    }

    static getCharacterImageUrl(character: DisneyCharacter): string {
        if (character.imageUrl) {
            return character.imageUrl;
        }
        return '';
    }

    static formatArrayData(data: string[] | undefined): string {
        if (!data || data.length === 0) return 'None';
        return data.join(', ');
    }

    static truncateText(text: string, maxLength: number = 100): string {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
}
