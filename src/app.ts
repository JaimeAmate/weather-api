import express  from 'express';
import { connectDatabase } from './config/database';
import { PORT } from './config/environmentVariables';
import * as authenticationController from './controllers/authentication';
import * as validation from './middleware/validation';
import * as addressController from './controllers/address';
import * as weatherContoller from './controllers/weather';

import { notifyUsers } from './controllers/notifier';

const app = express();

connectDatabase();

app.listen(PORT, () => {
  return console.log(`Server is listening on ${PORT}`);
});

app.get('/login/github', authenticationController.loginGithub);
app.get('/login/github/callback', authenticationController.callbackMethod);

app.get('/validate-address',
 authenticationController.validateRequest, 
 validation.validateAddressRequest, 
 addressController.addressHandler
);

app.get('/weather', 
  authenticationController.validateRequest, 
  validation.validateAddressRequest, 
  weatherContoller.weather
);

(async () => {
  await notifyUsers();
})();