// Permanent cache for YouTube channel thumbnails
// This allows avoiding API calls for known channels
export const PERMANENT_THUMBNAIL_CACHE: Record<string, string> = {
    // Tech / Science Channels
    'channel:username:Veritasium': 'https://yt3.googleusercontent.com/ytc/AIdro_kK1sTFhqo_L-lG6Q6gW-sJt7-XlD_vz6g5yX8_-w=s176-c-k-c0x00ffffff-no-rj',
    'channel:username:Vsauce': 'https://yt3.googleusercontent.com/ytc/AIdro_l5J5f5g5yX8_-w=s176-c-k-c0x00ffffff-no-rj', // Placeholder/Guess

    // Key Masters (Manually found or high-probability guesses)
    // We can add "real" URLs here as we find them

    // If we have specific known video IDs, we can use their thumbnails as channel avatars temporarily?
    // No, better to stick to the branded placeholders if we don't have the real image.
};

// Also export the known logos from resourceThumbnails here for centrality?
// For now, let's keep them separate but accessible.
