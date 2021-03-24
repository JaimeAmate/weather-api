import express  from 'express';
import { connectDatabase } from './config/database';
import { PORT } from './config/environmentVariables';
import * as authenticationController from './controllers/authentication';
import * as validation from './middleware/validation';
import * as addressController from './controllers/address';
import * as weatherController from './controllers/weather';
import * as scheduleController from './controllers/notificationSchedule';

const app = express();
app.use(express.json());

connectDatabase();

app.listen(PORT, () => {
  return console.log(`Server is listening on ${PORT}`);
});

app.get('/login/github', authenticationController.loginGithub);
app.get('/login/github/callback', authenticationController.callbackMethod);

app.get('/validate-address',
 authenticationController.validateRequest, 
 validation.validateAddressRequest, 
 addressController.handler
);

app.get('/weather', 
  authenticationController.validateRequest, 
  validation.validateAddressRequest, 
  weatherController.handler
);

app.get('/schedules',
  authenticationController.validateRequest,
  scheduleController.getSchedulesHandler
)

app.post('/schedules/create',
  authenticationController.validateRequest,
  validation.validateCreateNotificationScheduleRequest,
  scheduleController.createScheduleHandler
);

app.post('/schedules/delete',
  authenticationController.validateRequest,
  validation.validateDeleteNotificationScheduleRequest,
  scheduleController.deleteScheduleHandler
);