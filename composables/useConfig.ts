/**
 * Centralized Configuration Management
 * This composable provides access to all external configuration data from GitHub Gists
 */

import { load as yamlLoad } from 'js-yaml';
import { readonly, ref } from 'vue';

// GitHub Gist URLs for configuration files (always fetch latest version)
const GIST_BASE_URL = 'https://gist.githubusercontent.com/baimamboukar';
const CONFIG_GISTS = {
  siteConfig: `${GIST_BASE_URL}/57efbdbc74dbe6204e85faeacaf42711/raw/site-config.yaml`,
  homepageContent: `${GIST_BASE_URL}/7b804b3ae79f9231773267d8fc1ab851/raw/homepage-content.yaml`,
  uiMessages: `${GIST_BASE_URL}/343e0118685354e834d905093cd593d4/raw/ui-messages.yaml`,
  presentationsData: `${GIST_BASE_URL}/59ba5ee864165be20d8e24a50e57b831/raw/presentations-data.yaml`,
  skillsTech: `${GIST_BASE_URL}/e409b07d56c4ed3d7c30ddba9c6b665e/raw/skills-tech.yaml`,
};

// Local fallback data sources
const LOCAL_DATA_SOURCES = {
  about: '/content/about.yaml',
  research: '/content/research.yaml',
  news: '/content/news.yaml',
  projectsMore: '/content/projects/more.json',
};

interface SiteConfig {
  personal: {
    name: string;
    title: string;
    tagline: string;
    photo: string;
    location: string;
    university: string;
    specialization: string;
  };
  seo: {
    title_template: string;
    default_title: string;
    description: string;
    keywords: string[];
    author: string;
    og_type: string;
    twitter_card: string;
    twitter_creator: string;
  };
  site: {
    name: string;
    url: string;
    logo: string;
    favicon: string;
    language: string;
    locale: string;
    theme_color: string;
  };
  contact: {
    email: string;
    calendly: string;
    github: string;
    twitter: string;
    linkedin: string;
  };
  featured: {
    projects_count: number;
    research_count: number;
    news_count: number;
    presentations_count: number;
  };
}

interface HomepageContent {
  hero: {
    greeting: string;
    emoji: string;
    introduction: string;
  };
  quick_links: {
    title: string;
    book_call: {
      title: string;
      subtitle: string;
      button_text: string;
      url: string;
    };
    links: Array<{
      label: string;
      icon: string;
      url: string;
      external?: boolean;
    }>;
  };
  sections: {
    achievements_banner: { enabled: boolean };
    news: { title: string; limit: number; show_all_button: boolean };
    research_map: { enabled: boolean; title: string };
    featured_research: { title: string; subtitle: string; limit: number };
    featured_projects: { title: string; subtitle: string; limit: number };
  };
  cta_messages: {
    view_all: string;
    load_more: string;
    see_details: string;
    read_more: string;
  };
  animations: {
    contact_button: { enabled: boolean; duration: string; delay: string; type: string };
    wave_emoji: { enabled: boolean; duration: string; delay: string; hover_duration: string };
  };
}

interface UIMessages {
  navigation: Record<string, string>;
  actions: Record<string, string>;
  projects: Record<string, any>;
  research: Record<string, any>;
  presentations: Record<string, any>;
  news: Record<string, any>;
  about: Record<string, any>;
  contact: Record<string, string>;
  errors: Record<string, string>;
  loading: Record<string, string>;
  time: Record<string, string>;
  misc: Record<string, string>;
}

// Fetch and parse YAML from URL with cache busting
async function fetchYaml<T>(url: string): Promise<T> {
  try {
    // Add cache busting timestamp
    const cacheBuster = `?t=${Date.now()}`;
    const fullUrl = `${url}${cacheBuster}`;

    console.log(`Fetching config from: ${fullUrl}`);

    const response = await $fetch<string>(fullUrl, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    console.log(`Received response:`, response);

    const parsedData = yamlLoad(response) as T;
    console.log(`Parsed data:`, parsedData);

    return parsedData;
  } catch (error) {
    console.error(`Failed to fetch config from ${url}:`, error);
    throw error;
  }
}

export const useConfig = () => {
  // Site configuration (removed caching - always fetch fresh)
  const siteConfig = ref<SiteConfig | null>(null);
  const loadSiteConfig = async (forceFresh = false) => {
    if (!siteConfig.value || forceFresh) {
      try {
        console.log('🔄 Loading fresh site config...');
        const config = await fetchYaml<SiteConfig>(CONFIG_GISTS.siteConfig);
        siteConfig.value = config;
        console.log('✅ Site config loaded:', config);
      } catch (error) {
        console.error('Failed to load site config:', error);
        // Fallback to default values
        siteConfig.value = {
          personal: {
            name: "Baimam Boukar Jean Jacques",
            title: "Graduate Researcher at CMU Africa",
            tagline: "Machine Learning for Space Systems & Earth Observation",
            photo: "/baimamboukar.jpeg",
            location: "Kigali, Rwanda",
            university: "Carnegie Mellon University Africa",
            specialization: "Machine Learning applications for Space Systems and Earth Observation"
          },
          seo: {
            title_template: "Baimam Boukar JJ",
            default_title: "Baimam Boukar Jean Jacques",
            description: "Graduate Researcher at CMU Africa | Machine Learning for Space Systems & Earth Observation",
            keywords: ["machine learning", "space systems", "earth observation"],
            author: "Baimam Boukar Jean Jacques",
            og_type: "website",
            twitter_card: "summary_large_image",
            twitter_creator: "@baimamboukar"
          },
          site: {
            name: "Baimam Boukar Portfolio",
            url: "https://baimamboukar.dev",
            logo: "/baimamboukar.jpeg",
            favicon: "/favicon.ico",
            language: "en",
            locale: "en_US",
            theme_color: "#0ea5e9"
          },
          contact: {
            email: "baimamboukar@gmail.com",
            calendly: "https://calendly.com/baimamboukar",
            github: "baimamboukar",
            twitter: "baimamboukarr",
            linkedin: "baimamboukar"
          },
          featured: {
            projects_count: 4,
            research_count: 3,
            news_count: 4,
            presentations_count: 6
          }
        };
      }
    }
    return siteConfig.value;
  };

  // Homepage content (removed caching - always fetch fresh)
  const homepageContent = ref<HomepageContent | null>(null);
  const loadHomepageContent = async (forceFresh = false) => {
    if (!homepageContent.value || forceFresh) {
      try {
        console.log('🔄 Loading fresh homepage content...');
        const content = await fetchYaml<HomepageContent>(CONFIG_GISTS.homepageContent);
        homepageContent.value = content;
        console.log('✅ Homepage content loaded:', content);
      } catch (error) {
        console.error('Failed to load homepage content:', error);
        // Fallback content would go here
      }
    }
    return homepageContent.value;
  };

  // UI Messages
  const uiMessages = ref<UIMessages | null>(null);
  const loadUIMessages = async () => {
    if (!uiMessages.value) {
      try {
        const messages = await fetchYaml<UIMessages>(CONFIG_GISTS.uiMessages);
        uiMessages.value = messages;
      } catch (error) {
        console.error('Failed to load UI messages:', error);
        // Fallback messages would go here
      }
    }
    return uiMessages.value;
  };

  // Get specific message with fallback
  const getMessage = (path: string, fallback = ''): string => {
    if (!uiMessages.value) return fallback;

    const keys = path.split('.');
    let current: any = uiMessages.value;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return fallback;
      }
    }

    return typeof current === 'string' ? current : fallback;
  };

  // Local data sources (existing YAML files)
  const loadLocalData = async (source: keyof typeof LOCAL_DATA_SOURCES) => {
    try {
      return await queryContent(LOCAL_DATA_SOURCES[source]).findOne();
    } catch (error) {
      console.error(`Failed to load ${source}:`, error);
      return null;
    }
  };

  // Force refresh all configurations
  const refreshAllConfigs = async () => {
    console.log('🔄 Force refreshing all configurations...');
    siteConfig.value = null;
    homepageContent.value = null;
    uiMessages.value = null;

    await Promise.all([
      loadSiteConfig(),
      loadHomepageContent(),
      loadUIMessages()
    ]);

    console.log('✅ All configurations refreshed');
  };

  return {
    // Configuration loaders
    loadSiteConfig,
    loadHomepageContent,
    loadUIMessages,
    loadLocalData,

    // Reactive data
    siteConfig: readonly(siteConfig),
    homepageContent: readonly(homepageContent),
    uiMessages: readonly(uiMessages),

    // Utilities
    getMessage,
    refreshAllConfigs,

    // Constants
    CONFIG_GISTS,
    LOCAL_DATA_SOURCES,
  };
};

// Convenience composables for specific configurations
export const useSiteConfig = async () => {
  const { loadSiteConfig, siteConfig } = useConfig();
  const config = await loadSiteConfig();
  return { config, siteConfig };
};

export const useHomepageContent = async () => {
  const { loadHomepageContent, homepageContent } = useConfig();
  const content = await loadHomepageContent();
  return { content, homepageContent };
};

export const useUIMessages = async () => {
  const { loadUIMessages, uiMessages, getMessage } = useConfig();
  const messages = await loadUIMessages();
  return { messages, uiMessages, getMessage };
};