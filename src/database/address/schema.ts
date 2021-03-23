import { Schema } from 'mongoose';
import { IAddressModel, IAddressDocument } from './types';
import { findByEmail, findByCoordinates } from './statics';

const AddressSchema = new Schema<IAddressDocument, IAddressModel>({
  email: String,
  lat: Number,
  lng: Number,
  street: String,
  streetNumber: String,
  town: String,
  postalCode: String,
  country: String,
  creation_date: {
    type: Date,
    default: new Date()
  }
});

AddressSchema.statics.findByEmail = findByEmail;
AddressSchema.statics.findByCoordinates = findByCoordinates;

export default AddressSchema;