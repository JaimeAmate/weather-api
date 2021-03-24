import { Schema } from 'mongoose';
import { findByEmail } from './statics';
import { INotificationScheduleDocument, INotificationScheduleModel } from './types';

export const NotificationScheduleSchema = new Schema<INotificationScheduleDocument, INotificationScheduleModel>({
  startRange: Number,
  endRange: Number,
  precipitationTypes: [String],
  email: String
})

NotificationScheduleSchema.statics.findByEmail = findByEmail;