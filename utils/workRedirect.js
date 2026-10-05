export const workRedirect = route => {
  const query = {};
  if (typeof route.query.search === 'string' && route.query.search) query.search = route.query.search;
  if (['featured', 'archive'].includes(route.query.view)) query.view = route.query.view;
  const hash = route.hash?.startsWith('#archive') ? '#archive' : '';
  return { path: '/work', query, hash };
};
