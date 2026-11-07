/* ==========================================================================
   CLIMATE READY NICHADA — live readings Worker
   --------------------------------------------------------------------------
   What this does: fetches the latest readings from ISB's AirGradient monitor
   (air quality, temperature, humidity) and the ISB lightning status, then
   hands them to the app in one simple package.

   Why it's needed: ISB's data only lets ISB's own display page read it
   directly. A Worker runs on Cloudflare's servers, so it can fetch the data
   and pass it on. It also saves results for 5 minutes, so ISB's monitor gets
   one request every few minutes, however many people use the app.

   HOW TO SET IT UP (no coding needed)
   1. Cloudflare dashboard > Workers & Pages > Create > Create Worker
      ("Start with Hello World"). Name it e.g.  nichada-live  > Deploy.
   2. Click "Edit code". Delete everything there, paste in this whole file,
      then click "Deploy".
   3. Copy the Worker's address (it looks like
      https://nichada-live.YOUR-NAME.workers.dev) and paste it into the app's
      index.html, in SETTINGS: LIVE DATA  >  workerUrl.
   ========================================================================== */

// ---- SETTINGS ----------------------------------------------------------------
const ISB_DISPLAY_ID = 'mGLq52179V';  // the code at the end of ISB's display link
const CACHE_SECONDS  = 300;           // how long to keep a reading (300 = 5 minutes)
// Which websites may read these readings. Only the app's own addresses are
// listed, so other sites can't reuse ISB's data. If the app gets a new
// address, add it here (starting with https://, no slash at the end).
const ALLOWED_ORIGINS = [
  'https://climateready.app',
  'https://www.climateready.app',
  'https://climate-ready-nichada.debbiedoesemails.workers.dev'
];
// ------------------------------------------------------------------------------

const MEASURES_URL  = `https://api.airgradient.com/displays-v2/${ISB_DISPLAY_ID}/measures/current`;
const LIGHTNING_URL = 'https://api.airgradient.com/isb/lightening-v2';

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin');
    if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders(origin) });

    // Serve a saved copy if we have a recent one.
    const cache = caches.default;
    const cacheKey = new Request(new URL('/live', request.url).toString());
    const cached = await cache.match(cacheKey);
    if (cached) return withCors(cached, origin);

    const [measures, lightning] = await Promise.all([getJson(MEASURES_URL), getJson(LIGHTNING_URL)]);
    const out = summarise(measures, lightning);
    const response = new Response(JSON.stringify(out), {
      status: out.ok ? 200 : 502,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': `public, max-age=${CACHE_SECONDS}` }
    });
    if (out.ok) ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return withCors(response, origin);
  }
};

async function getJson(url) {
  try {
    const r = await fetch(url, { headers: { 'Accept': 'application/json' }, cf: { cacheTtl: CACHE_SECONDS } });
    return r.ok ? await r.json() : null;
  } catch (e) {
    return null;
  }
}

// Pick out only what the app needs.
function summarise(measures, lightning) {
  const o = measures && measures.locations && measures.locations.outdoorAverage;
  const num = v => (typeof v === 'number' && isFinite(v) ? v : null);
  const air = o ? {
    pm25: num(o.pm02),
    aqi: num(o.pi02),            // US AQI worked out from PM2.5
    tempC: num(o.atmp),
    humidity: num(o.rhum),
    updated: o.date || null      // local Bangkok time, e.g. 2026-11-05T09:08:49
  } : null;
  const light = lightning && typeof lightning.level === 'number' ? {
    level: lightning.level,      // 0 = all clear
    status: lightning.status || null,
    checked: lightning.checked_at || null
  } : null;
  return { ok: !!(air && air.pm25 !== null), source: 'ISB campus monitor (AirGradient)', air, lightning: light, fetched: new Date().toISOString() };
}

// Tell the browser the app is allowed to read the reply. Any other website
// gets no permission, so its browser blocks it from reading the readings.
function corsHeaders(origin) {
  const h = { 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Vary': 'Origin' };
  if (origin && ALLOWED_ORIGINS.includes(origin)) h['Access-Control-Allow-Origin'] = origin;
  return h;
}
function withCors(res, origin) {
  const r = new Response(res.body, res);
  r.headers.delete('Access-Control-Allow-Origin');
  for (const [k, v] of Object.entries(corsHeaders(origin))) r.headers.set(k, v);
  return r;
}
