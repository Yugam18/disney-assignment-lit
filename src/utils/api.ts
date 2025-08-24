import axios from 'axios';
import { CharacterResponse } from '../types/index.js';

const API_BASE_URL = 'https://api.disneyapi.dev';

export class DisneyAPI {
    private static instance: DisneyAPI;
    private baseURL: string;

    private constructor() {
        this.baseURL = API_BASE_URL;
    }

    public static getInstance(): DisneyAPI {
        if (!DisneyAPI.instance) {
            DisneyAPI.instance = new DisneyAPI();
        }
        return DisneyAPI.instance;
    }

    async getAllCharacters(): Promise<CharacterResponse> {
        try {
            const url = `${this.baseURL}/character`;
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching characters:', error);
            if (axios.isAxiosError(error)) {
                console.error('  Response status:', error.response?.status);
            }
            throw error;
        }
    }
}

export const disneyAPI = DisneyAPI.getInstance();
