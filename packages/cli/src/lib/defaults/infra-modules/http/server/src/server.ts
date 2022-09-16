import { normalizePort } from "./config/normalizePort"
import app from "./app"

const port = normalizePort(process.env.HTTP_SERVER_PORT || '3500')

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})