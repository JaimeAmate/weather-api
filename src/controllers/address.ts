import { NextFunction, Request, Response } from 'express';
import axios from 'axios';
import * as cacheMiddleware from '../middleware/cacheLayer';
import { IAddressRequest } from '../middleware/validation';
import { GEOCODE_API_KEY } from '../config/environmentVariables';
import httpCodes from '../utils/httpCodes';

export interface IAddressParams {
  street: string;
  streetNumber: string;
  town: string;
  postalCode: string;
  country: string;
}

interface ILocation {
  lat: number;
  lng: number;
}

interface IGeometry {
  location: ILocation;
}

interface IResultAddress {
  geometry: IGeometry;
}

interface AddressResponse {
  results: IResultAddress[];
  status: string;
}

function buildGeocodeUrl(params: {street: string, streetNumber: string, postalCode: string, town: string, country: string}) {
  const { streetNumber,  street, postalCode, town, country } = params;

  const hostUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
  const queryParamsUrl = `?address=${streetNumber} ${street}, ${postalCode} ${town}, ${country} `;
  const apiKeyUrl = `&key=${GEOCODE_API_KEY}`;

  return hostUrl + queryParamsUrl + apiKeyUrl;
}

async function fetchAddress(url: string) {
  const response = await axios.get<AddressResponse>(url);
  cacheMiddleware.storeRequest(url, JSON.stringify(response.data));

  return response.data;
}

async function getAddress(params: IAddressParams) {
  const { street, streetNumber, town, postalCode, country } = params;

  const requestUrl = buildGeocodeUrl({ street, streetNumber, postalCode, town, country });

  const cacheResponse = await cacheMiddleware.getRequest(requestUrl) as AddressResponse;
  let fetchResponse = null;

  if (cacheResponse === null) {
    fetchResponse = await fetchAddress(requestUrl);
  }

  return cacheResponse || fetchResponse;
}

export async function getAddressCoordinates(params: IAddressParams) {

  const response = await getAddress(params);

  if (response.status === 'OK') {
    return response.results[0].geometry.location;
  }
  return null;
}

export async function handler(req: IAddressRequest, res: Response) {
  const addressCoordinates = await getAddressCoordinates(req.query);

  if (addressCoordinates) {
    res.send({
      message: 'The address is valid',
      location: addressCoordinates,
    });
  }
  else {
    res.status(httpCodes.BAD_REQUEST).send({
      message: 'Invalid Address',
    });
  }
}
