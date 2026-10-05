import { buildWorkCollection } from '~/utils/workCollection';

export const useWorkCollection = async () => {
  const { data } = await useAsyncData('work-collection', async () => {
    const [research, projects, more, github, homepage] = await Promise.all([
      queryContent('research').findOne(),
      queryContent('projects').where({ _type: 'markdown' }).only(['title', 'description', '_path', 'featured', 'tags', 'status']).find(),
      queryContent('projects/more').findOne(),
      queryContent('projects/github').findOne(),
      queryContent('homepage').only(['selected_research']).findOne(),
    ]);
    return buildWorkCollection({ research: research?.research || [], projects, more: more?.body || [], github: github?.projects || [], homepage });
  });
  return { work: computed(() => data.value || []) };
};
