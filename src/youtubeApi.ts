// YouTube API utility for fetching channel and search thumbnails
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

// Cache for thumbnails to avoid repeated API calls
const thumbnailCache: Record<string, string> = {};

// Extract channel identifier from URL
export function getChannelIdentifier(url: string): { type: 'username' | 'handle' | 'id' | null; value: string | null } {
    // Match /user/USERNAME
    const userMatch = url.match(/youtube\.com\/user\/([^/?]+)/);
    if (userMatch) return { type: 'username', value: userMatch[1] };

    // Match /c/CUSTOMNAME
    const customMatch = url.match(/youtube\.com\/c\/([^/?]+)/);
    if (customMatch) return { type: 'username', value: customMatch[1] };

    // Match /@HANDLE
    const handleMatch = url.match(/youtube\.com\/@([^/?]+)/);
    if (handleMatch) return { type: 'handle', value: handleMatch[1] };

    // Match /channel/CHANNEL_ID
    const channelMatch = url.match(/youtube\.com\/channel\/([^/?]+)/);
    if (channelMatch) return { type: 'id', value: channelMatch[1] };

    return { type: null, value: null };
}

// Extract search query from URL
export function getSearchQuery(url: string): string | null {
    const searchMatch = url.match(/youtube\.com\/results\?search_query=([^&]+)/);
    if (searchMatch) return decodeURIComponent(searchMatch[1].replace(/\+/g, ' '));
    return null;
}

// Check if URL is a YouTube search
export function isYouTubeSearch(url: string): boolean {
    return url.includes('youtube.com/results?search_query=');
}

// Check if URL is a YouTube channel
export function isYouTubeChannel(url: string): boolean {
    return url.includes('/user/') || url.includes('/c/') || url.includes('/@') || url.includes('/channel/');
}

import { PERMANENT_THUMBNAIL_CACHE } from './permanentCache';

// Fetch channel thumbnail from YouTube Data API
export async function fetchChannelThumbnail(url: string): Promise<string | null> {
    const { type, value } = getChannelIdentifier(url);
    if (!type || !value) return null;

    const cacheKey = `channel:${type}:${value}`;

    // 1. Check Permanent Cache (File-based)
    if (PERMANENT_THUMBNAIL_CACHE[cacheKey]) {
        return PERMANENT_THUMBNAIL_CACHE[cacheKey];
    }

    // 2. Check Runtime/Local Cache
    if (thumbnailCache[cacheKey]) {
        return thumbnailCache[cacheKey];
    }

    if (!YOUTUBE_API_KEY) {
        console.warn('YouTube API key not configured');
        return null;
    }

    try {
        let apiUrl = '';

        if (type === 'username') {
            apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(value)}&maxResults=1&key=${YOUTUBE_API_KEY}`;
        } else if (type === 'handle') {
            apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent('@' + value)}&maxResults=1&key=${YOUTUBE_API_KEY}`;
        } else if (type === 'id') {
            apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${value}&key=${YOUTUBE_API_KEY}`;
        }

        const response = await fetch(apiUrl);
        const data = await response.json();

        let thumbnailUrl: string | null = null;

        if (type === 'id' && data.items?.[0]?.snippet?.thumbnails) {
            thumbnailUrl = data.items[0].snippet.thumbnails.high?.url ||
                data.items[0].snippet.thumbnails.medium?.url ||
                data.items[0].snippet.thumbnails.default?.url;
        } else if (data.items?.[0]?.snippet?.thumbnails) {
            thumbnailUrl = data.items[0].snippet.thumbnails.high?.url ||
                data.items[0].snippet.thumbnails.medium?.url ||
                data.items[0].snippet.thumbnails.default?.url;
        }

        if (thumbnailUrl) {
            thumbnailCache[cacheKey] = thumbnailUrl;
            saveCacheToStorage();
        }

        return thumbnailUrl;
    } catch (error) {
        console.error('Error fetching channel thumbnail:', error);
        return null;
    }
}

// Fetch search result thumbnail from YouTube Data API
export async function fetchSearchThumbnail(url: string): Promise<string | null> {
    if (!YOUTUBE_API_KEY) {
        console.warn('YouTube API key not configured');
        return null;
    }

    const query = getSearchQuery(url);
    if (!query) return null;

    // Check cache first
    const cacheKey = `search:${query}`;
    if (thumbnailCache[cacheKey]) {
        return thumbnailCache[cacheKey];
    }

    try {
        // Search for videos with this query and get the first result's thumbnail
        const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=1&key=${YOUTUBE_API_KEY}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        let thumbnailUrl: string | null = null;

        if (data.items?.[0]?.snippet?.thumbnails) {
            thumbnailUrl = data.items[0].snippet.thumbnails.high?.url ||
                data.items[0].snippet.thumbnails.medium?.url ||
                data.items[0].snippet.thumbnails.default?.url;
        }

        if (thumbnailUrl) {
            thumbnailCache[cacheKey] = thumbnailUrl;
            saveCacheToStorage();
        }

        return thumbnailUrl;
    } catch (error) {
        console.error('Error fetching search thumbnail:', error);
        return null;
    }
}

// Save cache to localStorage
function saveCacheToStorage(): void {
    try {
        localStorage.setItem('youtube-thumbnails', JSON.stringify(thumbnailCache));
    } catch {
        // Ignore localStorage errors
    }
}

// Load cached thumbnails from localStorage on init
export function loadCachedThumbnails(): void {
    try {
        const stored = JSON.parse(localStorage.getItem('youtube-thumbnails') || '{}');
        Object.assign(thumbnailCache, stored);
    } catch {
        // Ignore errors
    }
}

// Get cached channel thumbnail synchronously
export function getCachedChannelThumbnail(url: string): string | null {
    const { type, value } = getChannelIdentifier(url);
    if (!type || !value) return null;
    const cacheKey = `channel:${type}:${value}`;
    return PERMANENT_THUMBNAIL_CACHE[cacheKey] || thumbnailCache[cacheKey] || null;
}

// Get cached search thumbnail synchronously
export function getCachedSearchThumbnail(url: string): string | null {
    const query = getSearchQuery(url);
    if (!query) return null;
    const cacheKey = `search:${query}`;
    return thumbnailCache[cacheKey] || null;
}
