import express from "express";
import { Tracer } from "../../src/index";

const app = express();
const PORT = 4040;

app.use(express.json());

app.get("/level", (req: express.Request, res: express.Response) => {
  res.send(Tracer.logLevel);
});

app.post("/level", (req: express.Request, res: express.Response) => {
  Tracer.setLogLevel(req.body.level);
  res.send(Tracer.logLevel);
});

app.listen(PORT, () => {
  console.log(`Logging server listening on port ${PORT}`);
});
