export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);

    // 1) Try to serve a static file from your build output
    let res = await env.ASSETS.fetch(request);
    if (res.status !== 404) return res;

    // 2) If it wasn't found AND it's a clean path (no extension), serve SPA shell
    const isGet = request.method === 'GET';
    const looksLikeRoute = !/\.[a-z0-9]+$/i.test(url.pathname); // no .js/.css/.png/etc.
    if (isGet && looksLikeRoute) {
      const indexReq = new Request(new URL('/index.html', url), request);
      return env.ASSETS.fetch(indexReq);
    }

    // 3) Otherwise keep the 404 (missing actual files should still 404)
    return res;
  }
};
