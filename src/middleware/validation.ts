import { NextFunction, Request, Response } from 'express';
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
