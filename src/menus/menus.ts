import { Hono } from 'hono';
type Bindings={
    MY_KV:KVNamespace
}
const app=new Hono<{Bindings:Bindings}>()
app.get('/', async (c) => {
  const keys = await c.env.MY_KV.list();
  const foodMenus = await Promise.all(keys.keys.map(key => c.env.MY_KV.get(key.name)));
  return c.json({ post: foodMenus.map(item => JSON.parse(item)) });
});
app.get('/:id', async (c) => {
  const id = c.req.param('id');
  const post = await c.env.MY_KV.get(id);
  if (post) return c.json(JSON.parse(post));
  return c.json({ message: 'ページが見つかりませんでした' }, 404);
});
app.post('/', async (c) => {
  const { name, content } = await c.req.json();
  const newPost = { id: String(Date.now()), name, content };
  await c.env.MY_KV.put(newPost.id, JSON.stringify(newPost));
  return c.json(newPost, 201);
});
app.put('/:id', async (c) => {
  const id = c.req.param('id');
  const { name, content } = await c.req.json();
  const existingPost = await c.env.MY_KV.get(id);
  if (!existingPost) return c.json({ message: 'メニューが見つかりませんでした' }, 404);
  const updatedPost = { id, name, content };
  await c.env.MY_KV.put(id, JSON.stringify(updatedPost));
  return c.json(updatedPost);
});
app.delete('/:id', async (c) => {
  const id = c.req.param('id');
  const existingPost = await c.env.MY_KV.get(id);
  if (!existingPost) return c.json({ message: 'メニューが見つかりませんでした' }, 404);
  await c.env.MY_KV.delete(id);
  return c.json({ message: 'メニューが削除されました' });
});

export default app;
