const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
if (!process.argv[2]) throw Error('Usage: node scripts/release-content-overlay.cjs RELEASE_DIRECTORY');
const release = path.resolve(process.argv[2]);
const source = path.resolve(__dirname, '..');
const yaml = {load: require(path.join(release, '.vercel/output/functions/__nitro.func/node_modules/yaml')).parse};
const output = path.join(release, '.vercel/output');
const chunks = path.join(output, 'functions/__nitro.func/chunks');
const raw = path.join(chunks, 'raw');
const replacements = new Map();
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
function read(name) {
  const text = fs.readFileSync(path.join(raw,name+'.mjs'),'utf8');
  const match = text.match(/const \w+ = (".*");/);
  return JSON.parse(JSON.parse(match[1]));
}
function write(name,data) {
  if (data.parsed) {
    data.hash = hash(JSON.stringify(data.parsed)).slice(0,16);
    replacements.set(data.parsed._id,data.parsed);
  }
  fs.writeFileSync(path.join(raw,name+'.mjs'), '// ROLLUP_NO_REPLACE\nconst content = '+JSON.stringify(JSON.stringify(data))+';\nexport { content as default };\n');
}
for (const name of ['homepage','about','research','news','config']) {
  const data = read(name);
  const fields = yaml.load(fs.readFileSync(path.join(source,'content',name+'.yaml'),'utf8'));
  Object.assign(data.parsed,fields);
  write(name,data);
}
const index = read('content-index');
let nitro = fs.readFileSync(path.join(chunks,'nitro/nitro.mjs'),'utf8');
const newProjects = [];
for (const filename of fs.readdirSync(path.join(source,'content/projects'))) {
  if (!filename.endsWith('.md')) continue;
  const name = filename.slice(0,-3);
  const text = fs.readFileSync(path.join(source,'content/projects',filename),'utf8');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) continue;
  const fields = yaml.load(match[1]);
  const exists = fs.existsSync(path.join(raw,name+'.mjs'));
  const modified = ['generalizable-interpretability','deception-audit','coordinate-or-concept-mismatch','delusion-reinforcement','matryoshka-saes','deepscanner'].includes(name);
  if (!exists && !modified) continue;
  const data = exists ? read(name) : {parsed:{
    _path:'/projects/'+name,_dir:'projects',_draft:false,_partial:false,_locale:'',
    body:{type:'root',children:[],toc:{title:'',searchDepth:2,depth:1,links:[]}},
    _type:'markdown',_id:'content:projects:'+filename,_source:'content',_file:'projects/'+filename,
    _stem:'projects/'+name,_extension:'md'
  }};
  if (modified) Object.assign(data.parsed,fields);
  data.parsed.featured = Boolean(fields.featured);
  write(name,data);
  if (!exists) {
    index[data.parsed._path] = [data.parsed._id];
    const key = 'nitro:bundled:cache:content:parsed:'+data.parsed._id;
    const entry = '\n  ['+JSON.stringify(key)+']: { import: () => import('+JSON.stringify('../raw/'+name+'.mjs')+').then(r => r.default || r), meta: {type:"text/markdown; charset=utf-8"} },';
    nitro = nitro.replace('const _assets = {','const _assets = {'+entry);
    newProjects.push(data.parsed._path);
  }
}
write('content-index',index);
fs.writeFileSync(path.join(chunks,'nitro/nitro.mjs'),nitro);
const nav = read('content-navigation');
function refresh(items) {
  for (const item of items) {
    const next = [...replacements.values()].find(record=>record._path === item._path);
    if (next) item.title=next.title;
    if (item.children) refresh(item.children);
  }
}
refresh(nav);
const projectNav = nav.find(item=>item._path === '/projects');
if (projectNav?.children) for (const route of newProjects) {
  const item = [...replacements.values()].find(record=>record._path === route);
  projectNav.children.push({_path:item._path,title:item.title});
}
write('content-navigation',nav);
const textPairs = [
  ['Academic research projects, publications, and scholarly work by Baimam Boukar JJ at Carnegie Mellon University Africa.','Mechanistic interpretability and AI safety research by Baimam Boukar Jean Jacques.'],
  ['Building Verifiable Models','Mechanistic Interpretability &amp; AI Safety'],
  ['I study how language models represent, conceal, and act on information.','Generalization, reliable monitoring, and activation-level interventions.'],
  ['How models encode and use internal representations.','When probing findings remain reliable across changes in models, layers, tasks, and data.'],
  ['Deception & Situational Awareness','Reliable Monitoring'],
  ['When models detect oversight, hide intent, or behave strategically.','Separating predictive accuracy from evidence about effective behavioral intervention.'],
  ['White-box Control','Activation-Level Interventions'],
  ['Whether probes, steering, and patching provide reliable causal control.','Testing steering directions and layers while preserving unrelated capabilities.'],
  ['Evaluation Science','Controlled Evaluation'],
  ['How to measure emerging capabilities with trustworthy controls.','Reproduction, held-out tests, and explicit operating thresholds under distribution shift.'],
  ['My research focuses on mechanistic interpretability and AI alignment. I study why interpretability methods fail to generalize across models and tasks, and build reliable tools to detect deception and misalignment inside large language models.','I study the generalization and reliability of activation probes and interventions. My work combines reproduction, controlled experiments, and held-out evaluation across models, tasks, and distribution shifts.'],
  ['Selected Publications','Selected Research']
];
function walk(dir) { return fs.readdirSync(dir,{withFileTypes:true}).filter(item=>item.name !== 'node_modules').flatMap(item=>item.isDirectory()?walk(path.join(dir,item.name)):[path.join(dir,item.name)]); }
const changedJs=[];
for (const file of [...walk(path.join(chunks,'build')),...walk(path.join(output,'static/_nuxt'))]) {
  if (!['.js','.mjs'].includes(path.extname(file))) continue;
  let text=fs.readFileSync(file,'utf8'); const before=text;
  for (const [from,to] of textPairs) text=text.split(from).join(path.extname(file)==='.js'?to.replace('&amp;','&'):to);
  if (text!==before) {fs.writeFileSync(file,text);if(file.endsWith('.js'))changedJs.push(path.basename(file));}
}
// Nuxt marks assets immutable. New filenames prevent browsers from reusing stale research copy.
const renamed={};
for (const filename of changedJs) {
  const file=path.join(output,'static/_nuxt',filename);
  renamed[filename]='content-'+hash(fs.readFileSync(file)).slice(0,12)+'.js';
}
// Rename every JS file that references a renamed module, propagating through the import graph.
let grow=true;
while(grow) {
  grow=false;
  for(const file of walk(path.join(output,'static/_nuxt')).filter(f=>f.endsWith('.js'))) {
    const name=path.basename(file);if(renamed[name])continue;
    const text=fs.readFileSync(file,'utf8');
    if(Object.keys(renamed).some(old=>text.includes(old))) {
      renamed[name]='content-'+hash(name+'\n'+text+'\n'+JSON.stringify(renamed)).slice(0,12)+'.js';grow=true;
    }
  }
}
for (const file of walk(output).filter(file=>['.js','.mjs','.json','.html'].includes(path.extname(file)))) {
  let text=fs.readFileSync(file,'utf8');const before=text;
  for(const [old,next] of Object.entries(renamed)) text=text.split(old).join(next);
  if(text!==before)fs.writeFileSync(file,text);
}
for(const [old,next] of Object.entries(renamed))fs.renameSync(path.join(output,'static/_nuxt',old),path.join(output,'static/_nuxt',next));
fs.writeFileSync(path.join(release,'overlay-records.json'),JSON.stringify({newProjects,renamed,documents:[...replacements.values()]},null,2));
console.log(JSON.stringify({documents:replacements.size,newProjects,clientModulesRenamed:Object.keys(renamed).length}));
