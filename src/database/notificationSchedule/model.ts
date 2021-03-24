import { model } from 'mongoose';
import { INotificationScheduleDocument, INotificationScheduleModel} from './types';
import { NotificationScheduleSchema } from './schema';

export const NotificationScheduleModel = 
  model<INotificationScheduleDocument, INotificationScheduleModel>('notificationSchedule', NotificationScheduleSchema);