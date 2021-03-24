import { IAddress } from '../database/address/types';
import { INotificationSchedule, INotificationScheduleDocument } from '../database/notificationSchedule/types';
import { NotificationScheduleModel } from '../database/notificationSchedule/model';
import { AddressModel } from '../database/address/model';

export async function createAddress(address: IAddress) {
  const result = await AddressModel.findByCoordinates(address.lat, address.lng);

  if (!result) {
    AddressModel.create(address);
  }
}

export async function createNotificationSchedule (notificationSchedule: INotificationSchedule) {
  return NotificationScheduleModel.create(notificationSchedule);
}

export async function getNotificationSchedules(userMail: string) {
  return NotificationScheduleModel.findByEmail(userMail);
}

export async function deleteNotificationSchedule(id: string) {
  return NotificationScheduleModel.findByIdAndDelete(id);
}