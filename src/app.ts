const express = require('express');
const router = require('./routes')

class App {

    public server

    constructor() {
        this.server = express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(express.json());
    }

    routes() {
        router(this.server)
    }
}

module.exports = new App().server;