import { useState, useMemo, useEffect } from 'react';
import { Search, ExternalLink, Youtube, Globe, BookOpen, FileText, GraduationCap, Map, Library, DollarSign } from 'lucide-react';
import { RESOURCES, CATEGORIES, type Resource, type Category } from './data';
import IncomeTracker from './IncomeTracker';
import Roadmap from './Roadmap';
import {
  fetchChannelThumbnail, getCachedChannelThumbnail,
  loadCachedThumbnails, isYouTubeSearch, isYouTubeChannel
} from './youtubeApi';
import {
  getResourceThumbnail, fetchResourceThumbnail,
  getCachedResourceThumbnail, loadResourceThumbnailCache
} from './resourceThumbnails';
import './index.css';

// Load all cached thumbnails on app start
loadCachedThumbnails();
loadResourceThumbnailCache();

// Known playlist first video IDs for thumbnails
const PLAYLIST_FIRST_VIDEOS: Record<string, string> = {
  'PLAqhIrjkxbuWI23v9cThsA9GvCAUhSvMB': 'VMj-3S1tku0', // Karpathy Neural Networks
  'PLqYmG7hTraZDM-OYHWgPebj2MfCFzFObQ': '2pWv7GOvuf0', // David Silver RL
  'PL3FW7Lu3i5JvHM8ljYj-zLfQRF3EO8sYv': 'vT1JzLTH4G4', // Stanford CS231n
  'PL49CF3715CB9EF31D': 'ZK3O402wf1c', // MIT 18.06 Linear Algebra
  'PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr': 'WUvTyaaNkzM', // 3Blue1Brown Calculus
};

// Known channel representative video IDs for thumbnails (VERIFIED REAL IDs)
const CHANNEL_VIDEOS: Record<string, string> = {
  // Verified working video IDs from each channel
  'MiculekDotCom': 'lLk1SsfrDDg', // Jerry Miculek - actual video
  'HaleyStrategic': 'ONLU_l-gSX4', // Travis Haley - actual video
  'KravMagaGlobal': 'YV8BhnMJKmI', // Krav Maga Global - actual video
  'StorrorBlog': 'AIwFqWKMPe8', // Storror - actual video
  'wimhof1': '0BNejY1e9ik', // Wim Hof - official breathing video
  'survivaborman': 'OfSLqa4NTWA', // Les Stroud Survivorman
  'DecksAndContests': 'eidrvJIdoKA', // 52Kards
  'DrDaveBilliards': 'beHBW6Nv9M4', // Dr. Dave Billiards
  'Passion4dancing': '9hBoLqe9lBw', // Passion4Dancing
  'jonakashima': 'LuMkZmz1Xmg', // Jo Nakashima Origami
  'NewYorkVocalCoaching': 'ZPMlB9PnXYM', // NYVC
  'PrecisionStriking': 'FDiAc66K4AE', // Precision Striking
  'vaabormuseum': 'VYxRl02OQNg', // V&A Museum
  // /c/ style channel URLs
  'lockpickinglawyer': 'BogNGy3-K90', // Lockpicking Lawyer
  'GentlemansGazette': 'egVxdVnGkp0', // Gentleman's Gazette
  'WarriorPoetSociety': '1OADXNGnJok', // Warrior Poet
  'FrenchCookingAcademy': '2KR44a_5v_A', // French Cooking Academy
  'HowToDrink': 'FVq6b8y0n2U', // How to Drink
  'Theengineeringmindset': 'T2fjZq2Zz-g', // Engineering Mindset
  'GibiASMR': 'vy8P_eeJg8c', // Gibi ASMR
};

// Helper to extract YouTube video ID from URL
const getYouTubeVideoId = (url: string): string | null => {
  const videoPattern = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const videoMatch = url.match(videoPattern);
  if (videoMatch) return videoMatch[1];
  return null;
};

// Helper to get playlist ID
const getPlaylistId = (url: string): string | null => {
  const playlistPattern = /[?&]list=([^&\n?#]+)/;
  const match = url.match(playlistPattern);
  if (match) return match[1];
  return null;
};

// Helper to get channel username from URL
const getChannelUsername = (url: string): string | null => {
  // Match /user/USERNAME or /c/USERNAME or /@USERNAME
  const patterns = [
    /youtube\.com\/user\/([^/?]+)/,
    /youtube\.com\/c\/([^/?]+)/,
    /youtube\.com\/@([^/?]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

// Helper to get YouTube thumbnail - works for videos, playlists, and channels
const getYouTubeThumbnail = (url: string): string | null => {
  // Try direct video ID first
  const videoId = getYouTubeVideoId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  }

  // Try playlist - check if we have the first video ID
  const playlistId = getPlaylistId(url);
  if (playlistId && PLAYLIST_FIRST_VIDEOS[playlistId]) {
    return `https://img.youtube.com/vi/${PLAYLIST_FIRST_VIDEOS[playlistId]}/mqdefault.jpg`;
  }

  // Try channel - check if we have a representative video
  const channelUsername = getChannelUsername(url);
  if (channelUsername && CHANNEL_VIDEOS[channelUsername]) {
    return `https://img.youtube.com/vi/${CHANNEL_VIDEOS[channelUsername]}/mqdefault.jpg`;
  }

  return null;
};

// Resource Card Component
function ResourceCard({ resource }: { resource: Resource }) {
  const [imgError, setImgError] = useState(false);
  // Determine resource characteristics
  const isChannel = isYouTubeChannel(resource.resourceUrl);
  const isSearch = isYouTubeSearch(resource.resourceUrl);

  // 1. Try to get thumbnail synchronously from cache or utilities (Instant)
  const syncThumbnail = useMemo(() => {
    if (resource.resourceType === 'youtube') {
      if (isChannel) return getCachedChannelThumbnail(resource.resourceUrl);
      return null;
    } else {
      // For non-YouTube, check cache or generate from utility
      return getCachedResourceThumbnail(resource.resourceUrl) ||
        getResourceThumbnail(resource.resourceUrl, resource.resourceType, resource.bookOrCourse);
    }
  }, [resource.resourceUrl, resource.resourceType, resource.bookOrCourse, isChannel]);

  // 2. State for asynchronously fetched thumbnail
  const [asyncThumbnail, setAsyncThumbnail] = useState<string | null>(null);

  // 3. Final thumbnail to display
  const apiThumbnail = asyncThumbnail || syncThumbnail;

  // Fetch thumbnails asynchronously if needed
  useEffect(() => {
    // If we already have a sync thumbnail, no need to fetch (unless we want to upgrade it?)
    // For now, assume sync/cached is sufficient.
    if (syncThumbnail) {
      setAsyncThumbnail(null); // Reset async state if sync matches (or just do nothing)
      return;
    }

    setAsyncThumbnail(null); // Reset on resource change

    if (resource.resourceType === 'youtube') {
      // Only fetch channel thumbnails (uses API quota)
      if (isChannel) {
        fetchChannelThumbnail(resource.resourceUrl).then(url => {
          if (url) setAsyncThumbnail(url);
        });
      }
    } else {
      // Non-YouTube resources - try async fetch (e.g. Google Books)
      fetchResourceThumbnail(resource.resourceUrl, resource.resourceType, resource.bookOrCourse).then(url => {
        if (url) setAsyncThumbnail(url);
      });
    }
  }, [resource.resourceUrl, resource.resourceType, resource.bookOrCourse, isChannel, syncThumbnail]);

  const getInitials = (name: string) => {
    return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  };

  const getTypeIcon = () => {
    switch (resource.resourceType) {
      case 'youtube': return <Youtube size={14} />;
      case 'website': return <Globe size={14} />;
      case 'book': return <BookOpen size={14} />;
      case 'pdf': return <FileText size={14} />;
      case 'course': return <GraduationCap size={14} />;
      default: return <Globe size={14} />;
    }
  };

  const getTypeLabel = () => {
    switch (resource.resourceType) {
      case 'youtube': return 'YouTube';
      case 'website': return 'Website';
      case 'book': return 'Book';
      case 'pdf': return 'PDF';
      case 'course': return 'Course';
      default: return 'Resource';
    }
  };

  const thumbnail = resource.resourceType === 'youtube' ? getYouTubeThumbnail(resource.resourceUrl) : null;
  // Use API thumbnail (channel or search) if available
  const finalThumbnail = apiThumbnail || thumbnail;
  const isPlaylist = resource.resourceUrl.includes('playlist');

  const getYouTubeLabel = () => {
    if (isPlaylist) return 'Playlist';
    if (isSearch) return 'Search';
    if (isChannel) return 'Channel';
    return 'Video';
  };

  return (
    <a
      href={resource.resourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none' }}
    >
      <div className={`resource-card ${resource.resourceType}`}>
        {/* Preview */}
        <div className="card-preview">
          {/* YouTube with thumbnail */}
          {resource.resourceType === 'youtube' && finalThumbnail && !imgError ? (
            <>
              <img
                src={finalThumbnail}
                alt={resource.freeResource}
                onError={() => setImgError(true)}
              />
              <div className="youtube-play-btn" />
            </>
          ) : resource.resourceType === 'youtube' ? (
            /* YouTube without thumbnail - Apple style branded placeholder */
            <div className="preview-placeholder youtube-branded">
              <span className="master-initials">{getInitials(resource.master)}</span>
              <span className="master-name">{resource.master.split('(')[0].trim()}</span>
              <span className="resource-type-label">{getYouTubeLabel()}</span>
            </div>
          ) : apiThumbnail && !imgError ? (
            /* Non-YouTube with thumbnail */
            <img
              src={apiThumbnail}
              alt={resource.freeResource}
              onError={() => setImgError(true)}
              className="resource-thumbnail"
            />
          ) : (
            /* Fallback placeholder for all other resources */
            <div className="preview-placeholder resource-branded">
              <span className="master-initials">{getInitials(resource.master)}</span>
              <span className="master-name">{resource.master.split('(')[0].trim()}</span>
              <span className="resource-type-label">{getTypeLabel()}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="card-content">
          <span className="card-skill">{resource.skill}</span>

          <h3 className="card-title">{resource.bookOrCourse || resource.freeResource}</h3>

          <div className="card-master">
            <span className="card-master-avatar">{getInitials(resource.master)}</span>
            <span>{resource.master}</span>
          </div>

          <p className="card-why">{resource.why}</p>

          <div className="card-footer">
            <span className="card-type">
              {getTypeIcon()}
              {getTypeLabel()}
            </span>
            <span className="card-link">
              Open <ExternalLink size={12} />
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

// Section Component
function Section({
  category,
  resources
}: {
  category: Category;
  resources: Resource[];
}) {
  if (resources.length === 0) return null;

  return (
    <div className="section">
      <div className="section-header">
        <div className={`section-icon ${category.id}`}>
          <span>{category.emoji}</span>
        </div>
        <h2 className="section-title">{category.name}</h2>
        <span className="section-count">{resources.length} resources</span>
      </div>
      <div className="resource-grid">
        {resources.map(resource => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  );
}

// Main App
function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeView, setActiveView] = useState<'resources' | 'roadmap' | 'income'>('resources');

  // Filter resources based on search and category
  const filteredResources = useMemo(() => {
    let results = RESOURCES;

    // Filter by category
    if (activeCategory === 'books') {
      results = results.filter(r => r.resourceType === 'book' || r.resourceType === 'pdf');
    } else if (activeCategory !== 'all') {
      results = results.filter(r => r.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(r =>
        r.skill.toLowerCase().includes(query) ||
        r.master.toLowerCase().includes(query) ||
        r.bookOrCourse.toLowerCase().includes(query) ||
        r.freeResource.toLowerCase().includes(query) ||
        r.why.toLowerCase().includes(query)
      );
    }

    return results;
  }, [searchQuery, activeCategory]);

  // Group resources by category
  const groupedResources = useMemo(() => {
    const groups: Record<string, Resource[]> = {};

    if (activeCategory === 'all') {
      // Group by category
      CATEGORIES.filter(c => c.id !== 'all').forEach(cat => {
        groups[cat.id] = filteredResources.filter(r => r.category === cat.id);
      });
    } else {
      // Single category
      groups[activeCategory] = filteredResources;
    }

    return groups;
  }, [filteredResources, activeCategory]);

  // Stats
  const totalResources = RESOURCES.length;
  const totalYouTube = RESOURCES.filter(r => r.resourceType === 'youtube').length;
  const totalBooks = RESOURCES.filter(r => r.resourceType === 'book' || r.resourceType === 'pdf').length;
  const totalCategories = CATEGORIES.filter(c => c.id !== 'all').length;

  return (
    <div className="app-container">
      {/* Floating Navigation Bar */}
      <nav className="nav-bar">
        <button
          className={`nav-item ${activeView === 'resources' ? 'active' : ''}`}
          onClick={() => setActiveView('resources')}
        >
          <Library size={18} />
          <span>Resources</span>
        </button>
        <button
          className={`nav-item ${activeView === 'roadmap' ? 'active' : ''}`}
          onClick={() => setActiveView('roadmap')}
        >
          <Map size={18} />
          <span>Roadmap</span>
        </button>
        <button
          className={`nav-item ${activeView === 'income' ? 'active' : ''}`}
          onClick={() => setActiveView('income')}
        >
          <DollarSign size={18} />
          <span>Income</span>
        </button>
      </nav>

      {/* Conditional Content Based on Active View */}
      {activeView === 'roadmap' ? (
        <Roadmap />
      ) : activeView === 'income' ? (
        <IncomeTracker />
      ) : (
        <>
          {/* Header */}
          <header className="header">
            <div className="header-badge">
              <span className="dot" />
              <span>{totalResources} resources curated</span>
            </div>
            <h1>Elite Resources</h1>
            <p className="header-subtitle">
              Hand-picked learning paths from the world's masters.
              Every skill, every resource, completely free.
            </p>
          </header>

          {/* Stats Pills */}
          <div className="stats-bar">
            <div className="stat-pill">
              <div className="stat-icon blue">
                <Youtube size={16} />
              </div>
              <span className="stat-value">{totalYouTube}</span>
              <span className="stat-label">Videos</span>
            </div>
            <div className="stat-pill">
              <div className="stat-icon orange">
                <BookOpen size={16} />
              </div>
              <span className="stat-value">{totalBooks}</span>
              <span className="stat-label">Books & PDFs</span>
            </div>
            <div className="stat-pill">
              <div className="stat-icon purple">
                <GraduationCap size={16} />
              </div>
              <span className="stat-value">{totalCategories}</span>
              <span className="stat-label">Categories</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="search-container">
            <div className="search-bar">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search skills, masters, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="search-shortcut">
                <span>⌘</span>
                <span>K</span>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="category-tabs-container">
            <div className="category-tabs">
              {CATEGORIES.map(category => {
                const count = category.id === 'all'
                  ? totalResources
                  : category.id === 'books'
                    ? RESOURCES.filter(r => r.resourceType === 'book' || r.resourceType === 'pdf').length
                    : RESOURCES.filter(r => r.category === category.id).length;
                return (
                  <button
                    key={category.id}
                    className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <span className="emoji">{category.emoji}</span>
                    <span>{category.name}</span>
                    <span className="count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Count */}
          {searchQuery && (
            <p style={{
              textAlign: 'center',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-6)',
              fontSize: '0.9375rem'
            }}>
              Found <strong>{filteredResources.length}</strong> results for "{searchQuery}"
            </p>
          )}

          {/* Content */}
          {filteredResources.length === 0 ? (
            <div className="empty-state">
              <Search size={64} />
              <h3>No resources found</h3>
              <p>Try adjusting your search or selecting a different category</p>
            </div>
          ) : activeCategory === 'all' ? (
            // Grouped by category
            CATEGORIES.filter(c => c.id !== 'all' && c.id !== 'books').map(category => {
              const categoryResources = groupedResources[category.id] || [];
              if (categoryResources.length === 0) return null;
              return (
                <Section
                  key={category.id}
                  category={category}
                  resources={categoryResources}
                />
              );
            })
          ) : (
            // Single category
            <Section
              category={CATEGORIES.find(c => c.id === activeCategory)!}
              resources={filteredResources}
            />
          )}
        </>
      )}

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: 'var(--space-12) var(--space-6)',
        color: 'var(--text-tertiary)',
        fontSize: '0.875rem'
      }}>
        <p>Made with ❤️ for lifelong learners</p>
      </footer>
    </div>
  );
}

export default App;
