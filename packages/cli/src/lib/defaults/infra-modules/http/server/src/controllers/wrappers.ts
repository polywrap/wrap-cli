import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import fse from "fs-extra";
import { Zip } from "../utils/zip";
import path from "path";
import { uuidV4 } from "../utils/uuid";

const upload = multer({ dest: 'uploads/' })
const router = Router()

const deleteWrapper = async (req: Request, _: Response, next: NextFunction) => {
  try {
    const user = req.params.user as string;
    const name = req.params.name as string;
    const basePath = `${__dirname}/../../wrappers/${user}/${name}`
    fse.removeSync(basePath)
  } catch (err) {
    next(err)
  }
}

const uploadWrapper = async (req: Request, _: Response, next: NextFunction) => {
  try {
    const user = req.params.user as string;
    const name = req.params.name as string;
    const basePath = `${__dirname}/../../wrappers/${user}/${name}`

    if (Array.isArray(req.files)) {
      const wrapInfo = req.files.find(file => file.originalname === 'wrap.info')

      if (!wrapInfo) {
        throw new Error('No wrap.info file found')
      }

      req.files.forEach(file => {
        console.log(file.filename)
        fse.moveSync(file.path, `${basePath}/${file.originalname}`, { overwrite: true })
      })

    } else {
      throw new Error("Files not sent as array")
    }
    next();
  } catch(err) {
    next(err)
  }
}

const getWrapper = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.params.user as string;
    const name = req.params.name as string;
    const basePath = `${__dirname}/../../wrappers/${user}/${name}`
    const zipPath = `${basePath}/${uuidV4()}.zip`
  
    const zip = new Zip();
    await zip.createZip(basePath, zipPath)
  
    console.log(`Zipped ${basePath} to ${zipPath}`)
    res.download(path.resolve(zipPath), "wrappers.zip", (err) => {
      if (err) {
        console.log(err)
      }
      fse.unlinkSync(zipPath)
    })
  } catch(err) {
    next(err)
  }
}

router.post('/wrappers/:user/:name', upload.array('wrapper[]', 10), uploadWrapper)
router.get('/wrappers/:user/:name', getWrapper)
router.delete('/wrappers/:user/:name', deleteWrapper)

export default router
