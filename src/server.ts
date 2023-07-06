import App from '@/app';

import AuthRoute from '@/routes/auth.route';
import IndexRoute from '@/routes/index.route';
import SitesRoute from '@/routes/sites.route';

import validateEnv from '@/utils/validateEnv';

validateEnv();

const app = new App([new IndexRoute(), new AuthRoute(), new SitesRoute()]);

app
  .connectToDB()
  .then(() => {
    app.listen();
  })
  .catch(error => {
    console.error(error);
  });
