import connectToDb from './db/connectToDb.js';
import app from './index.js'
import http from 'http'


const server = http.createServer(app)
const PORT = process.env.PORT || 8000;


server.listen(PORT,async()=>{
    await connectToDb();
    console.log(`server is running on ${PORT}`)
})
