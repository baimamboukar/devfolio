/**
 * Centralized Configuration Management
 * Loads configuration from local YAML files via Nuxt Content
 */

import { readonly } from 'vue';

// Local data sources
const LOCAL_DATA_SOURCES = {
  about: '/content/about.yaml',
  research: '/content/research.yaml',
  news: '/content/news.yaml',
  projectsMore: '/content/projects/more.json',
};

export const useConfig = () => {
  // Site configuration
  const siteConfig = useState('siteConfig', () => null);
  const loadSiteConfig = async () => {
    if (!siteConfig.value) {
      try {
        const data = await queryContent('config').findOne();
        siteConfig.value = data;
      } catch (error) {
        console.error('Failed to load site config:', error);
      }
    }
    return siteConfig.value;
  };

  // Homepage content
  const homepageContent = useState('homepageContent', () => null);
  const loadHomepageContent = async () => {
    if (!homepageContent.value) {
      try {
        const data = await queryContent('homepage').findOne();
        homepageContent.value = data;
      } catch (error) {
        console.error('Failed to load homepage content:', error);
      }
    }
    return homepageContent.value;
  };

  // UI Messages - Stubbed out as requested
  const uiMessages = useState('uiMessages', () => ({}));
  const loadUIMessages = async () => {
    return {}; 
  };

  // Get specific message stub
  const getMessage = (path: string, fallback = ''): string => {
    return fallback;
  };

  // Local data sources loader
  const loadLocalData = async (source: keyof typeof LOCAL_DATA_SOURCES) => {
    try {
      return await queryContent(LOCAL_DATA_SOURCES[source]).findOne();
    } catch (error) {
      console.error(`Failed to load ${source}:`, error);
      return null;
    }
  };

  // Refresh Stub
  const refreshAllConfigs = async () => {
    // No-op for local files
  };

  return {
    loadSiteConfig,
    loadHomepageContent,
    loadUIMessages,
    loadLocalData,
    siteConfig: readonly(siteConfig),
    homepageContent: readonly(homepageContent),
    uiMessages: readonly(uiMessages),
    getMessage,
    refreshAllConfigs,
    LOCAL_DATA_SOURCES,
  };
};

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
  const { getMessage } = useConfig();
  return { messages: {}, uiMessages: {}, getMessage };
};
