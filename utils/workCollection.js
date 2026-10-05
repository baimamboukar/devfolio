import { slugify } from './slugify.js';

// Explicit aliases for the same work; related studies are intentionally separate.
export const PROJECT_RESEARCH_LINKS = [
  {
    "projectUrl": "/projects/generalizable-interpretability",
    "researchTitle": "Cross-Model Generalization of Mechanistic-Interpretability Probes"
  },
  {
    "projectUrl": "/projects/deception-audit",
    "researchTitle": "Selection Regret: Auditing Deception Probes as Intervention Selectors"
  },
  {
    "projectUrl": "/projects/phoenix",
    "researchTitle": "Phoenix: Safe GitHub Issue Resolution via Multi-Agent LLMs"
  },
  {
    "projectUrl": "https://github.com/baimamboukar/air-quality-socioeconomic-analysis-research",
    "researchTitle": "Mapping Socioeconomic Air Quality Disparities In Rwanda Using Sentinel-5P TROPOMI Data In Google Earth Engine"
  },
  {
    "projectUrl": "https://github.com/baimamboukar/causual-structure-discovery-spacecraft-telemetry",
    "researchTitle": "Causal Structure Analysis for Telemetry Anomaly Detection in Spacecraft Systems"
  },
  {
    "projectUrl": "https://github.com/baimamboukar/hazardous-asteroid-classification",
    "researchTitle": "Explainable Deep-Learning Based Potentially Hazardous Asteroids Classification Using Graph Neural Networks"
  }
];

const normalize = value => String(value || '').trim().toLowerCase();
const normalizeUrl = value => normalize(value).replace(/\/$/, '');
const unique = values => [...new Set(values.filter(Boolean))];
const methodFor = title => title.startsWith('Cross-Model') ? 'refit'
  : title.startsWith('Selection Regret') ? 'selection'
  : title.startsWith('Coordinate') ? 'alignment'
  : title.startsWith('Measuring Delusion') ? 'support'
  : title.includes('Matryoshka') ? 'sae' : null;

export const projectNotesForResearch = slug => PROJECT_RESEARCH_LINKS.find(link =>
  slugify(link.researchTitle) === slug && link.projectUrl.startsWith('/projects/'))?.projectUrl;

export function buildWorkCollection({ research = [], projects = [], more = [], github = [], homepage = {} }) {
  const papers = research.filter(paper => paper.listed !== false);
  const candidates = [
    ...projects,
    ...more.map(project => ({ title: project.name, description: project.description, _path: project.liveUrl, tags: project.stack || [], featured: false })),
    ...github.map(project => ({ ...project, _path: project.url, featured: false })),
  ];
  const names = new Set(), destinations = new Set();
  const uniqueProjects = candidates.filter(project => {
    const name = normalize(project.title), url = normalizeUrl(project._path);
    if (!name || !url || names.has(name) || destinations.has(url)) return false;
    names.add(name); destinations.add(url);
    return true;
  });
  const mergedProjects = new Set();
  const entries = papers.map(paper => {
    const slug = slugify(paper.title);
    const aliases = PROJECT_RESEARCH_LINKS.filter(link => normalize(link.researchTitle) === normalize(paper.title));
    const related = uniqueProjects.filter(project => aliases.some(link => normalizeUrl(link.projectUrl) === normalizeUrl(project._path)));
    related.forEach(project => mergedProjects.add(project._path));
    const authors = (paper.authors?.length ? paper.authors : [{ name: 'Baimam Boukar Jean Jacques' }, ...(paper.contributors || [])]).map(author => author.name);
    const tags = unique([...(paper.topics || []), ...related.flatMap(project => project.tags || [])]);
    const kind = methodFor(paper.title);
    const description = homepage.selected_research?.find(item => item.slug === slug)?.summary || related[0]?.description || '';
    return {
      id: `paper:${slug}`, title: paper.title, url: `/research/${slug}`,
      description, status: paper.status || '', tags, authors, venue: paper.venue || '',
      // Keep the two current-study highlights; combine with existing project highlights.
      featured: ['refit', 'selection'].includes(kind) || related.some(project => project.featured),
      kind, type: 'paper',
      searchText: [paper.title, paper.abstract, ...authors, paper.status, paper.venue, ...tags, ...related.flatMap(project => [project.title, project.description])].filter(Boolean).join(' ').toLowerCase(),
    };
  });
  for (const project of uniqueProjects) {
    if (mergedProjects.has(project._path)) continue;
    const description = String(project.description || '').replace(/\u2728\uFE0F?/gu, '').trim();
    entries.push({
      id: `project:${project._path}`, title: project.title, url: project._path,
      description, status: project.status || '', tags: project.tags || [], authors: [], venue: '',
      featured: Boolean(project.featured), kind: methodFor(project.title), type: 'project',
      searchText: [project.title, description, project.status, ...(project.tags || [])].filter(Boolean).join(' ').toLowerCase(),
    });
  }
  return entries;
}
