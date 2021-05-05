import express from "express";

const app = express();
const PORT = 4040;

app.use(express.json());

let level = "debug";

app.get("/level", (req: express.Request, res: express.Response) => {
  res.send(level);
});

app.post("/level", (req: express.Request, res: express.Response) => {
  level = req.body.level;
  res.send(level);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
