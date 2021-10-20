import express from 'express'
import router from './routes'
import MongoDatabase from './infra/mongo/index'
MongoDatabase.connect()
class App {

    public server

    constructor() {
        this.server = express()
        this.middlewares()
        this.routes()
    }

    middlewares() {
        this.server.use(express.json())
    }

    routes() {
        router(this.server)
    }
}

export default new App().server