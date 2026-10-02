import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
if (!process.argv[2]) throw Error('Usage: node scripts/render-content-release.mjs RELEASE_DIRECTORY');
const root=path.resolve(process.argv[2]);
const output=path.join(root,'.vercel/output');
await import(pathToFileURL(path.join(root,'.vercel/output/functions/__nitro.func/index.mjs')).href);
const {h:useNitroApp}=await import(pathToFileURL(path.join(root,'.vercel/output/functions/__nitro.func/chunks/nitro/nitro.mjs')).href);
const app=useNitroApp();
const config=JSON.parse(await fs.readFile(path.join(output,'config.json'),'utf8'));
const overlay=JSON.parse(await fs.readFile(path.join(root,'overlay-records.json'),'utf8'));
const slugify=text=>text.toLowerCase().trim().replace(/\s+/g,'-').replace(/[^\w\-]+/g,'').replace(/\-\-+/g,'-').replace(/^-+|-+$/g,'');
const research=overlay.documents.find(record=>record._id==='content:research.yaml').research;
const addedRoutes=[...overlay.newProjects,...research.slice(0,2).map(record=>'/research/'+slugify(record.title))];
for(const route of addedRoutes)config.overrides[route.slice(1)+'/index.html']={path:route.slice(1)};
const queries=new Set();
app.hooks.hook('request',event=>{
  if(event.path.startsWith('/api/_content/query/')&&event.path.includes('_params='))queries.add(event.path);
});
const headers={host:'baimamboukar.dev','x-forwarded-proto':'https'};
const results=[];
for(const [file,override]of Object.entries(config.overrides)) {
  if(!file.endsWith('/index.html')&&file!=='index.html')continue;
  const route='/'+override.path;
  const response=await app.localFetch(route,{headers});
  const html=await response.text();
  if(response.status!==200||!html.includes('__NUXT_DATA__'))throw Error('Render failed: '+route+' '+response.status+' '+html.slice(0,500));
  if(addedRoutes.includes(route)&&html.includes('Project Not Found'))throw Error('New project unresolved: '+route);
  const target=path.join(output,'static',file);
  await fs.mkdir(path.dirname(target),{recursive:true});
  await fs.writeFile(target,html);
  const payloadRoute=route.replace(/\/$/,'')+'/_payload.json';
  const payloadResponse=await app.localFetch(payloadRoute,{headers});
  const payload=await payloadResponse.text();
  if(payloadResponse.status!==200)throw Error('Payload failed: '+payloadRoute);
  JSON.parse(payload);
  await fs.writeFile(path.join(path.dirname(target),'_payload.json'),payload);
  results.push({route,status:response.status,bytes:Buffer.byteLength(html),payloadBytes:Buffer.byteLength(payload)});
}
for(const query of queries) {
  const response=await app.localFetch(query,{headers});
  const text=await response.text();
  if(response.status!==200)throw Error('Query failed: '+query+' '+response.status);
  JSON.parse(text);
  const filename=path.join(output,'static',new URL(query,'http://local').pathname.slice(1));
  await fs.mkdir(path.dirname(filename),{recursive:true});await fs.writeFile(filename,text);
}
const cacheResponse=await app.localFetch('/api/_content/cache.1786626747090.json',{headers});
if(cacheResponse.status===200) {
  const cache=await cacheResponse.text();JSON.parse(cache);
  await fs.writeFile(path.join(output,'static/api/_content/cache.1786626747090.json'),cache);
}
await fs.writeFile(path.join(output,'config.json'),JSON.stringify(config,null,2)+'\n');
await fs.writeFile(path.join(root,'render-results.json'),JSON.stringify({routes:results,queries:queries.size},null,2));
await app.hooks.callHook('close');
console.log(JSON.stringify({routes:results.length,queries:queries.size,addedRoutes}));
