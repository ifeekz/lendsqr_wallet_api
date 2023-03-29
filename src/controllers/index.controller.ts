import { dbHealthStatus } from '@/databases';
import { NextFunction, Request, Response } from 'express';

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction): void => {
    try {
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };
  public healthCheck = async (req: Request, res: Response, next: NextFunction): void => {
    try {
      const healthcheck = {
        uptime: process.uptime(),
        timestamp: Date.now(),
        integrations: [{
          name: 'database',
          status: await dbHealthStatus,
        }],
      };
      res.send(healthcheck);
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
