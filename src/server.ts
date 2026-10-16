import { app } from './app'
import { env } from './env/index'

app.listen({
    host: '0.0.0.0',
    port: env.PORT || 80
}).then(() => {
    console.log('HTTP Server Running')
})