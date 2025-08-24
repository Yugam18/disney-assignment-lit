export interface DisneyCharacter {
    _id: number;
    name: string;
    imageUrl?: string;
    films?: string[];
    tvShows?: string[];
    videoGames?: string[];
    parkAttractions?: string[];
    allies?: string[];
    enemies?: string[];
}

export interface CharacterResponse {
    data: DisneyCharacter[];
    count: number;
    totalPages: number;
    previousPage: string | null;
    nextPage: string | null;
}

export interface SearchFilters {
    name?: string;
    films?: string[];
    tvShows?: string[];
    videoGames?: string[];
}
