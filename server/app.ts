import express from "express"
import cookieParser from "cookie-parser"
import { apiRouter } from "./routes/index.js"
import { requestId } from "./middleware/requestId.ts"
import { errorHandler } from "./middleware/errorHandler.ts"
import { notFoundHandler } from "./middleware/notFoundHandler.ts"

export const app = express()

app.disable("x-powered-by") // Remove in header X-Powered-By: Express
app.use(requestId)
app.use(express.json({ limit: '100kb'})) // parse it and make it available through request.body; limit the size to 100kb
app.use(cookieParser())
app.use("/api", apiRouter)

app.use(notFoundHandler)
app.use(errorHandler)
