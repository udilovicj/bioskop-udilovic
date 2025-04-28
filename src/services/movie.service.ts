import axios from "axios";

// Cache storage
const cache: Record<string, { data: any, timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const client = axios.create({
    baseURL : 'https://movie.pequla.com/api',
    headers : {
        'Accept' : 'application/json',
        'X-Client-Name' : 'BIOSKOPUDILOVIC' 
    },
    validateStatus : (status : number) => {
        return status === 200
    }
});

export class MovieService{
    // Check if data is in cache and still valid
    private static getFromCache(key: string): any {
        const cachedItem = cache[key];
        if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_DURATION) {
            return cachedItem.data;
        }
        return null;
    }

    // Store data in cache
    private static setCache(key: string, data: any): void {
        cache[key] = {
            data,
            timestamp: Date.now()
        };
    }

    static async getMovies(page: number = 0, size: number = 10) {
        const cacheKey = `movies_${page}_${size}`;
        const cachedData = this.getFromCache(cacheKey);
        
        if (cachedData) {
            return { data: cachedData };
        }

        const response = await client.request({
            url: '/movie',
            method: 'GET',
            params: {
                'page': page,
                'size': size,
                'sort': 'startDate,asc'
            }
        });
        
        this.setCache(cacheKey, response.data);
        return response;
    }

    static async getMovieById(movieId: number) {
        const cacheKey = `movie_${movieId}`;
        const cachedData = this.getFromCache(cacheKey);
        
        if (cachedData) {
            return { data: cachedData };
        }

        const response = await client.get(`/movie/${movieId}`);
        this.setCache(cacheKey, response.data);
        return response;
    }

    static async getGenres() {
        const cacheKey = 'genres';
        const cachedData = this.getFromCache(cacheKey);
        
        if (cachedData) {
            return { data: cachedData };
        }

        const response = await client.get('/genre');
        this.setCache(cacheKey, response.data);
        return response;
    }

    static async getDirectors() {
        const cacheKey = 'directors';
        const cachedData = this.getFromCache(cacheKey);
        
        if (cachedData) {
            return { data: cachedData };
        }

        const response = await client.get('/director');
        this.setCache(cacheKey, response.data);
        return response;
    }
    
    static async getActors() {
        const cacheKey = 'actors';
        const cachedData = this.getFromCache(cacheKey);
        
        if (cachedData) {
            return { data: cachedData };
        }

        const response = await client.get('/actor');
        this.setCache(cacheKey, response.data);
        return response;
    }
    
    static async getRuntimes() {
        const cacheKey = 'runtimes';
        const cachedData = this.getFromCache(cacheKey);
        
        if (cachedData) {
            return { data: cachedData };
        }

        const response = await client.get('/movie/runtimes');
        this.setCache(cacheKey, response.data);
        return response;
    }
    
    static async searchMovies(filters: any) {
        const cacheKey = `search_${JSON.stringify(filters)}`;
        const cachedData = this.getFromCache(cacheKey);
        
        if (cachedData) {
            return { data: cachedData };
        }

        const response = await client.post('/movie/search', filters);
        this.setCache(cacheKey, response.data);
        return response;
    }
}