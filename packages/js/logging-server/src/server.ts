import express from "express";
import { Tracer } from "@web3api/tracing";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.LOGGING_SERVER_PORT;

app.use(express.json());

app.get("/level", (req: express.Request, res: express.Response) => {
  res.send(Tracer.logLevel);
});

app.post("/level", async (req: express.Request, res: express.Response) => {
  await Tracer.setLogLevel(req.body.level);
  res.send(Tracer.logLevel);
});

app.listen(PORT, () => {
  console.log(`Logging server listening on port ${PORT}`);
});
