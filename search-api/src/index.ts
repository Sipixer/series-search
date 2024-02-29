import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { ElasticSearch } from './es_interface/eas';
import { streamSSE } from 'hono/streaming'
import { cors } from 'hono/cors'
import { dataLoader } from './tools/loader';
import { importStatus } from './events/ImportStatus';

const watched = new Map<string, Set<string>>();


process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


const app = new Hono()
app.use(cors({
  origin: '*'
}))

app.post('/import', async (c) => {
  importStatus.setLoad();
  importStatus.setImportProgress(0, 0);
  console.log(importStatus)
  await ElasticSearch.deleteIndex();
  await ElasticSearch.createIndex();
  await ElasticSearch.import(await dataLoader(), importStatus);
  return c.json({ status: 'ok' });
}).get('/status', async (c) => {
  return streamSSE(c, async (stream) => {
    while (true) {
      await stream.writeSSE({
        data: JSON.stringify(importStatus),
      })
      await stream.sleep(500)
    }
  })
}).get("/api/search/:search", async (c) => {
  const User = c.req.header("User")
  const { search } = c.req.param()
  const result = await ElasticSearch.search(search);
  const data: {
    title: string,
    watched?: boolean
    score: number
  }[] = []
  for (const serie of result) {
    if (User && watched.has(User) && watched.get(User)?.has(serie.title)) {
      data.push({ title: serie.title, watched: true, score: serie.score });
    } else {
      data.push({ title: serie.title, score: serie.score });
    }
  }
  return c.json(data);
}).post("/api/markAsWatched", async (c) => {
  const User = c.req.header("User");
  const { serie } = await c.req.json()
  if (!serie) return c.json({ status: 'error' });
  if (!User) return c.json({ status: 'error' });
  if (!watched.has(User)) watched.set(User, new Set());
  watched.get(User)?.add(serie);
  return c.json({ status: 'ok' });
}).post("/api/markAsUnwatched", async (c) => {
  const { serie } = await c.req.json()
  const User = c.req.header("User");
  if (!User) return c.json({ status: 'error' });
  if (!serie) return c.json({ status: 'error' });
  if (!watched.has(User)) watched.set(User, new Set());
  watched.get(User)?.delete(serie);
  return c.json({ status: 'ok' });
}).get("/api/watched", async (c) => {
  const User = c.req.header("User");
  if (!User) return c.json({ status: 'error' });
  const watchedSeries = Array.from(watched.get(User) || new Set());
  return c.json(watchedSeries);
})

const port = 3000
console.log(`Server is running on port http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
