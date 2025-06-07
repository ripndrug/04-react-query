import axios from 'axios';
import { type Movie } from '../types/movie';

interface MovieResProps {
    results: Movie[],
    total_pages: number,
}

const API_URL = 'https://api.themoviedb.org/3/search/movie';

export default async function fetchData(newTopic: string, page: number): Promise<MovieResProps> {
    const response = await axios.get<MovieResProps>(API_URL, {
        params: {
            query: newTopic,
            page,
        },
        headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`
        }
    })

    return response.data;
}