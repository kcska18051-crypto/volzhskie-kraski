import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const useDist = process.argv.includes('--dist');
const root = useDist ? path.join(projectRoot,'dist') : projectRoot;
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.avif':'image/avif','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.mp4':'video/mp4','.webm':'video/webm','.pdf':'application/pdf','.txt':'text/plain; charset=utf-8'};
export const server = http.createServer(async(request,response)=>{
  try {
    if(request.method!=='GET'&&request.method!=='HEAD'){response.writeHead(405);response.end('Method not allowed');return;}
    const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    const filePath=pathname==='/'?'index.html':pathname.replace(/^\//,'');
    if(!/^(index\.html|src\/[^/]+\.(js|css)|assets\/[^/]+\.(png|webp|avif|jpg|jpeg|svg|woff2|mp4|webm|pdf|txt))$/.test(filePath)){response.writeHead(404);response.end('Not found');return;}
    const file=path.join(root,!useDist&&filePath.startsWith('assets/')?'public/'+filePath:filePath);
    const info=await stat(file);
    response.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Content-Length':info.size,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
    if(request.method==='HEAD')response.end();else response.end(await readFile(file));
  } catch {response.writeHead(404);response.end('Not found');}
});
server.listen(Number(process.env.PORT)||5173,'127.0.0.1',()=>console.log('Волжские краски: http://127.0.0.1:'+server.address().port));
