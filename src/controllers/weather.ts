import axios from 'axios';
import { Response } from 'express';
import { IAddressRequest } from '../middleware/validation';
import { getAddressCoordinates } from './address';
import * as cacheMiddleware from '../middleware/cacheLayer';
import * as databaseMiddleware from '../middleware/databaseLayer';
import httpCodes from '../utils/httpCodes';

const OPENWEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY;

interface IWeather {
  main: string;
  description: string;
}

export interface IForecast {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  weather: IWeather[];
}

interface IWeatherResponse {
  current: IForecast;
  daily: IForecast[];
  hourly: IForecast[];
}

interface ILocation {
  lat: number;
  lng: number;
}

function buildWeatherUrl(params: ILocation) {
  const { lat, lng } = params;

  const hostUrl = 'https://api.openweathermap.org/data/2.5/onecall';
  const queryParamsUrl = `?lat=${lat}&lon=${lng}&units=metric&exclude=minutely`;
  const apiKeyUrl = `&appid=${OPENWEATHER_API_KEY}`;

  return hostUrl + queryParamsUrl + apiKeyUrl;
}

async function fetchWeather(requestUrl: string) {
  try {
    const response = await axios.get<IWeatherResponse>(requestUrl);
    cacheMiddleware.storeRequest(requestUrl, JSON.stringify(response.data));

    return response.data;
  } catch (e) {
    console.error(e);
  }
}

export async function getWeather(coordinates: ILocation) {
  const requestUrl = buildWeatherUrl(coordinates);

  const cacheResponse = await cacheMiddleware.getRequest(requestUrl) as IWeatherResponse;
  let fetchResponse = null;

  if (cacheResponse === null) {
    fetchResponse = await fetchWeather(requestUrl);
  }

  return cacheResponse || fetchResponse;
}

export async function handler(req: IAddressRequest, res: Response) {
  const [userData, addressCoordinates] = await Promise.all([cacheMiddleware.getUser(req.headers['authorization']), getAddressCoordinates(req.query)]);

  if (addressCoordinates) {
    const { street, streetNumber, postalCode, town, country } = req.query;

    databaseMiddleware.createAddress({
      street,
      streetNumber,
      postalCode,
      town,
      country,
      lat: addressCoordinates.lat,
      lng: addressCoordinates.lng,
      email: userData.email,
    });

    const response = await getWeather(addressCoordinates);
    res.send(response);
  }
  else {
    res.status(httpCodes.BAD_REQUEST).send({
      message: 'Invalid address',
    });
  }
}
