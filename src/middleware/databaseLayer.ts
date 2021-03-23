import { IAddress } from '../database/address/types';
import { AddressModel } from '../database/address/model';

export async function createAddress(address: IAddress) {
  const result = await AddressModel.findByCoordinates(address.lat, address.lng);

  if (!result) {
    AddressModel.create(address);
  }
}
