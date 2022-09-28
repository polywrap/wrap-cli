import { Router } from "express";
import multer from "multer";
import fse from "fs-extra";
import { Zip } from "../utils/zip";
import path from "path";
import { sanitizeUserPath } from "../utils/sanitization";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.post(
  "/wrappers/:user/:name",
  upload.array("file[]", 200),
  async (req, res) => {
    try {
      const user = req.params.user as string;
      const name = req.params.name as string;

      if (!sanitizeUserPath(user)) {
        res.status(422).send({
          ok: false,
          err: "'user' path contains illegal characters",
        });
        return;
      }

      if (!sanitizeUserPath(name)) {
        res.status(422).send({
          ok: false,
          err: "'name' path contains illegal characters"
        });
        return;
      }

      const basePath = `${__dirname}/../../wrappers`;
      const wrapperPath = `${basePath}/${user}/${name}`;

      if (wrapperPath.indexOf(basePath) !== 0) {
        res.status(422).send({
          ok: false,
          err: "Directory traversal detected",
        });
        return;
      }

      if (fse.existsSync(wrapperPath)) {
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
          fse.moveSync(file.path, `${wrapperPath}/${file.originalname}`, {
            overwrite: true,
          });
        });

        const zip = new Zip();
        await zip.createZip(wrapperPath, `${wrapperPath}/wrapper.zip`);

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
