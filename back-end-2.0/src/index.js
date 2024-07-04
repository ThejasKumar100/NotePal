require("dotenv").config()
const app = require("./server")

const port = process.env.PORT || 3000

const startServer = () => {
    const server = app.listen(port, () => {
        console.log(`Server running on port: ${port}`)
    });
}

startServer()