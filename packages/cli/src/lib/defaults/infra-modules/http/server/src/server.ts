import { normalizePort } from "./config/normalizePort"
import app from "./app"

const port = normalizePort(process.env.PORT || '3500')

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})