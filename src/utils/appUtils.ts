import { DisneyCharacter, SearchFilters } from '../types/index.js';
import { characterMatchesSearch } from './searchUtils.js';

export function filterCharacters(
    loadedCharacters: DisneyCharacter[],
    searchTerm: string,
    filters: SearchFilters
): DisneyCharacter[] {
    if (loadedCharacters.length === 0) return [];

    let filtered = [...loadedCharacters];

    if (searchTerm.trim()) {
        filtered = filtered.filter(character => 
            characterMatchesSearch(character, searchTerm)
        );
    }

    if (filters.films && filters.films.length > 0) {
        filtered = filtered.filter(character =>
            character.films && character.films.some(film =>
                filters.films!.some(selectedFilm =>
                    film.toLowerCase().includes(selectedFilm.toLowerCase())
                )
            )
        );
    }

    if (filters.tvShows && filters.tvShows.length > 0) {
        filtered = filtered.filter(character =>
            character.tvShows && character.tvShows.some(tv =>
                filters.tvShows!.some(selectedShow =>
                    tv.toLowerCase().includes(selectedShow.toLowerCase())
                )
            )
        );
    }

    if (filters.videoGames && filters.videoGames.length > 0) {
        filtered = filtered.filter(character =>
            character.videoGames && character.videoGames.some(game =>
                filters.videoGames!.some(selectedGame =>
                    game.toLowerCase().includes(selectedGame.toLowerCase())
                )
            )
        );
    }

    return filtered;
}

export function parseStateFromURL(): { searchTerm: string; filters: SearchFilters } {
    const urlParams = new URLSearchParams(window.location.search);

    let searchTerm = '';
    const filters: SearchFilters = {};

    const nameParam = urlParams.get('name');
    if (nameParam) {
        searchTerm = nameParam;
        filters.name = nameParam;
    }

    const filmsParam = urlParams.get('films');
    const tvShowsParam = urlParams.get('tvShows');
    const videoGamesParam = urlParams.get('videoGames');

    if (filmsParam) filters.films = filmsParam.split(',');
    if (tvShowsParam) filters.tvShows = tvShowsParam.split(',');
    if (videoGamesParam) filters.videoGames = videoGamesParam.split(',');

    return { searchTerm, filters };
}

export function updateURLWithState(searchTerm: string, filters: SearchFilters): void {
    const url = new URL(window.location.href);
    const params = url.searchParams;

    params.delete('name');
    params.delete('films');
    params.delete('tvShows');
    params.delete('videoGames');
    params.delete('page');
    params.delete('pageSize');

    if (searchTerm.trim()) {
        params.set('name', searchTerm.trim());
    }

    if (filters.films && filters.films.length > 0) {
        params.set('films', filters.films.join(','));
    }

    if (filters.tvShows && filters.tvShows.length > 0) {
        params.set('tvShows', filters.tvShows.join(','));
    }

    if (filters.videoGames && filters.videoGames.length > 0) {
        params.set('videoGames', filters.videoGames.join(','));
    }

    const newURL = url.toString();
    window.history.pushState({}, '', newURL);
}


