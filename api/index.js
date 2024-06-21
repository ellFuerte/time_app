const express = require('express')
const helmet = require('helmet')

const app = express();
app.use(express.static('../client/public/images'));

const userRouter = require('./routes/user.routes')
const postRouter = require('./routes/post.routes')

app.use(express.json())
app.use(helmet())
app.use('/api', userRouter)
app.use('/api', postRouter)


app.listen(8080, () => {
        console.log('API порт:8080')
    }
)



