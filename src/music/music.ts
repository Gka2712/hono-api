import {Hono} from 'hono'
type Bindings={
    MY_KV2:KVNamespace
}
const app=new Hono<{Bindings:Bindings}>()
app.get('/',async(c)=>{
    const keys=await c.env.MY_KV2.list();
    const musiclist=await Promise.all(keys.keys.map(key=>c.env.MY_KV2.get(key.name)));
    return c.json({post:musiclist.map(item=>JSON.parse(item))});
})
app.post('/',async(c)=>{
    const {artist,title,content}=await c.req.json();
    const newPost={id:String(Date.now()),artist,title,content}
    await c.env.MY_KV2.put(newPost.id,JSON.stringify(newPost))
    return c.json(newPost,201);
})
export default app;