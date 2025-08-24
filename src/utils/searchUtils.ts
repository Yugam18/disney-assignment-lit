import { DisneyCharacter } from '../types/index.js';

export function generateSearchSuggestions(
    characters: DisneyCharacter[], 
    searchTerm: string, 
    maxSuggestions: number = 10
): string[] {
    const q = searchTerm.trim().toLowerCase();
    if (!q) {
        return [];
    }
    
    const names = characters.map(c => c.name);
    const seen = new Set<string>();
    const matched: string[] = [];
    
    for (const name of names) {
        const lower = name.toLowerCase();
        if (lower.includes(q) && !seen.has(lower)) {
            seen.add(lower);
            matched.push(name);
            if (matched.length >= maxSuggestions) break;
        }
    }
    
    return matched;
}



export function formatCountText(count: number, itemName: string): string {
    return `${count} ${itemName}${count !== 1 ? 's' : ''}`;
}


export function characterMatchesSearch(character: DisneyCharacter, searchTerm: string): boolean {
    const searchLower = searchTerm.toLowerCase();

    // Check all relevant fields in a single loop for arrays
    const fieldsToCheck: (keyof DisneyCharacter)[] = [
        'name',
        'films',
        'tvShows'
    ];

    for (const field of fieldsToCheck) {
        const value = character[field];
        if (typeof value === 'string') {
            if (value.toLowerCase().includes(searchLower)) {
                return true;
            }
        } else if (Array.isArray(value)) {
            for (const item of value) {
                if (typeof item === 'string' && item.toLowerCase().includes(searchLower)) {
                    return true;
                }
            }
        }
    }

    return false;
}
