// Resource thumbnail utilities for websites, PDFs, books, and courses

// Cache for thumbnails
const resourceThumbnailCache: Record<string, string> = {};

// Get domain from URL
export function getDomain(url: string): string {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname;
    } catch {
        return '';
    }
}

// Get high-quality favicon URL using Google's service
export function getFaviconUrl(url: string): string {
    const domain = getDomain(url);
    if (!domain) return '';
    // Use Google's favicon service at maximum size (256px) for best quality
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
}

// Extract Amazon ASIN and get HIGH QUALITY product image
export function getAmazonProductImage(url: string): string | null {
    // Match Amazon ASIN from URL
    const asinMatch = url.match(/\/(?:dp|gp\/product|ASIN)\/([A-Z0-9]{10})/i);
    if (asinMatch) {
        const asin = asinMatch[1];
        // Use high quality Amazon image - larger size
        return `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.LZZZZZZZ.jpg`;
    }
    return null;
}

// Get Google Books cover image (high quality)
export async function getGoogleBooksCover(query: string): Promise<string | null> {
    try {
        const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1`
        );
        const data = await response.json();

        if (data.items?.[0]?.volumeInfo?.imageLinks) {
            // Try to get the highest quality available
            const links = data.items[0].volumeInfo.imageLinks;
            // Replace zoom parameters for better quality
            const bestImage = links.large || links.medium || links.thumbnail || links.smallThumbnail;
            if (bestImage) {
                return bestImage.replace('http:', 'https:').replace('&zoom=1', '&zoom=2');
            }
        }
        return null;
    } catch {
        return null;
    }
}

// Get thumbnail for a resource based on its type and URL
export function getResourceThumbnail(
    url: string,
    resourceType: string,
    _bookTitle?: string
): string | null {
    const cacheKey = `resource:${url}`;

    // Check cache
    if (resourceThumbnailCache[cacheKey]) {
        return resourceThumbnailCache[cacheKey];
    }

    // Amazon book/product links - HIGH QUALITY
    if (url.includes('amazon.com')) {
        const amazonImg = getAmazonProductImage(url);
        if (amazonImg) {
            resourceThumbnailCache[cacheKey] = amazonImg;
            return amazonImg;
        }
    }

    // Project Gutenberg - use book cover API
    if (url.includes('gutenberg.org')) {
        const ebookMatch = url.match(/ebooks\/(\d+)/);
        if (ebookMatch) {
            const thumbnail = `https://www.gutenberg.org/cache/epub/${ebookMatch[1]}/pg${ebookMatch[1]}.cover.medium.jpg`;
            resourceThumbnailCache[cacheKey] = thumbnail;
            return thumbnail;
        }
    }

    // Archive.org - try to get item thumbnail
    if (url.includes('archive.org')) {
        const itemMatch = url.match(/archive\.org\/details\/([^/?]+)/);
        if (itemMatch) {
            const thumbnail = `https://archive.org/services/img/${itemMatch[1]}`;
            resourceThumbnailCache[cacheKey] = thumbnail;
            return thumbnail;
        }
    }

    // HIGH QUALITY LOGO MAPPINGS - curated CDN/official sources
    const knownLogos: Record<string, string> = {
        // Major Tech Companies
        'google.com': 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
        'github.com': 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
        'github.io': 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
        'huggingface.co': 'https://huggingface.co/datasets/huggingface/brand-assets/resolve/main/hf-logo.png',
        'openai.com': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/OpenAI_Logo.svg/512px-OpenAI_Logo.svg.png',
        'microsoft.com': 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31',
        'arxiv.org': 'https://static.arxiv.org/static/browse/0.3.4/images/arxiv-logo-one-color-white.svg',

        // Universities
        'stanford.edu': 'https://identity.stanford.edu/wp-content/uploads/sites/3/2020/07/su-logo-red-100.png',
        'mit.edu': 'https://web.mit.edu/graphicidentity/images/mit-logo.svg',
        'ocw.mit.edu': 'https://ocw.mit.edu/static/images/mit-black-red.png',
        'berkeley.edu': 'https://brand.berkeley.edu/wp-content/uploads/2020/10/ucb-seal-blue-gold.png',
        'nyu.edu': 'https://www.nyu.edu/content/dam/nyu/hradmin/images/fea-nyu-torch-logo-2.png',
        'yale.edu': 'https://www.yale.edu/sites/default/files/images/2020-04/yalelogo.png',
        'harvard.edu': 'https://www.harvard.edu/wp-content/uploads/2021/02/harvard-logo.svg',
        'princeton.edu': 'https://www.princeton.edu/themes/pu/favicon.ico',
        'columbia.edu': 'https://visualidentity.columbia.edu/sites/default/files/styles/cu_crop/public/columbia-logo-blue.png',
        'cam.ac.uk': 'https://www.cam.ac.uk/sites/www.cam.ac.uk/files/logo.png',
        'ox.ac.uk': 'https://www.ox.ac.uk/sites/files/oxford/Oxford_logo.svg',

        // AI/ML Platforms
        'fast.ai': 'https://www.fast.ai/images/fastai_logo.png',
        'course.fast.ai': 'https://www.fast.ai/images/fastai_logo.png',
        'coursera.org': 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera_assets.s3.amazonaws.com/images/coursera-logo-full-rgb.png',
        'deepmind.com': 'https://upload.wikimedia.org/wikipedia/commons/f/f6/DeepMind_new_logo.svg',
        'kaggle.com': 'https://www.kaggle.com/static/images/site-logo.svg',

        // Research & Academic
        'nature.com': 'https://www.nature.com/static/images/logos/nature/nature-header-logo-light.svg',
        'sciencedirect.com': 'https://sdfestaticassets-us-east-1.sciencedirectassets.com/shared-assets/24/images/elsevier-non-solus.svg',
        'ieee.org': 'https://brand-experience.ieee.org/wp-content/uploads/2019/01/ieee-mb-blue.png',
        'acm.org': 'https://www.acm.org/binaries/content/gallery/acm/ctas/logo-acm.png',

        // Learning Platforms
        'khanacademy.org': 'https://cdn.kastatic.org/images/khan-logo-dark-background.new.png',
        'edx.org': 'https://edx-cdn.org/v3/prod/logo-edx-white.svg',
        'udacity.com': 'https://www.udacity.com/images/svgs/udacity-tt-logo.svg',
        'brilliant.org': 'https://brilliant.org/site_media/version-a00d10aac7/images/logo-wordmark-2020-dark.svg',

        // Other Tech
        'introtodeeplearning.com': 'https://introtodeeplearning.com/images/mit_logo_std_rgb_purple-gray.svg',
        'pytorch.org': 'https://pytorch.org/assets/images/pytorch-logo.png',
        'tensorflow.org': 'https://www.tensorflow.org/images/tf_logo_social.png',
        'keras.io': 'https://keras.io/img/logo.png',
    };

    const domain = getDomain(url);
    for (const [key, logoUrl] of Object.entries(knownLogos)) {
        if (domain.includes(key)) {
            resourceThumbnailCache[cacheKey] = logoUrl;
            return logoUrl;
        }
    }

    // For courses and websites - just use high quality favicon
    if (resourceType === 'course' || resourceType === 'website') {
        const favicon = getFaviconUrl(url);
        if (favicon) {
            return favicon;
        }
    }

    // For books without Amazon - will need async Google Books call
    if (resourceType === 'book') {
        const amazonImg = getAmazonProductImage(url);
        if (amazonImg) {
            resourceThumbnailCache[cacheKey] = amazonImg;
            return amazonImg;
        }
        return null;
    }

    return null;
}

// Async version that also checks Google Books
export async function fetchResourceThumbnail(
    url: string,
    resourceType: string,
    bookTitle?: string
): Promise<string | null> {
    // First try sync version
    const syncResult = getResourceThumbnail(url, resourceType, bookTitle);
    if (syncResult) return syncResult;

    const cacheKey = `resource:${url}`;

    // Try Google Books for book/PDF resources
    if ((resourceType === 'book' || resourceType === 'pdf') && bookTitle) {
        const googleCover = await getGoogleBooksCover(bookTitle);
        if (googleCover) {
            resourceThumbnailCache[cacheKey] = googleCover;
            saveCacheToStorage();
            return googleCover;
        }
    }

    // Fallback for PDF/Other: use favicon if we couldn't find a book cover
    if (resourceType === 'pdf' || !resourceType) {
        const favicon = getFaviconUrl(url);
        if (favicon) return favicon;
    }

    return null;
}

// Save cache to localStorage
function saveCacheToStorage(): void {
    try {
        localStorage.setItem('resource-thumbnails', JSON.stringify(resourceThumbnailCache));
    } catch {
        // Ignore
    }
}

// Load cache from localStorage
export function loadResourceThumbnailCache(): void {
    try {
        const stored = JSON.parse(localStorage.getItem('resource-thumbnails') || '{}');
        Object.assign(resourceThumbnailCache, stored);
    } catch {
        // Ignore
    }
}

// Get cached resource thumbnail
export function getCachedResourceThumbnail(url: string): string | null {
    const cacheKey = `resource:${url}`;
    return resourceThumbnailCache[cacheKey] || null;
}
