import { IAddressDocument, IAddressModel } from './types';

export async function findByEmail(this: IAddressModel, email: string) : Promise<IAddressDocument[]> {
  return this.find({ email: email});
}

export async function findByCoordinates(this: IAddressModel, lat: number, lng: number) : Promise<IAddressDocument | null> {
  return this.findOne({ lat: lat, lng: lng});
}