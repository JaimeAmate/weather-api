import { INotificationScheduleModel } from "./types";

export async function findByEmail(this: INotificationScheduleModel, email: string) {
  return this.find({ email: email});
}