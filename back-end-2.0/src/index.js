require("dotenv").config()
const app = require("./server")
// const db_conn = require("./config/db")
// const box_conn = require("./config/box")

const port = process.env.PORT || 3000

const startServer = () => {
    const server = app.listen(port, () => {
        console.log(`Server running on port: ${port}`)
    });
}

startServer()