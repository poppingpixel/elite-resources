import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import { Maximize2, Minimize2 } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Repo {
  id: string;
  name: string;
  description: string;
  file: string;
  icon: string;
  color: string;
  accent: string;
  tags: string[];
  githubUrl: string;
  stats: { stars: string; topics: string; type: string };
}

interface Section {
  id: string;
  title: string;
  level: number;
  element?: HTMLElement;
}

// ─── Helper for Client-Side HTML Processing ───────────────────────────────────
function processHtml(html: string, baseUrl: string): string {
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

  // Parse HTML using DOMParser to make robust manipulations
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Process all image elements
  const imgs = doc.querySelectorAll('img');
  imgs.forEach(img => {
    let src = img.getAttribute('src') || '';
    
    // Resolve relative path to absolute
    if (src && !src.startsWith('http') && !src.startsWith('/') && !src.startsWith('data:')) {
      // Remove leading ./ if present
      if (src.startsWith('./')) {
        src = src.substring(2);
      }
      img.setAttribute('src', `${cleanBaseUrl}${src}`);
    }

    // Add CSS class for transition
    img.classList.add('cs-image');

    // Add onload handler to fade in smoothly
    const currentOnload = img.getAttribute('onload') || '';
    if (!currentOnload.includes('loaded')) {
      img.setAttribute('onload', `${currentOnload}; this.classList.add('loaded');`.replace(/^;/, ''));
    }

    // Add onerror handler to hide figure or handle broken images nicely
    const currentOnerror = img.getAttribute('onerror') || '';
    if (!currentOnerror.includes('style.display')) {
      img.setAttribute('onerror', `${currentOnerror}; if(this.parentElement && this.parentElement.tagName === 'FIGURE') this.parentElement.style.display='none';`.replace(/^;/, ''));
    }
  });

  return doc.body.innerHTML;
}

function rewriteUrlForEmbedding(url: string): string {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname;
    
    // Check for standard YouTube playlist
    const playlistId = parsed.searchParams.get('list');
    if (host.includes('youtube.com') && parsed.pathname.includes('/playlist') && playlistId) {
      return `https://www.youtube.com/embed/videoseries?list=${playlistId}`;
    }
    
    // Check for standard video watch or video inside a playlist
    if (host.includes('youtube.com') && parsed.pathname.includes('/watch')) {
      const videoId = parsed.searchParams.get('v');
      if (videoId) {
        if (playlistId) {
          // Embed the specific video and attach the playlist queue inside the player context
          return `https://www.youtube.com/embed/${videoId}?list=${playlistId}`;
        }
        return `https://www.youtube.com/embed/${videoId}`;
      }
    } else if (host.includes('youtu.be')) {
      const videoId = parsed.pathname.substring(1);
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
  } catch {}
  return url;
}

function getBestModeForUrl(url: string): 'proxy' | 'google' | 'archive' | 'direct' {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    
    // Direct embed for youtube/vimeo/etc.
    if (host.includes('youtube.com') || host.includes('youtu.be') || host.includes('vimeo.com')) {
      return 'direct';
    }
    
    // Known framing-blockers or heavy SPA sites
    if (host.includes('coursera.org') || host.includes('coursera.com') || host.includes('github.com') || host.includes('gist.github.com') || host.includes('medium.com') || host.includes('topcoder.com')) {
      return 'google';
    }
    
    // Check extension
    const path = parsed.pathname.toLowerCase();
    if (path.endsWith('.pdf') || path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.gif') || path.endsWith('.svg')) {
      return 'direct';
    }
    
    // Default to Web Proxy
    return 'proxy';
  } catch {
    return 'proxy';
  }
}

function proxyRewriteHtml(html: string, originalUrl: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const base = new URL(originalUrl);

  const resolve = (relPath: string, bypassCors = false) => {
    try {
      if (!relPath) return relPath;
      if (relPath.startsWith('data:')) return relPath;
      
      let absUrl = relPath;
      if (!relPath.startsWith('http') && !relPath.startsWith('//')) {
        absUrl = new URL(relPath, base).href;
      } else if (relPath.startsWith('//')) {
        absUrl = `https:${relPath}`;
      }
      
      if (bypassCors) {
        return `https://corsproxy.io/?url=${encodeURIComponent(absUrl)}`;
      }
      return absUrl;
    } catch {
      return relPath;
    }
  };

  // Rewrite styles - route through Cloudflare Edge proxy to guarantee CORS bypass & perfect styling
  doc.querySelectorAll('link[rel="stylesheet"], link[as="style"]').forEach(el => {
    const href = el.getAttribute('href');
    if (href) {
      el.setAttribute('href', resolve(href, true));
    }
  });

  // Also catch generic link tags pointing to stylesheets
  doc.querySelectorAll('link[href]').forEach(el => {
    const href = el.getAttribute('href') || '';
    if (href.includes('.css') || el.getAttribute('rel') === 'stylesheet') {
      el.setAttribute('href', resolve(href, true));
    } else {
      el.setAttribute('href', resolve(href, false));
    }
  });

  // Rewrite images - route through CORS proxy to bypass security blocks on external images
  doc.querySelectorAll('img[src]').forEach(el => {
    const src = el.getAttribute('src');
    if (src) el.setAttribute('src', resolve(src, true));
  });
  doc.querySelectorAll('img[data-src]').forEach(el => {
    const src = el.getAttribute('data-src');
    if (src) el.setAttribute('src', resolve(src, true));
  });

  // Rewrite links
  doc.querySelectorAll('a[href]').forEach(el => {
    const href = el.getAttribute('href');
    if (href) el.setAttribute('href', resolve(href, false));
  });

  // Rewrite forms
  doc.querySelectorAll('form[action]').forEach(el => {
    const action = el.getAttribute('action');
    if (action) el.setAttribute('action', resolve(action, false));
  });

  // STRIP ALL SCRIPTS (Clean Reader Mode):
  // Removing JS prevents complex SPAs from double-rendering, triggering CORS errors on internal APIs, or throwing dynamic chunk exceptions.
  doc.querySelectorAll('script').forEach(el => el.remove());

  // Inject in-iframe navigation interceptor script
  const scriptEl = doc.createElement('script');
  scriptEl.textContent = `
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
          e.preventDefault();
          try {
            const absoluteUrl = new URL(href, document.baseURI || window.location.href).href;
            window.parent.postMessage({ type: 'iframe_navigate', url: absoluteUrl }, '*');
          } catch(err) {
            window.parent.postMessage({ type: 'iframe_navigate', url: href }, '*');
          }
        }
      }
    });
  `;
  doc.body.appendChild(scriptEl);

  // Set base element to target URL so other relative assets resolve to original site
  let baseEl = doc.querySelector('base');
  if (!baseEl) {
    baseEl = doc.createElement('base');
    doc.head.insertBefore(baseEl, doc.head.firstChild);
  }
  baseEl.setAttribute('href', originalUrl);

  return doc.documentElement.outerHTML;
}

// ─── Memoized Reading Panel Component ─────────────────────────────────────────
interface ReadingPanelProps {
  markdownHtml: string;
  loading: boolean;
  activeRepo: Repo;
  contentRef: React.RefObject<HTMLDivElement | null>;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  onContentClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  progressFillRef: React.RefObject<HTMLDivElement | null>;
}

const ReadingPanel = memo(({
  markdownHtml,
  loading,
  activeRepo,
  contentRef,
  scrollContainerRef,
  onContentClick,
  progressFillRef
}: ReadingPanelProps) => {
  return (
    <div className="cs-content-wrap">
      <div className="cs-read-progress-bar">
        <div ref={progressFillRef} className="cs-read-progress-fill" style={{ width: '0%', background: activeRepo.accent }} />
      </div>
      <div className="cs-scroll-area" ref={scrollContainerRef}>
        {loading ? (
          <div className="cs-loading">
            <div className="cs-spinner" style={{ borderTopColor: activeRepo.accent }} />
            <span style={{ fontSize: 14 }}>Loading {activeRepo.name}…</span>
          </div>
        ) : (
          <div
            className="cs-content-inner"
            ref={contentRef}
            dangerouslySetInnerHTML={{ __html: markdownHtml }}
            onClick={onContentClick}
          />
        )}
      </div>
    </div>
  );
});

ReadingPanel.displayName = 'ReadingPanel';

// ─── Repos Config ─────────────────────────────────────────────────────────────
const REPOS: Repo[] = [
  {
    id: 'ciu',
    name: 'Coding Interview University',
    description: 'A complete study plan to become a software engineer at a top tech company',
    file: 'coding-interview-university.md',
    icon: '🎓',
    color: 'from-violet-600 to-purple-700',
    accent: '#a78bfa',
    tags: ['CS Fundamentals', 'Algorithms', 'Data Structures', 'Interview Prep'],
    githubUrl: 'https://github.com/jwasham/coding-interview-university',
    stats: { stars: '310K+', topics: '50+ Topics', type: 'Study Plan' },
  },
  {
    id: 'fullstack',
    name: 'Become A Full Stack Dev',
    description: '100+ free resources for learning Full Stack Web Development from scratch',
    file: 'become-fullstack.md',
    icon: '🌐',
    color: 'from-blue-600 to-cyan-600',
    accent: '#38bdf8',
    tags: ['HTML/CSS', 'JavaScript', 'Node.js', 'React', 'APIs'],
    githubUrl: 'https://github.com/bmorelli25/Become-A-Full-Stack-Web-Developer',
    stats: { stars: '17K+', topics: '21 Sections', type: 'Resource List' },
  },
  {
    id: 'websites',
    name: 'Best Dev Websites',
    description: 'A curated collection of the best websites every programmer should know',
    file: 'best-websites.md',
    icon: '🔖',
    color: 'from-emerald-600 to-teal-600',
    accent: '#34d399',
    tags: ['News', 'Tools', 'Challenges', 'Learning', 'Career'],
    githubUrl: 'https://github.com/sdmg15/Best-websites-a-programmer-should-visit',
    stats: { stars: '60K+', topics: '33 Categories', type: 'Curated List' },
  },
  {
    id: 'react',
    name: 'Awesome React',
    description: 'A collection of awesome things regarding the React ecosystem',
    file: 'awesome-react.md',
    icon: '⚛️',
    color: 'from-sky-500 to-blue-600',
    accent: '#60a5fa',
    tags: ['React', 'React Native', 'Libraries', 'Tools', 'Components'],
    githubUrl: 'https://github.com/enaqx/awesome-react',
    stats: { stars: '68K+', topics: '25+ Sections', type: 'Awesome List' },
  },
  {
    id: 'buildx',
    name: 'Build Your Own X',
    description: 'Master any technology by building it yourself from scratch',
    file: 'build-your-own-x.md',
    icon: '🔨',
    color: 'from-orange-500 to-red-600',
    accent: '#fb923c',
    tags: ['Projects', 'Systems', 'From Scratch', 'All Languages'],
    githubUrl: 'https://github.com/codecrafters-io/build-your-own-x',
    stats: { stars: '330K+', topics: '30+ Technologies', type: 'Project Guide' },
  },
  {
    id: 'p1xt',
    name: 'P1xt Guides',
    description: 'Deep, highly structured paths for learning CS and programming from scratch',
    file: 'p1xt-guides.md',
    icon: '📚',
    color: 'from-amber-500 to-yellow-600',
    accent: '#f59e0b',
    tags: ['Guides', 'Learning Paths', 'CS & Math', 'Projects'],
    githubUrl: 'https://github.com/P1xt/p1xt-guides',
    stats: { stars: '18K+', topics: '4 Tracks', type: 'Curated Path' },
  },
  {
    id: 'pbl',
    name: 'Project Based Learning',
    description: 'A list of programming tutorials in which learners build an application from scratch',
    file: 'project-based-learning.md',
    icon: '🚀',
    color: 'from-fuchsia-500 to-pink-600',
    accent: '#d946ef',
    tags: ['Projects', 'Tutorials', 'Build from scratch', 'Multi-language'],
    githubUrl: 'https://github.com/practical-tutorials/project-based-learning',
    stats: { stars: '170K+', topics: '25 Languages', type: 'Tutorial List' },
  },
  {
    id: 'sdp',
    name: 'System Design Primer',
    description: 'Learn how to design large-scale systems. Prep for the system design interview',
    file: 'system-design-primer.md',
    icon: '🏗️',
    color: 'from-rose-500 to-red-600',
    accent: '#f43f5e',
    tags: ['System Design', 'Scalability', 'Interview Prep', 'Architecture'],
    githubUrl: 'https://github.com/donnemartin/system-design-primer',
    stats: { stars: '270K+', topics: '50+ Topics', type: 'Study Guide' },
  },
  {
    id: 'vasanth',
    name: 'SE Study Guide',
    description: 'Software Engineering Study Guide for developers scaling their backend systems',
    file: 'vasanth-study-guide.md',
    icon: '📑',
    color: 'from-indigo-500 to-blue-600',
    accent: '#6366f1',
    tags: ['SE Fundamentals', 'Scaling', 'Load Balancing', 'Concurrency'],
    githubUrl: 'https://gist.github.com/vasanthk/485d1c25737e8e72759f',
    stats: { stars: '10K+', topics: '10 Sections', type: 'Study Gist' },
  },
];

// ─── localStorage helpers ─────────────────────────────────────────────────────
const STORAGE_KEY = 'cs_dev_hub_v1';
interface StorageState {
  activeRepoId: string;
  checkboxes: Record<string, boolean>;
  scrollPositions: Record<string, number>;
  focusMode: boolean;
}
function loadState(): StorageState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { activeRepoId: 'ciu', checkboxes: {}, scrollPositions: {}, focusMode: false };
}
function saveState(s: StorageState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

// ─── Configure marked + highlight.js ─────────────────────────────────────────
function configureMarked() {
  const renderer = new marked.Renderer();

  // Code blocks with syntax highlighting
  renderer.code = ({ text, lang }: { text: string; lang?: string }) => {
    const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
    let highlighted = text;
    try {
      highlighted = hljs.highlight(text, { language, ignoreIllegals: true }).value;
    } catch {}
    return `<pre class="cs-code-block" data-lang="${language}"><div class="cs-code-header"><span class="cs-lang-tag">${language}</span><button class="cs-copy-btn" onclick="(function(btn){var code=btn.closest('pre').querySelector('code');navigator.clipboard&&navigator.clipboard.writeText(code?code.innerText:'').then(function(){btn.textContent='✓ Copied';setTimeout(function(){btn.textContent='Copy'},1500)});})(this)">Copy</button></div><code class="hljs language-${language}">${highlighted}</code></pre>`;
  };

  // Inline code
  renderer.codespan = ({ text }: { text: string }) =>
    `<code class="cs-inline-code">${text}</code>`;

  // Links - open external in new tab
  renderer.link = ({ href, title, text }: { href: string; title?: string | null; text: string }) => {
    const isExternal = href && (href.startsWith('http') || href.startsWith('//'));
    const safeHref = href || '#';
    const titleAttr = title ? ` title="${title}"` : '';
    const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${safeHref}"${titleAttr}${target} class="cs-link">${text}</a>`;
  };

  // Images
  renderer.image = ({ href, title, text }: { href: string; title?: string | null; text: string }) => {
    if (!href) return '';
    const safeHref = href.startsWith('http') ? href : href;
    const titleAttr = title ? ` title="${title}"` : '';
    return `<figure class="cs-figure"><img src="${safeHref}" alt="${text || ''}"${titleAttr} class="cs-image" loading="lazy" onerror="this.parentElement.style.display='none'" />${text ? `<figcaption class="cs-caption">${text}</figcaption>` : ''}</figure>`;
  };

  // Headings with anchor IDs
  renderer.heading = ({ text, depth }: { text: string; depth: number }) => {
    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
    const tag = `h${depth}`;
    return `<${tag} id="${id}" class="cs-heading cs-h${depth}">${text}<a class="cs-anchor" href="#${id}" aria-hidden="true">#</a></${tag}>`;
  };

  // Blockquotes
  renderer.blockquote = ({ tokens }: { tokens: any[] }) => {
    const body = tokens.map((t: any) => t.raw || '').join('');
    return `<blockquote class="cs-blockquote">${marked.parse(body)}</blockquote>`;
  };

  // Tables
  renderer.table = ({ header, rows }: { header: any[]; rows: any[][] }) => {
    const headerCells = header.map((h: any) =>
      `<th class="cs-th">${h.tokens?.map((t: any) => t.raw || '').join('') || ''}</th>`
    ).join('');
    const bodyRows = rows.map((row: any[]) =>
      `<tr>${row.map((cell: any) => `<td class="cs-td">${cell.tokens?.map((t: any) => t.raw || '').join('') || ''}</td>`).join('')}</tr>`
    ).join('');
    return `<div class="cs-table-wrap"><table class="cs-table"><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table></div>`;
  };

  // Checkboxes (GFM task lists)
  renderer.listitem = function(this: any, item: any) {
    if (item.task) {
      const checkId = `cb-${Math.random().toString(36).slice(2, 8)}`;
      const checkedAttr = item.checked ? ' checked' : '';
      const cleanTokens = item.tokens.filter((t: any) => t.type !== 'checkbox');
      const contentHtml = this.parser.parse(cleanTokens);
      return `<li class="cs-task-item"><label class="cs-checkbox-label"><input type="checkbox"${checkedAttr} class="cs-checkbox" data-task-id="${checkId}" /><span class="cs-checkbox-custom"></span><span class="cs-task-text">${contentHtml}</span></label></li>`;
    }
    const contentHtml = this.parser.parse(item.tokens);
    return `<li class="cs-list-item">${contentHtml}</li>`;
  };

  // HR
  renderer.hr = () => `<hr class="cs-hr" />`;

  marked.use({ renderer, gfm: true, breaks: false });
}
configureMarked();

// ─── Section extractor from rendered HTML ────────────────────────────────────
function extractSections(html: string): Section[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const headings = doc.querySelectorAll('h1,h2,h3,h4');
  const sections: Section[] = [];
  headings.forEach((h) => {
    const level = parseInt(h.tagName[1]);
    const id = h.id || h.textContent?.toLowerCase().replace(/\s+/g, '-') || '';
    const title = h.textContent?.replace(/\s*#\s*$/, '').trim() || '';
    if (title && sections.length < 120) {
      sections.push({ id, title, level });
    }
  });
  return sections;
}

// ─── Reading progress calculator ─────────────────────────────────────────────
function calcReadProgress(el: HTMLElement): number {
  const { scrollTop, scrollHeight, clientHeight } = el;
  if (scrollHeight <= clientHeight) return 100;
  return Math.min(100, Math.round((scrollTop / (scrollHeight - clientHeight)) * 100));
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CsDevHub() {
  const [state, setState] = useState<StorageState>(loadState);
  const [markdownHtml, setMarkdownHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSection, setActiveSection] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [totalCheckboxes, setTotalCheckboxes] = useState(0);
  const [completedCheckboxes, setCompletedCheckboxes] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [browserUrl, setBrowserUrl] = useState<string | null>(null);
  const [browserIsMaximized, setBrowserIsMaximized] = useState(false);
  const [iframeSrc, setIframeSrc] = useState<string>('');
  const [iframeSrcDoc, setIframeSrcDoc] = useState<string>('');
  const [iframeLoading, setIframeLoading] = useState(false);
  const [browserViewMode, setBrowserViewMode] = useState<'proxy' | 'google' | 'archive' | 'direct'>('proxy');
  const [browserHistory, setBrowserHistory] = useState<string[]>([]);
  const [browserHistoryIndex, setBrowserHistoryIndex] = useState<number>(-1);
  const [iframeDomLoading, setIframeDomLoading] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Performance optimized refs to bypass React state updates on scroll
  const progressFillRef = useRef<HTMLDivElement>(null);
  const progressFillToolbarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const activeSectionRef = useRef('');
  const scrollPositionsRef = useRef<Record<string, number>>({});

  const activeRepo = REPOS.find(r => r.id === state.activeRepoId) || REPOS[0];

  // Persist state
  useEffect(() => { saveState(state); }, [state]);

  // Handle in-iframe navigation messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'iframe_navigate') {
        const nextUrl = event.data.url;
        const bestMode = getBestModeForUrl(nextUrl);
        setBrowserViewMode(bestMode);
        setBrowserHistory(prev => {
          const nextHistory = prev.slice(0, browserHistoryIndex + 1);
          nextHistory.push(nextUrl);
          return nextHistory;
        });
        setBrowserHistoryIndex(prev => prev + 1);
        setBrowserUrl(nextUrl);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [browserHistoryIndex]);

  // Fetch website HTML via CORS proxy and rewrite to load inline
  const loadBrowserUrl = useCallback((url: string) => {
    setIframeLoading(true);
    setIframeDomLoading(true);
    setIframeSrcDoc('');
    setIframeSrc('');

    const rewritten = rewriteUrlForEmbedding(url);
    
    // Check if it's a YouTube embed or direct image/pdf/etc.
    const isDirectEmbed = rewritten.includes('youtube.com/embed/') || 
                          rewritten.endsWith('.png') || 
                          rewritten.endsWith('.jpg') || 
                          rewritten.endsWith('.jpeg') || 
                          rewritten.endsWith('.gif') || 
                          rewritten.endsWith('.svg') || 
                          rewritten.endsWith('.pdf');

    if (isDirectEmbed) {
      setIframeSrc(rewritten);
      setIframeLoading(false);
      return;
    }

    if (browserViewMode === 'direct') {
      setIframeSrc(rewritten);
      setIframeLoading(false);
      return;
    } else if (browserViewMode === 'google') {
      setIframeSrc(`https://translate.google.com/translate?sl=auto&tl=en&u=${encodeURIComponent(rewritten)}`);
      setIframeLoading(false);
      return;
    } else if (browserViewMode === 'archive') {
      // Use Identity Mode ("2id_") to strip Wayback's heavy header banner/tracking scripts and load the raw page directly at maximum speed.
      setIframeSrc(`https://web.archive.org/web/2id_/${rewritten}`);
      setIframeLoading(false);
      return;
    }

    // Standard webpage proxying via Cloudflare Edge-powered high-speed corsproxy.io
    const proxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(rewritten)}`;
    
    fetch(proxyUrl)
      .then(res => {
        if (!res.ok) throw new Error('Proxy fetch failed');
        return res.text();
      })
      .then(html => {
        const processed = proxyRewriteHtml(html, rewritten);
        setIframeSrcDoc(processed);
        setIframeLoading(false);
      })
      .catch(err => {
        console.error('Error fetching page via proxy:', err);
        // Fallback: try loading directly
        setIframeSrc(rewritten);
        setIframeLoading(false);
      });
  }, [browserViewMode]);

  useEffect(() => {
    if (browserUrl) {
      loadBrowserUrl(browserUrl);
    }
  }, [browserUrl, loadBrowserUrl]);

  const goBack = useCallback(() => {
    if (browserHistoryIndex > 0) {
      const prevIdx = browserHistoryIndex - 1;
      setBrowserHistoryIndex(prevIdx);
      setBrowserUrl(browserHistory[prevIdx]);
    }
  }, [browserHistory, browserHistoryIndex]);

  const goForward = useCallback(() => {
    if (browserHistoryIndex < browserHistory.length - 1) {
      const nextIdx = browserHistoryIndex + 1;
      setBrowserHistoryIndex(nextIdx);
      setBrowserUrl(browserHistory[nextIdx]);
    }
  }, [browserHistory, browserHistoryIndex]);

  const closeBrowser = useCallback(() => {
    setBrowserUrl(null);
    setBrowserHistory([]);
    setBrowserHistoryIndex(-1);
  }, []);

  // Fullscreen event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const rootEl = document.querySelector('.cs-hub-root');
    if (!rootEl) return;
    if (!document.fullscreenElement) {
      rootEl.requestFullscreen().catch(() => {
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen().catch(() => {
        setIsFullscreen(false);
      });
    }
  }, []);

  // Scroll to section helper
  const scrollToSection = useCallback((id: string) => {
    const contentEl = contentRef.current;
    if (!contentEl) return;
    const target = contentEl.querySelector(`#${CSS.escape(id)}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // In-app browser event listener for links inside markdown
  const handleContentClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href) return;

    // Internal navigation
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      scrollToSection(targetId);
      return;
    }

    e.preventDefault();

    let targetUrl = href;
    if (!href.startsWith('http') && !href.startsWith('//') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
      // Resolve relative path to Github repo URL
      const githubUrl = activeRepo.githubUrl;
      const cleanGithub = githubUrl.endsWith('/') ? githubUrl.slice(0, -1) : githubUrl;
      const branch = activeRepo.id === 'react' ? 'main' : 'master';
      const cleanPath = href.startsWith('./') ? href.substring(2) : href;
      targetUrl = `${cleanGithub}/blob/${branch}/${cleanPath}`;
    }

    const bestMode = getBestModeForUrl(targetUrl);
    setBrowserViewMode(bestMode);
    setBrowserHistory([targetUrl]);
    setBrowserHistoryIndex(0);
    setBrowserUrl(targetUrl);
  }, [scrollToSection, activeRepo]);

  // When activeRepo changes, cache scroll position of the previous repo
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollPositionsRef.current[state.activeRepoId] = scrollContainerRef.current.scrollTop;
    }
  }, [state.activeRepoId]);

  // Load & render markdown
  useEffect(() => {
    setLoading(true);
    setMarkdownHtml('');
    setSections([]);
    setActiveSection('');
    activeSectionRef.current = '';

    const base = import.meta.env.BASE_URL || '/elite-resources/';
    fetch(`${base}cs-dev/${activeRepo.file}`)
      .then(r => r.text())
      .then(md => {
        const rawHtml = marked.parse(md) as string;
        // Process HTML to rewrite image paths and inject smooth onload attributes
        const processed = processHtml(rawHtml, base);
        
        setMarkdownHtml(processed);
        setSections(extractSections(processed));
        setLoading(false);
        // Restore scroll position
        setTimeout(() => {
          if (scrollContainerRef.current) {
            const savedPos = scrollPositionsRef.current[activeRepo.id] || state.scrollPositions[activeRepo.id] || 0;
            scrollContainerRef.current.scrollTop = savedPos;

            const progress = calcReadProgress(scrollContainerRef.current);
            if (progressFillRef.current) progressFillRef.current.style.width = `${progress}%`;
            if (progressFillToolbarRef.current) progressFillToolbarRef.current.style.width = `${progress}%`;
            if (progressTextRef.current) progressTextRef.current.textContent = `${progress}%`;
          }
        }, 100);
      })
      .catch(() => {
        setMarkdownHtml('<p style="color:#ff6b6b">Failed to load content.</p>');
        setLoading(false);
      });
  }, [activeRepo.id]);

  // Wire up checkboxes after render
  useEffect(() => {
    if (!contentRef.current) return;
    const checkboxes = contentRef.current.querySelectorAll<HTMLInputElement>('input.cs-checkbox');
    const total = checkboxes.length;
    setTotalCheckboxes(total);

    let completed = 0;
    checkboxes.forEach((cb) => {
      const taskId = cb.dataset.taskId || '';
      const storageKey = `${activeRepo.id}::${taskId}`;
      const saved = state.checkboxes[storageKey];
      if (saved !== undefined) cb.checked = saved;
      if (cb.checked) completed++;

      const handler = () => {
        const newChecked = cb.checked;
        if (newChecked) completed++; else completed--;
        setCompletedCheckboxes(c => newChecked ? c + 1 : Math.max(0, c - 1));
        setState(s => ({
          ...s,
          checkboxes: { ...s.checkboxes, [storageKey]: newChecked }
        }));
      };
      cb.addEventListener('change', handler);
    });
    setCompletedCheckboxes(completed);

    return () => {
      checkboxes.forEach(cb => {
        const cloned = cb.cloneNode(true) as HTMLInputElement;
        cb.parentNode?.replaceChild(cloned, cb);
      });
    };
  }, [markdownHtml, activeRepo.id]);

  // Throttled scroll tracking → updates DOM directly for buttery 60fps scrolling
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const progress = calcReadProgress(container);
    if (progressFillRef.current) {
      progressFillRef.current.style.width = `${progress}%`;
    }
    if (progressFillToolbarRef.current) {
      progressFillToolbarRef.current.style.width = `${progress}%`;
    }
    if (progressTextRef.current) {
      progressTextRef.current.textContent = `${progress}%`;
    }

    scrollPositionsRef.current[activeRepo.id] = container.scrollTop;

    // Find active section
    const contentEl = contentRef.current;
    if (!contentEl) return;
    const headings = contentEl.querySelectorAll<HTMLElement>('h1,h2,h3');
    let current = '';
    headings.forEach(h => {
      const rect = h.getBoundingClientRect();
      if (rect.top <= 160) current = h.id;
    });

    if (current && current !== activeSectionRef.current) {
      activeSectionRef.current = current;
      setActiveSection(current);
    }
  }, [activeRepo.id]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Save all accumulated scroll positions to storage state on unmount
  useEffect(() => {
    return () => {
      setState(s => ({
        ...s,
        scrollPositions: {
          ...s.scrollPositions,
          ...scrollPositionsRef.current
        }
      }));
    };
  }, []);



  // Search in content
  const handleSearch = useCallback(() => {
    const contentEl = contentRef.current;
    if (!contentEl) return;
    const query = searchQuery.trim().toLowerCase();
    // Clear previous highlights
    contentEl.querySelectorAll('.cs-search-highlight').forEach(el => {
      const parent = el.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(el.textContent || ''), el);
        parent.normalize();
      }
    });
    if (!query) return;

    // Walk text nodes
    const walker = document.createTreeWalker(contentEl, NodeFilter.SHOW_TEXT);
    const matches: Range[] = [];
    let node;
    while ((node = walker.nextNode())) {
      const text = node.textContent || '';
      const idx = text.toLowerCase().indexOf(query);
      if (idx !== -1) {
        const range = document.createRange();
        range.setStart(node, idx);
        range.setEnd(node, idx + query.length);
        matches.push(range);
      }
    }
    matches.slice(0, 200).forEach((range, i) => {
      const mark = document.createElement('mark');
      mark.className = 'cs-search-highlight';
      if (i === 0) mark.className += ' cs-search-first';
      try { range.surroundContents(mark); } catch {}
    });
    // Scroll first match into view
    const first = contentEl.querySelector('.cs-search-first');
    if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [searchQuery]);

  useEffect(() => {
    if (!searchQuery) {
      contentRef.current?.querySelectorAll('.cs-search-highlight').forEach(el => {
        const parent = el.parentNode;
        if (parent) { parent.replaceChild(document.createTextNode(el.textContent || ''), el); parent.normalize(); }
      });
    }
  }, [searchQuery]);

  // Filtered sidebar sections
  const filteredSections = useMemo(() => {
    if (!sidebarSearch.trim()) return sections;
    const q = sidebarSearch.toLowerCase();
    return sections.filter(s => s.title.toLowerCase().includes(q));
  }, [sections, sidebarSearch]);

  const checkPercent = totalCheckboxes > 0 ? Math.round((completedCheckboxes / totalCheckboxes) * 100) : 0;

  return (
    <div className={`cs-hub-root ${isFullscreen ? 'cs-fullscreen' : ''}`} data-focus={state.focusMode ? 'true' : 'false'}>
      {/* ── CSS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

        /* Highlight.js theme - custom dark */
        .hljs { background: transparent !important; color: #e2e8f0; padding: 0; }
        .hljs-keyword,.hljs-selector-tag,.hljs-built_in,.hljs-name,.hljs-tag { color: #c792ea; }
        .hljs-string,.hljs-title,.hljs-section,.hljs-attribute,.hljs-literal,.hljs-template-tag,.hljs-template-variable,.hljs-type,.hljs-addition { color: #c3e88d; }
        .hljs-comment,.hljs-quote,.hljs-deletion,.hljs-meta { color: #546e7a; font-style: italic; }
        .hljs-doctag,.hljs-keyword,.hljs-literal,.hljs-subst { color: #89ddff; }
        .hljs-attr,.hljs-variable,.hljs-params { color: #82aaff; }
        .hljs-number { color: #f78c6c; }
        .hljs-link,.hljs-regexp,.hljs-symbol { color: #e699a6; }
        .hljs-punctuation { color: #89ddff; }
        .hljs-function,.hljs-title.hljs-function { color: #82aaff; }
        .hljs-property { color: #89ddff; }
        .hljs-operator { color: #89ddff; }

        .cs-hub-root {
          font-family: 'Inter', -apple-system, sans-serif;
          height: 100%;
          display: flex;
          flex-direction: column;
          background: #080c14;
          color: #e2e8f0;
          overflow: hidden;
        }

        /* ── Repo Selector Bar ── */
        .cs-repo-bar {
          display: flex;
          gap: 0;
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          overflow-x: auto;
          flex-shrink: 0;
          scrollbar-width: none;
        }
        .cs-repo-bar::-webkit-scrollbar { display: none; }
        .cs-repo-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border: none;
          background: none;
          color: rgba(255,255,255,0.45);
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
          position: relative;
        }
        .cs-repo-tab:hover { color: rgba(255,255,255,0.75); background: rgba(255,255,255,0.04); }
        .cs-repo-tab.active { color: #fff; border-bottom-color: var(--accent); }
        .cs-repo-tab .tab-icon { font-size: 16px; }
        .cs-repo-tab .tab-stars {
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 20px;
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.5);
          font-weight: 600;
        }

        /* ── Toolbar ── */
        .cs-toolbar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          flex-shrink: 0;
        }
        .cs-search-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
          max-width: 400px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 6px 12px;
        }
        .cs-search-bar input {
          background: none;
          border: none;
          outline: none;
          color: #e2e8f0;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          flex: 1;
          min-width: 0;
        }
        .cs-search-bar input::placeholder { color: rgba(255,255,255,0.3); }
        .cs-search-go {
          background: rgba(255,255,255,0.1);
          border: none;
          border-radius: 5px;
          color: #fff;
          font-size: 11px;
          padding: 3px 8px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
        }
        .cs-search-go:hover { background: rgba(255,255,255,0.18); }
        .cs-toolbar-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.7);
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .cs-toolbar-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .cs-toolbar-btn.active { background: rgba(167,139,250,0.15); border-color: rgba(167,139,250,0.3); color: #a78bfa; }
        .cs-progress-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 10px;
          background: rgba(255,255,255,0.04);
          border-radius: 20px;
          font-size: 12px;
          color: rgba(255,255,255,0.5);
        }
        .cs-progress-pill .cs-pill-bar {
          width: 80px;
          height: 4px;
          background: rgba(255,255,255,0.08);
          border-radius: 2px;
          overflow: hidden;
        }
        .cs-progress-pill .cs-pill-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.4s ease;
        }
        .cs-github-link {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          border-radius: 8px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.6);
          font-size: 12px;
          text-decoration: none;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .cs-github-link:hover { background: rgba(255,255,255,0.1); color: #fff; }

        /* ── Main Layout ── */
        .cs-main {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        /* ── Sidebar ── */
        .cs-sidebar {
          width: 260px;
          flex-shrink: 0;
          background: rgba(255,255,255,0.02);
          border-right: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: width 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .cs-sidebar.collapsed { width: 0; border-right: none; overflow: hidden; }
        .cs-sidebar-header {
          padding: 12px 14px 8px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          flex-shrink: 0;
        }
        .cs-sidebar-search {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 7px;
          padding: 5px 9px;
        }
        .cs-sidebar-search input {
          background: none;
          border: none;
          outline: none;
          color: #e2e8f0;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          flex: 1;
          min-width: 0;
        }
        .cs-sidebar-search input::placeholder { color: rgba(255,255,255,0.25); }
        .cs-sidebar-nav {
          flex: 1;
          overflow-y: auto;
          padding: 6px 0;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.1) transparent;
        }
        .cs-nav-item {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          padding: 5px 14px;
          cursor: pointer;
          border: none;
          background: none;
          text-align: left;
          width: 100%;
          color: rgba(255,255,255,0.5);
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          line-height: 1.5;
          border-left: 2px solid transparent;
          transition: all 0.15s;
          white-space: normal;
          word-break: break-word;
        }
        .cs-nav-item:hover { color: rgba(255,255,255,0.85); background: rgba(255,255,255,0.04); }
        .cs-nav-item.active { color: var(--accent); border-left-color: var(--accent); background: rgba(var(--accent-rgb),0.07); }
        .cs-nav-item[data-level="1"] { font-size: 11.5px; font-weight: 700; color: rgba(255,255,255,0.75); text-transform: uppercase; letter-spacing: 0.5px; }
        .cs-nav-item[data-level="1"].active { color: var(--accent); }
        .cs-nav-item[data-level="2"] { padding-left: 20px; }
        .cs-nav-item[data-level="3"] { padding-left: 32px; font-size: 11.5px; }
        .cs-nav-item[data-level="4"] { padding-left: 44px; font-size: 11px; opacity: 0.7; }
        .cs-nav-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
          margin-top: 6px;
          flex-shrink: 0;
          opacity: 0.5;
        }
        .cs-nav-item.active .cs-nav-dot { opacity: 1; }

        /* ── Content Panel ── */
        .cs-content-wrap {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .cs-read-progress-bar {
          height: 2px;
          background: rgba(255,255,255,0.06);
          flex-shrink: 0;
          position: relative;
        }
        .cs-read-progress-fill {
          position: absolute;
          top: 0; left: 0; height: 100%;
          transition: width 0.2s ease;
          border-radius: 0 2px 2px 0;
        }
        .cs-scroll-area {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.1) transparent;
        }
        .cs-content-inner {
          max-width: 820px;
          margin: 0 auto;
          padding: 40px 48px 80px;
        }

        /* ── Focus Mode ── */
        [data-focus="true"] .cs-sidebar,
        [data-focus="true"] .cs-toolbar,
        [data-focus="true"] .cs-repo-bar {
          opacity: 0;
          pointer-events: none;
        }
        [data-focus="true"]:hover .cs-toolbar {
          opacity: 1;
          pointer-events: auto;
        }

        /* ── Loading ── */
        .cs-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 20px;
          color: rgba(255,255,255,0.4);
        }
        .cs-spinner {
          width: 36px; height: 36px;
          border: 2px solid rgba(255,255,255,0.1);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: cs-spin 0.8s linear infinite;
        }
        @keyframes cs-spin { to { transform: rotate(360deg); } }

        /* ─── Markdown Content Styles ─── */
        .cs-content-inner h1.cs-h1 {
          font-size: 2rem;
          font-weight: 800;
          color: #f8fafc;
          line-height: 1.25;
          margin: 0 0 28px;
          letter-spacing: -0.5px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .cs-content-inner h2.cs-h2 {
          font-size: 1.4rem;
          font-weight: 700;
          color: #f1f5f9;
          margin: 40px 0 16px;
          letter-spacing: -0.3px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .cs-content-inner h3.cs-h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #e2e8f0;
          margin: 28px 0 12px;
        }
        .cs-content-inner h4.cs-h4 {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--accent);
          margin: 20px 0 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .cs-content-inner .cs-heading { position: relative; }
        .cs-content-inner .cs-anchor {
          opacity: 0;
          color: rgba(255,255,255,0.3);
          font-size: 0.7em;
          margin-left: 8px;
          text-decoration: none;
          transition: opacity 0.2s;
          vertical-align: middle;
        }
        .cs-content-inner .cs-heading:hover .cs-anchor { opacity: 1; }
        .cs-content-inner p {
          font-size: 0.938rem;
          line-height: 1.8;
          color: #cbd5e1;
          margin: 0 0 16px;
        }
        .cs-content-inner a.cs-link {
          color: var(--accent);
          text-decoration: none;
          border-bottom: 1px solid rgba(var(--accent-rgb),0.3);
          transition: border-color 0.2s, color 0.2s;
          word-break: break-word;
        }
        .cs-content-inner a.cs-link:hover {
          border-bottom-color: var(--accent);
          color: #fff;
        }
        .cs-content-inner ul, .cs-content-inner ol {
          margin: 0 0 16px;
          padding-left: 24px;
        }
        .cs-content-inner li.cs-list-item {
          font-size: 0.913rem;
          color: #cbd5e1;
          line-height: 1.7;
          margin-bottom: 6px;
        }
        .cs-content-inner li.cs-list-item p { margin: 0; }

        /* Task list items */
        .cs-content-inner li.cs-task-item {
          list-style: none;
          margin-left: -20px;
          margin-bottom: 8px;
        }
        .cs-checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          cursor: pointer;
          user-select: none;
        }
        .cs-checkbox { display: none; }
        .cs-checkbox-custom {
          width: 17px;
          height: 17px;
          border: 1.5px solid rgba(255,255,255,0.25);
          border-radius: 5px;
          margin-top: 3px;
          flex-shrink: 0;
          position: relative;
          transition: all 0.2s;
          background: rgba(255,255,255,0.03);
        }
        .cs-checkbox:checked + .cs-checkbox-custom {
          background: var(--accent);
          border-color: var(--accent);
        }
        .cs-checkbox:checked + .cs-checkbox-custom::after {
          content: '';
          position: absolute;
          left: 3px; top: 1px;
          width: 7px; height: 4px;
          border-left: 2px solid #000;
          border-bottom: 2px solid #000;
          transform: rotate(-45deg);
        }
        .cs-task-text {
          font-size: 0.9rem;
          line-height: 1.7;
          color: #cbd5e1;
          flex: 1;
        }
        .cs-checkbox:checked ~ .cs-task-text { color: rgba(255,255,255,0.35); text-decoration: line-through; }
        .cs-checkbox-label:hover .cs-checkbox-custom { border-color: var(--accent); }

        /* Code blocks */
        .cs-code-block {
          background: #0d1117;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          margin: 20px 0;
          overflow: hidden;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 0.82rem;
          position: relative;
        }
        .cs-code-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 14px;
          background: rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .cs-lang-tag {
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-family: 'Inter', sans-serif;
        }
        .cs-copy-btn {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 5px;
          color: rgba(255,255,255,0.55);
          font-size: 11px;
          padding: 3px 10px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: all 0.2s;
        }
        .cs-copy-btn:hover { background: rgba(255,255,255,0.14); color: #fff; }
        .cs-code-block code { display: block; padding: 16px; overflow-x: auto; line-height: 1.65; }
        .cs-inline-code {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.82em;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 4px;
          padding: 1px 6px;
          color: #e2e8f0;
          white-space: nowrap;
        }

        /* Blockquotes */
        .cs-blockquote {
          margin: 16px 0;
          padding: 14px 20px;
          border-left: 3px solid var(--accent);
          background: rgba(var(--accent-rgb),0.06);
          border-radius: 0 8px 8px 0;
        }
        .cs-blockquote p { margin: 0; color: rgba(255,255,255,0.7); font-style: italic; }

        /* Tables */
        .cs-table-wrap { overflow-x: auto; margin: 20px 0; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); }
        .cs-table { width: 100%; border-collapse: collapse; }
        .cs-th {
          padding: 10px 14px;
          text-align: left;
          font-size: 12px;
          font-weight: 700;
          color: rgba(255,255,255,0.6);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .cs-td {
          padding: 10px 14px;
          font-size: 13px;
          color: #cbd5e1;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .cs-table tr:last-child .cs-td { border-bottom: none; }
        .cs-table tr:hover .cs-td { background: rgba(255,255,255,0.02); }

        /* Figures & Images with Skeleton Pulse */
        .cs-figure {
          margin: 24px 0;
          text-align: center;
          background: rgba(255,255,255,0.02);
          border-radius: 10px;
          min-height: 180px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.04);
          transition: border-color 0.3s;
        }
        
        .cs-figure:not(:has(.cs-image.loaded))::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.01) 75%);
          background-size: 200% 100%;
          animation: cs-pulse-skeleton 1.5s infinite;
        }

        @keyframes cs-pulse-skeleton {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .cs-figure:has(.cs-image.loaded) {
          min-height: auto;
          background: transparent;
          border-color: transparent;
        }

        .cs-image {
          max-width: 100%;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
          will-change: opacity;
        }

        .cs-image.loaded {
          opacity: 1;
        }

        .cs-caption {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          margin-top: 8px;
          font-style: italic;
        }

        /* HR */
        .cs-hr {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.08);
          margin: 32px 0;
        }

        /* Search highlight */
        .cs-search-highlight {
          background: rgba(255, 200, 50, 0.35);
          border-radius: 2px;
          padding: 0 2px;
          color: #fff;
        }
        .cs-search-first { background: rgba(255, 200, 50, 0.7); }

        /* Details/summary */
        .cs-content-inner details {
          margin: 12px 0;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          overflow: hidden;
        }
        .cs-content-inner summary {
          padding: 10px 14px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.7);
          background: rgba(255,255,255,0.03);
          list-style: none;
        }
        .cs-content-inner summary:hover { color: #fff; background: rgba(255,255,255,0.06); }
        .cs-content-inner details[open] summary { border-bottom: 1px solid rgba(255,255,255,0.06); }
        .cs-content-inner details > *:not(summary) { padding: 0 14px 14px; }

        /* Checkbox progress badge */
        .cs-check-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: rgba(52,211,153,0.1);
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          color: #34d399;
          white-space: nowrap;
          border: 1px solid rgba(52,211,153,0.15);
        }

        /* Responsive Media Queries - Complete Mobile & Tablet Optimization */
        @media (max-width: 768px) {
          /* Sidebar handles collapse */
          .cs-sidebar { width: 0 !important; border-right: none !important; }
          .cs-sidebar.collapsed { width: 0 !important; }
          
          /* Reading panel adjustments */
          .cs-content-inner {
            padding: 24px 16px 80px !important;
            max-width: 100% !important;
          }
          .cs-content-inner h1.cs-h1 { font-size: 1.6rem !important; margin-bottom: 20px !important; }
          .cs-content-inner h2.cs-h2 { font-size: 1.25rem !important; margin: 32px 0 12px !important; }
          .cs-content-inner h3.cs-h3 { font-size: 1.05rem !important; margin: 24px 0 10px !important; }
          .cs-content-inner p, .cs-content-inner li.cs-list-item { font-size: 0.875rem !important; line-height: 1.7 !important; }
          
          /* Repo tabs - compact and scrollable */
          .cs-repo-tab {
            padding: 10px 14px !important;
            font-size: 12px !important;
            gap: 6px !important;
          }
          .cs-repo-tab .tab-icon { font-size: 14px !important; }
          
          /* Main Toolbar - stacks cleanly */
          .cs-toolbar {
            flex-wrap: wrap !important;
            gap: 8px !important;
            padding: 8px 12px !important;
          }
          .cs-search-bar {
            max-width: 100% !important;
            flex: 1 1 100% !important;
            order: 1 !important;
          }
          .cs-toolbar-btn {
            padding: 5px 10px !important;
            font-size: 11px !important;
            flex-grow: 1 !important;
            justify-content: center !important;
            order: 2 !important;
          }
          .cs-check-badge {
            order: 3 !important;
            flex-grow: 1 !important;
            justify-content: center !important;
            font-size: 10px !important;
            padding: 4px 8px !important;
          }
          .cs-progress-pill {
            order: 4 !important;
            flex-grow: 1 !important;
            justify-content: center !important;
            font-size: 11px !important;
          }
          .cs-progress-pill .cs-pill-bar {
            width: 50px !important;
          }
          .cs-github-link {
            display: none !important; /* Hide redundant links on mobile screen */
          }
          
          /* Mobile Browser Header - Reflows layout to fit 100% screen width */
          .cs-browser-header {
            flex-wrap: wrap !important;
            padding: 8px 12px !important;
            gap: 8px !important;
          }
          .cs-mac-buttons {
            display: none !important; /* Hide traffic lights on small viewports */
          }
          .cs-browser-nav-arrows {
            order: 1 !important;
          }
          .cs-browser-modes {
            order: 2 !important;
            margin-left: auto !important;
          }
          .cs-mode-btn {
            padding: 3px 6px !important;
            font-size: 10px !important;
          }
          .cs-browser-address-bar {
            order: 3 !important;
            flex: 1 1 100% !important;
            font-size: 10px !important;
            padding: 4px 8px !important;
          }
          .cs-browser-actions {
            order: 4 !important;
            display: none !important; /* Hide external action in favor of clean touch overlay */
          }
          
          /* Browser Window margins */
          .cs-browser-window {
            width: 100vw !important;
            height: 92vh !important;
            border-radius: 12px 12px 0 0 !important;
            position: fixed !important;
            bottom: 0 !important;
            border-left: none !important;
            border-right: none !important;
            border-bottom: none !important;
          }
          .cs-browser-overlay {
            padding: 0 !important;
            align-items: flex-end !important;
          }
          
          /* Code blocks overflow handles */
          .cs-code-block code {
            padding: 12px !important;
            font-size: 0.75rem !important;
          }
          .cs-code-header {
            padding: 6px 10px !important;
          }
          .cs-lang-tag {
            font-size: 10px !important;
          }
          
          /* Mobile tables fluid wrap */
          .cs-table-wrap {
            margin: 12px 0 !important;
          }
          .cs-th, .cs-td {
            padding: 8px 10px !important;
            font-size: 11px !important;
          }
          
          /* Checkboxes */
          .cs-checkbox-custom {
            width: 15px !important;
            height: 15px !important;
            margin-top: 2px !important;
          }
          .cs-task-text {
            font-size: 0.85rem !important;
          }
          .cs-checkbox:checked + .cs-checkbox-custom::after {
            left: 2.5px !important;
            top: 0.5px !important;
            width: 6px !important;
            height: 3px !important;
          }
        }

        /* Strong/em */
        .cs-content-inner strong { color: #f1f5f9; font-weight: 700; }
        .cs-content-inner em { color: #c4b5fd; font-style: italic; }
        .cs-content-inner del { color: rgba(255,255,255,0.35); }

        /* Fullscreen styles */
        .cs-hub-root.cs-fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 99999;
          background: #080c14;
        }
        
        /* ── macOS Title Bar for Fullscreen Mode ── */
        .cs-window-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          background: rgba(20, 24, 33, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          flex-shrink: 0;
          user-select: none;
        }
        .cs-mac-buttons {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-shrink: 0;
        }
        .cs-mac-btn {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: background-color 0.2s;
        }
        .cs-mac-btn.close { background-color: #ff5f56; }
        .cs-mac-btn.minimize { background-color: #ffbd2e; }
        .cs-mac-btn.zoom { background-color: #27c93f; }

        .cs-mac-buttons:hover .cs-mac-btn.close::after {
          content: '×';
          font-size: 9px;
          font-weight: 700;
          color: #4c0002;
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
        }
        .cs-mac-buttons:hover .cs-mac-btn.minimize::after {
          content: '−';
          font-size: 9px;
          font-weight: 700;
          color: #5c3e00;
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
        }
        .cs-mac-buttons:hover .cs-mac-btn.zoom::after {
          content: '+';
          font-size: 8px;
          font-weight: 700;
          color: #004d02;
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
        }
        
        .cs-window-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.85);
          font-family: 'Inter', sans-serif;
        }
        .cs-window-icon {
          font-size: 15px;
        }
        .cs-window-badge {
          flex-shrink: 0;
        }
        .cs-badge-pill {
          font-size: 9px;
          font-weight: 700;
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.15);
          padding: 2px 8px;
          border-radius: 20px;
          letter-spacing: 0.5px;
        }

        /* Apple HIG Segmented Control in Browser Toolbar */
        .cs-browser-modes {
          display: inline-flex;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 2px;
          gap: 2px;
          flex-shrink: 0;
        }
        .cs-mode-btn {
          background: transparent;
          border: none;
          outline: none;
          color: rgba(255, 255, 255, 0.55);
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
        }
        .cs-mode-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.04);
        }
        .cs-mode-btn.active {
          background: rgba(255, 255, 255, 0.12);
          color: #fff;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05);
          font-weight: 600;
        }

        /* ── macOS Safari-style Preview Browser ── */
        .cs-browser-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: cs-fade-in-overlay 0.25s ease-out;
        }
        @keyframes cs-fade-in-overlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .cs-browser-window {
          width: 90vw;
          height: 85vh;
          background: #0b0f17;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          animation: cs-slide-up-browser 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cs-browser-window.cs-browser-maximized {
          width: 100vw;
          height: 100vh;
          border-radius: 0;
          border: none;
        }
        @keyframes cs-slide-up-browser {
          from { transform: translateY(30px) scale(0.97); }
          to { transform: translateY(0) scale(1); }
        }
        .cs-browser-header {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 10px 16px;
          background: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          flex-shrink: 0;
          user-select: none;
        }
        .cs-browser-nav-arrows {
          display: flex;
          gap: 4px;
        }
        .cs-nav-arrow {
          width: 24px;
          height: 24px;
          border: none;
          background: none;
          color: rgba(255, 255, 255, 0.2);
          font-size: 18px;
          line-height: 1;
          cursor: not-allowed;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cs-browser-address-bar {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          padding: 4px 12px;
          color: rgba(255, 255, 255, 0.6);
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          min-width: 0;
        }
        .cs-address-lock {
          font-size: 10px;
          opacity: 0.7;
        }
        .cs-address-text {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .cs-address-refresh {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          font-size: 12px;
          padding: 0 4px;
          transition: color 0.2s;
        }
        .cs-address-refresh:hover {
          color: #fff;
        }
        .cs-browser-actions {
          flex-shrink: 0;
        }
        .cs-browser-external-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 11px;
          text-decoration: none;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          transition: all 0.2s;
        }
        .cs-browser-external-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
        }
        .cs-browser-info-banner {
          background: rgba(16, 185, 129, 0.08);
          border-bottom: 1px solid rgba(16, 185, 129, 0.12);
          color: #34d399;
          padding: 6px 16px;
          font-size: 11px;
          text-align: center;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
        }
        .cs-browser-iframe {
          flex: 1;
          border: none;
          background: #fff;
        }
        .cs-browser-loading-screen {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #0f141c;
          gap: 16px;
          color: rgba(255, 255, 255, 0.4);
        }
        .cs-browser-loading-spinner {
          width: 32px;
          height: 32px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-top-color: #007aff;
          border-radius: 50%;
          animation: cs-spin 0.8s linear infinite;
        }
        .cs-browser-loading-text {
          font-size: 13px;
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      {/* Repo selector */}
      <div className="cs-repo-bar">
        {REPOS.map(repo => (
          <button
            key={repo.id}
            className={`cs-repo-tab ${state.activeRepoId === repo.id ? 'active' : ''}`}
            style={{ '--accent': repo.accent } as React.CSSProperties}
            onClick={() => setState(s => ({ ...s, activeRepoId: repo.id }))}
          >
            <span className="tab-icon">{repo.icon}</span>
            {repo.name}
            <span className="tab-stars">{repo.stats.stars}</span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div
        className="cs-toolbar"
        style={{ '--accent': activeRepo.accent, '--accent-rgb': hexToRgb(activeRepo.accent) } as React.CSSProperties}
      >
        {/* Search */}
        <div className="cs-search-bar">
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>⌕</span>
          <input
            placeholder="Find in page..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          {searchQuery && (
            <button className="cs-search-go" onClick={handleSearch}>Find</button>
          )}
          {searchQuery && (
            <button className="cs-search-go" onClick={() => setSearchQuery('')} style={{ background: 'rgba(255,100,100,0.15)', color: '#ff6b6b' }}>✕</button>
          )}
        </div>

        {/* Sidebar toggle */}
        <button
          className={`cs-toolbar-btn ${showSidebar ? 'active' : ''}`}
          onClick={() => setShowSidebar(v => !v)}
          style={{ '--accent-rgb': hexToRgb(activeRepo.accent) } as React.CSSProperties}
        >
          ☰ Contents
        </button>

        {/* Focus mode */}
        <button
          className={`cs-toolbar-btn ${state.focusMode ? 'active' : ''}`}
          onClick={() => setState(s => ({ ...s, focusMode: !s.focusMode }))}
          style={{ '--accent-rgb': hexToRgb(activeRepo.accent) } as React.CSSProperties}
        >
          {state.focusMode ? '🔓 Exit Focus' : '🎯 Focus Mode'}
        </button>

        {/* Fullscreen Mode */}
        <button
          className={`cs-toolbar-btn ${isFullscreen ? 'active' : ''}`}
          onClick={toggleFullscreen}
          style={{ '--accent-rgb': hexToRgb(activeRepo.accent) } as React.CSSProperties}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
        </button>

        {/* Checkbox progress (only for CIU) */}
        {totalCheckboxes > 0 && (
          <div className="cs-check-badge">
            ✓ {completedCheckboxes}/{totalCheckboxes} · {checkPercent}%
          </div>
        )}

        {/* Reading progress */}
        <div className="cs-progress-pill">
          <span>📖</span>
          <div className="cs-pill-bar">
            <div ref={progressFillToolbarRef} className="cs-pill-fill" style={{ width: '0%', background: activeRepo.accent }} />
          </div>
          <span ref={progressTextRef}>0%</span>
        </div>

        <div style={{ flex: 1 }} />

        {/* GitHub link */}
        <a href={activeRepo.githubUrl} target="_blank" rel="noopener noreferrer" className="cs-github-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          GitHub ↗
        </a>
      </div>

      {/* Main content area */}
      <div
        className="cs-main"
        style={{ '--accent': activeRepo.accent, '--accent-rgb': hexToRgb(activeRepo.accent) } as React.CSSProperties}
      >
        {/* Sidebar */}
        <div className={`cs-sidebar ${showSidebar ? '' : 'collapsed'}`}>
          <div className="cs-sidebar-header">
            <div className="cs-sidebar-search">
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>🔍</span>
              <input
                placeholder="Filter sections..."
                value={sidebarSearch}
                onChange={e => setSidebarSearch(e.target.value)}
              />
            </div>
          </div>
          <nav className="cs-sidebar-nav">
            {filteredSections.map((sec, i) => (
              <button
                key={`${sec.id}-${i}`}
                className={`cs-nav-item ${activeSection === sec.id ? 'active' : ''}`}
                data-level={sec.level}
                onClick={() => scrollToSection(sec.id)}
                title={sec.title}
              >
                <span className="cs-nav-dot" />
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {sec.title.length > 50 ? sec.title.slice(0, 50) + '…' : sec.title}
                </span>
              </button>
            ))}
            {filteredSections.length === 0 && sidebarSearch && (
              <div style={{ padding: '20px 14px', color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
                No sections match "{sidebarSearch}"
              </div>
            )}
          </nav>
        </div>

        {/* Reading Panel */}
        <ReadingPanel
          markdownHtml={markdownHtml}
          loading={loading}
          activeRepo={activeRepo}
          contentRef={contentRef}
          scrollContainerRef={scrollContainerRef}
          onContentClick={handleContentClick}
          progressFillRef={progressFillRef}
        />
      </div>

      {/* macOS Safari-style Preview Browser Overlay */}
      {browserUrl && (
        <div className="cs-browser-overlay" onClick={closeBrowser}>
          <div
            className={`cs-browser-window ${browserIsMaximized ? 'cs-browser-maximized' : ''}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="cs-browser-header">
              {/* macOS Window Controls */}
              <div className="cs-mac-buttons">
                <button className="cs-mac-btn close" onClick={closeBrowser} title="Close Browser"></button>
                <button className="cs-mac-btn minimize" onClick={closeBrowser} title="Close Browser"></button>
                <button className="cs-mac-btn zoom" onClick={() => setBrowserIsMaximized(v => !v)} title="Toggle Maximize"></button>
              </div>

              {/* Navigation Arrows */}
              <div className="cs-browser-nav-arrows">
                <button 
                  className="cs-nav-arrow" 
                  disabled={browserHistoryIndex <= 0} 
                  onClick={goBack}
                  title="Back"
                  style={{ 
                    cursor: browserHistoryIndex > 0 ? 'pointer' : 'not-allowed', 
                    color: browserHistoryIndex > 0 ? '#fff' : 'rgba(255,255,255,0.2)' 
                  }}
                >
                  ‹
                </button>
                <button 
                  className="cs-nav-arrow" 
                  disabled={browserHistoryIndex >= browserHistory.length - 1} 
                  onClick={goForward}
                  title="Forward"
                  style={{ 
                    cursor: browserHistoryIndex < browserHistory.length - 1 ? 'pointer' : 'not-allowed', 
                    color: browserHistoryIndex < browserHistory.length - 1 ? '#fff' : 'rgba(255,255,255,0.2)' 
                  }}
                >
                  ›
                </button>
              </div>

              {/* Segmented Control Mode Switcher */}
              <div className="cs-browser-modes">
                <button 
                  className={`cs-mode-btn ${browserViewMode === 'proxy' ? 'active' : ''}`}
                  onClick={() => setBrowserViewMode('proxy')}
                  title="Web Proxy Mode (HTML rewrite)"
                >
                  Proxy
                </button>
                <button 
                  className={`cs-mode-btn ${browserViewMode === 'google' ? 'active' : ''}`}
                  onClick={() => setBrowserViewMode('google')}
                  title="Google Translate Proxy Mode (JS active)"
                >
                  Google Proxy
                </button>
                <button 
                  className={`cs-mode-btn ${browserViewMode === 'archive' ? 'active' : ''}`}
                  onClick={() => setBrowserViewMode('archive')}
                  title="Wayback Cache Mode (Static reader)"
                >
                  Wayback Cache
                </button>
                <button 
                  className={`cs-mode-btn ${browserViewMode === 'direct' ? 'active' : ''}`}
                  onClick={() => setBrowserViewMode('direct')}
                  title="Direct Mode (Standard IFrame)"
                >
                  Direct
                </button>
              </div>

              {/* Address Bar */}
              <div className="cs-browser-address-bar">
                <span className="cs-address-lock">
                  {browserViewMode === 'direct' && '🔒'}
                  {browserViewMode === 'proxy' && '🛡️'}
                  {browserViewMode === 'google' && '🌐'}
                  {browserViewMode === 'archive' && '🏛️'}
                </span>
                <span className="cs-address-text">{browserUrl}</span>
                <button 
                  className="cs-address-refresh" 
                  onClick={() => loadBrowserUrl(browserUrl)} 
                  title="Reload Page"
                >
                  ↻
                </button>
              </div>

              {/* External Link Action */}
              <div className="cs-browser-actions">
                <a
                  href={browserUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cs-browser-external-btn"
                  title="Open in New Tab"
                >
                  Open in New Tab ↗
                </a>
              </div>
            </div>
            
            {/* Security Banner */}
            <div className="cs-browser-info-banner">
              <span>
                {browserViewMode === 'proxy' && '🛡️ Web Proxy: Rewriting links and assets. If page is blank, switch to Google Proxy.'}
                {browserViewMode === 'google' && '🌐 Google Proxy: Dynamic script-friendly bypass. Great for complex web apps.'}
                {browserViewMode === 'archive' && '🏛️ Wayback Cache: Internet Archive snapshot. Stable and fast reading.'}
                {browserViewMode === 'direct' && '🔒 Direct Mode: Unfiltered iframe. Only works for sites allowing embedding.'}
              </span>
            </div>

            {/* Content Iframe / Loader Container */}
            <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
              {(iframeLoading || iframeDomLoading) && (
                <div className="cs-browser-loading-screen" style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
                  <div className="cs-browser-loading-spinner" />
                  <span className="cs-browser-loading-text">
                    {browserViewMode === 'proxy' ? 'Fetching and rewriting page content...' : 'Bypassing restrictions and opening website...'}
                  </span>
                </div>
              )}
              
              <iframe
                srcDoc={iframeSrcDoc || undefined}
                src={iframeSrc || undefined}
                className="cs-browser-iframe"
                title="In-App Browser"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                onLoad={() => setIframeDomLoading(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : '167,139,250';
}
