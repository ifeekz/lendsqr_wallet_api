import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import cache from '@/databases/cache';

const idempotenceMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (cache.has(req.headers['x-idempotence-key'])) {
      res.status(304).json({
        status: false,
        message: 'Duplicate transaction',
      });
    } else {
      cache.set(req.headers['x-idempotence-key'], { ...req.body }, 24 * 60 * 60);
      next();
    }
  } catch (error) {
    next(new HttpException(401, 'Idempotence key not found'));
  }
};

export default idempotenceMiddleware;
