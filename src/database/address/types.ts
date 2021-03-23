import { Document, Model } from 'mongoose';

export interface IAddress {
  email: string;
  lat: number;
  lng: number;
  street: string,
  streetNumber: string,
  town: string,
  postalCode: String,
  country: String
}

export interface IAddressDocument extends IAddress, Document {}

export interface IAddressModel extends Model<IAddressDocument> {
  findByEmail: (
    this: IAddressModel,
    email: string
  ) => Promise<IAddressDocument[]>
  findByCoordinates: (
    this: IAddressModel,
    lat: number,
    lng: number
  ) => Promise<IAddressDocument | null>
}
