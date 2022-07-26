import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: Error, _: Request, res: Response, __: NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ message: 'An unexpected error has ocurred' })
}