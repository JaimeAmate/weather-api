import { model } from 'mongoose';
import { IAddressDocument, IAddressModel} from './types';
import AddressSchema from './schema';

export const AddressModel = model<IAddressDocument, IAddressModel>('address', AddressSchema);