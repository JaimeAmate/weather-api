import { Document, Model } from 'mongoose'; 

export interface INotificationSchedule {
  startRange: number;
  endRange: number;
  precipitationTypes: string[];
  email: string,
} 

export interface INotificationScheduleDocument extends INotificationSchedule, Document {}

export interface INotificationScheduleModel extends Model<INotificationScheduleDocument> {
  findByEmail: (
    this: INotificationScheduleModel,
    email: string
  ) => Promise<INotificationScheduleDocument[]>
}