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

export async function getAddresses() {
  return AddressModel.find();
}

export async function getUserAddresses(userMail: string) {
  return AddressModel.findByEmail(userMail);
}

export async function createNotificationSchedule (notificationSchedule: INotificationSchedule) {
  return NotificationScheduleModel.create(notificationSchedule);
}

export async function getUserNotificationSchedules(userMail: string) {
  return NotificationScheduleModel.findByEmail(userMail);
}

export async function getNotificationSchedules() {
  return NotificationScheduleModel.find();
}

export async function updateNofificationSchedule(id: string, userMail: string, notificationSchedule: INotificationSchedule) {  
  const schedule = await NotificationScheduleModel.findOne({_id: id, email: userMail});

  if (schedule) {
    return NotificationScheduleModel.findByIdAndUpdate(id, notificationSchedule);
  }

  return null;
}

export async function deleteNotificationSchedule(id: string, userMail: string) {
  const schedule = await NotificationScheduleModel.findOne({_id: id, email: userMail});

  if (schedule) {
    return NotificationScheduleModel.findByIdAndRemove(id);
  }

  return null;
}