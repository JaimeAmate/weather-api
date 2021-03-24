import e, { Request, Response } from "express";
import { ICreateNotificationScheduleRequest, IDeleteNotificationScheduleRequest } from '../middleware/validation';
import { getUser } from '../middleware/cacheLayer';
import { getNotificationSchedules, createNotificationSchedule, deleteNotificationSchedule } from '../middleware/databaseLayer'
import httpCodes from "../utils/httpCodes";

export async function getSchedulesHandler(req: Request, res: Response) {
  const user = await getUser(req.headers['authorization']);

  const schedules = await getNotificationSchedules(user.email);
  
  res.send({
    schedules: schedules.map((schedule) => ({
      id: schedule._id,
      start_range: schedule.startRange,
      end_range: schedule.endRange,
      precipitation_types: schedule.precipitationTypes,
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

  console.log('DEBUG: ', object);
  
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

export async function deleteScheduleHandler(req: IDeleteNotificationScheduleRequest, res: Response) {
  const { id } = req.body;

  const deletedObject = await deleteNotificationSchedule(id);

  if(!deletedObject) {
    res.status(httpCodes.NOT_FOUND).send({
      message: 'Schedule not found'
    });
    return;
  }
  else {
    res.send({
      message: 'Schedule succesfully deleted'
    });
    return;
  }
}