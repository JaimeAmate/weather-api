import { Request, Response } from 'express';
import { getUser } from '../middleware/cacheLayer';
import { 
  ICreateNotificationScheduleRequest, 
  IDeleteNotificationScheduleRequest, 
  IUpdateNotificationScheduleRequest 
} from '../middleware/validation';
import { 
  getUserNotificationSchedules, 
  createNotificationSchedule, 
  deleteNotificationSchedule, 
  updateNofificationSchedule
} from '../middleware/databaseLayer'
import httpCodes from '../utils/httpCodes';

export async function getSchedulesHandler(req: Request, res: Response) {
  const user = await getUser(req.headers['authorization']);

  const schedules = await getUserNotificationSchedules(user.email);

  res.send({
    schedules: schedules.map((schedule) => ({
      id: schedule._id,
      start_range: schedule.startRange,
      end_range: schedule.endRange,
      precipitation_types: schedule.precipitationTypes
    }))
  });
}

export async function createScheduleHandler(req: ICreateNotificationScheduleRequest, res: Response) {
  const user = await getUser(req.headers['authorization']);

  const object = await createNotificationSchedule({
    startRange: req.body.start_range,
    endRange: req.body.end_range,
    precipitationTypes: req.body.precipitation_types || [],
    email: user.email
  });
  
  if(object) {
    res.send({
      'message': 'Schedule Succesfully created'
    });
    return;
  }
  else {
    res.status(httpCodes.SERVER_ERROR).send({
      message: 'There was an error creating the schedule'
    });
    return;
  }  
}

export async function updateScheduleHandler(req: IUpdateNotificationScheduleRequest, res: Response) {
  const { id } = req.params;
  const user = await getUser(req.headers['authorization']);
  
  const updatedObject = await updateNofificationSchedule(id, user.email, {
    startRange: req.body.start_range,
    endRange: req.body.end_range,
    precipitationTypes: req.body.precipitation_types || [],
    email: user.email
  });

  if (updatedObject) {
    res.send({
      message: 'Schedule succesfully updated'
    });
    return;
  }
  else{
    res.status(httpCodes.NOT_FOUND).send({
      message: 'Schedule not found'
    });
    return;
  }
}

export async function deleteScheduleHandler(req: IDeleteNotificationScheduleRequest, res: Response) {
  const { id } = req.params;
  const user = await getUser(req.headers['authorization']);

  const deletedObject = await deleteNotificationSchedule(id, user.email);

  if(deletedObject) {
    res.send({
      message: 'Schedule succesfully deleted'
    });
    return;
  }
  else {
    res.status(httpCodes.NOT_FOUND).send({
      message: 'Schedule not found'
    });
    return;
  }
}