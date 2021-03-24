import { NextFunction, Request, Response } from 'express';
import { isArray } from 'node:util';
import httpCodes from '../utils/httpCodes';

export interface IAddressRequest extends Request {
  query: {
    street: string;
    streetNumber: string,
    town: string,
    postalCode: string,
    country: string,
  };
}

export function validateAddressRequest(req: IAddressRequest, res: Response, next: NextFunction) {
  const { street, streetNumber, town, postalCode, country } = req.query;

  if (!street) {
    res.status(httpCodes.BAD_REQUEST).send({
      message: 'Missing street',
    });
    return;
  }

  if (!streetNumber) {
    res.status(httpCodes.BAD_REQUEST).send({
      message: 'Missing street number',
    });
    return;
  }

  if (!parseInt(streetNumber, 10)) {
    res.status(httpCodes.BAD_REQUEST).send({
      message: 'Invalid street number. Street number should be a number',
    });
    return;
  }

  if (!town) {
    res.status(httpCodes.BAD_REQUEST).send({
      message: 'Missing town',
    });
    return;
  }

  if (!postalCode) {
    res.status(httpCodes.BAD_REQUEST).send({
      message: 'Missing postal Code',
    });
    return;
  }

  if (!country) {
    res.status(httpCodes.BAD_REQUEST).send({
      message: 'Missing country',
    });
    return;
  }

  next();
}

export interface ICreateNotificationScheduleRequest extends Request{
  body: {
    start_range: number,
    end_range: number,
    precipitation_types?: string[]
  }
}

export function validateCreateNotificationScheduleRequest (req: ICreateNotificationScheduleRequest, res: Response, next: NextFunction) {
  const { start_range, end_range, precipitation_types } = req.body;
  
  if (!start_range) {
    res.status(httpCodes.BAD_REQUEST).send({
      message: 'Missing start range'
    });
    return;
  }

  if (!end_range) {
    res.status(httpCodes.BAD_REQUEST).send({
      message: 'Missing end range'
    });
    return;
  }

  if (typeof start_range === 'string') {
    res.status(httpCodes.BAD_REQUEST).send({
      message: 'start_range must be an integer'
    });
    return;
  }

  if (typeof end_range === 'string') {
    res.status(httpCodes.BAD_REQUEST).send({
      message: 'end_range must be an integer'
    });
    return;
  }

  if (!Number.isInteger(start_range)) {
    res.status(httpCodes.BAD_REQUEST).send({
      message: 'start_range must be an integer'
    });
    return;
  }

  if (!Number.isInteger(end_range)) {
    res.status(httpCodes.BAD_REQUEST).send({
      message: 'end_range must be an integer'
    });
    return;
  }

  if (start_range < 0 || start_range > 23) {
    res.status(httpCodes.BAD_REQUEST).send({
      message: 'Invalid Range. Start date should be an integer between 0 and 23'
    });
    return;
  }

  if (end_range < 0 || end_range > 23) {
    res.status(httpCodes.BAD_REQUEST).send({
      message: 'Invalid Range. End date should be an integer between 0 and 23'
    });
    return;
  }

  if (precipitation_types && !Array.isArray(precipitation_types)){
    res.status(httpCodes.BAD_REQUEST).send({
      message: 'precipitation_types must be an array'
    });
    return;
  }

  if (precipitation_types) {
    const ALLOWED_WEATHER = ['Clear', 'Clouds', 'Rain', 'Snow'];

    for (const precipitationsType of precipitation_types) {
      if (!ALLOWED_WEATHER.includes(precipitationsType)) {
        res.status(httpCodes.BAD_REQUEST).send({
          message: `Invalid precipitation_type. ${precipitation_types} is not valid weather`
        });
        return;
      }
    }
  }

  next();
}

export interface IDeleteNotificationScheduleRequest extends Request{
  body: {
    id: string
  }
}

export function validateDeleteNotificationScheduleRequest (req: IDeleteNotificationScheduleRequest, res: Response, next: NextFunction) {
  const { id } = req.body;
  
  if (!id) {
    res.status(httpCodes.BAD_REQUEST).send({
      message: 'Missing id'
    });
    return;
  }

  if(typeof id !== 'string'){
    res.status(httpCodes.BAD_REQUEST).send({
      message: 'Invalid id. id must be a string'
    })
  }

  next();
}