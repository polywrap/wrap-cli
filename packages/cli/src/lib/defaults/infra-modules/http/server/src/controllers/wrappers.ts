import { Router } from "express";
import multer from "multer";
import fse from "fs-extra";
import { Zip } from "../utils/zip";
import path from "path";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.post(
  "/wrappers/:user/:name",
  upload.array("file[]", 200),
  async (req, res) => {
    try {
      const user = req.params.user as string;
      const name = req.params.name as string;
      const basePath = `${__dirname}/../../wrappers/${user}/${name}`;

      if (fse.existsSync(basePath)) {
        throw new Error(`Wrapper '${name}' already exists for user '${user}'`);
      }

      if (Array.isArray(req.files)) {
        const wrapInfo = req.files.find(
          (file) => file.originalname === "wrap.info"
        );

        if (!wrapInfo) {
          throw new Error("No wrap.info file found");
        }

        req.files.forEach((file) => {
          fse.moveSync(file.path, `${basePath}/${file.originalname}`, {
            overwrite: true,
          });
        });

        const zip = new Zip();
        await zip.createZip(basePath, `${basePath}/wrapper.zip`);

        res.status(200).send({
          ok: true
        });
      } else {
        throw new Error("Files not sent as array");
      }
    } catch (err) {
      res.status(500).send({
        ok: false,
        err: err.message
      });
    }
  }
);

router.get("/wrappers/:user/:name", async (req, res) => {
  try {
    const user = req.params.user as string;
    const name = req.params.name as string;
    const basePath = `${__dirname}/../../wrappers/${user}/${name}`;

    res.status(200).download(path.resolve(`${basePath}/wrapper.zip`), "wrapper.zip");
  } catch (err) {
    res.status(500).send({
      ok: false,
      err: err.message
    });
  }
});

router.delete("/wrappers/:user/:name", async (req, res) => {
  try {
    const user = req.params.user as string;
    const name = req.params.name as string;
    const basePath = `${__dirname}/../../wrappers/${user}/${name}`;
    fse.removeSync(basePath);
    res.status(200).send({
      ok: true
    });
  } catch (err) {
    res.status(500).send({
      ok: false,
      err: err.message
    });
  }
});

export default router;
