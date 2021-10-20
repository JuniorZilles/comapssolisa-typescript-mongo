import express from 'express'
import router from './routes'
import './infra/mongo/index'

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