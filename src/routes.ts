import * as express from 'express';
import { Constants } from './config/constants';
import { UserRoute } from './modules/user/userRoute';

export class Routes {
  protected basePath: string;

  constructor(NODE_ENV: string) {
    switch (NODE_ENV) {
      case 'production':
        this.basePath = '/app/dist';
        break;
      case 'development':
        this.basePath = '/app/public';
        break;
    }
  }

  public defaultRoute(req: express.Request, res: express.Response) {
    res.json({
      message: 'Hello !',
    });
  }

  public path() {
    const router = express.Router();
    router.use('/users', UserRoute);
    router.all('/*', (req, res) => {
      return res.status(Constants.NOT_FOUND_CODE).json({
        error: 'URL NOT FOUND',
      });
    });
    return router;
  }
}
