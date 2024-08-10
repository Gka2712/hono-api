import { Hono } from 'hono'
import menus from './menus/menus'
import music from './music/music';
import { basicAuth } from 'hono/basic-auth';
const app = new Hono()
app.use(
  '/menus',
  basicAuth({
    username:'koike',
    password:'koike'
  })
)
app.route('/menus',menus)
app.route('/music',music);
app.get('/', (c) => {
  return c.text('Hello Hono!')
})
app.get('/api/hello',(c)=>{
  return c.json({
    ok:true,
    message:'Hello Hono!'
  })
})
export default app
