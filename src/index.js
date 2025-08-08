//export default {
//  async fetch(request, env) {
//    const url = new URL(request.url);

//    console.log('ENV_KEYS', Object.keys(env));

//    // Serve static files first
//    let res = await env.ASSETS.fetch(request);

//    if (res.status !== 404) return res;

//    // Fallback: if it's a GET to a "route-like" path (no file extension), serve index.html
//    const isGet = request.method === 'GET';
//    const isFile = /\.[a-z0-9]+$/i.test(url.pathname); // has .js/.css/.png/etc
//    if (isGet && !isFile) {
//      const indexReq = new Request(new URL('/index.html', url), request);
//      return env.ASSETS.fetch(indexReq);
//    }

//    // Otherwise, keep the 404 (real missing files should 404)
//    return res;
//  }
//};
