import express, { NextFunction, Request, Response } from 'express';
import * as cacheMiddleware from '../middleware/cacheLayer';
import axios from 'axios';
import httpCodes from '../utils/httpCodes';
import { URLSearchParams } from 'url';
import { PORT, CLIENT_SECRET, CLIENT_ID } from '../config/environmentVariables';

export async function validateRequest(req: Request, res : Response, next : NextFunction) {
  const authorizationHeader = req.headers['authorization'];

  if (!authorizationHeader) {
    res.status(httpCodes.UNATHORIZED).send({
      message: 'Missing Authorization header',
    });
    return;
  }

  const user = await cacheMiddleware.getUser(authorizationHeader);

  if (user === null) {
    res.status(httpCodes.UNATHORIZED).send({
      message: 'Bad credentials. The provided token is invalid or has been expired',
    });
    return;
  }

  next();
}

export async function loginGithub(req: Request, res: Response) {
  const githubRedirectionUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=http://localhost:${PORT}/login/github/callback`;
  res.redirect(githubRedirectionUrl);
}

async function getAccessToken(params: { code: string, clientId: string | undefined, clientSecret: string | undefined}) {
  const { code, clientId, clientSecret } = params;

  try {
    const response = await axios.post('https://github.com/login/oauth/access_token', {
      code,
      client_id: clientId,
      client_secret: clientSecret,
    });
    const responseParams = new URLSearchParams(response.data);

    return responseParams.get('access_token');
  } catch (error) {
    console.error('Request to Authentication Server failed');
  }

  return null;
}

interface RedirectionRequest extends express.Request {
  query: {
    code: string;
  };
}

async function getUser(accessToken: string | null) {
  const response = await axios.get('https://api.github.com/user', {
    headers: {
      Authorization: `token ${accessToken}`,
    },
  });

  return response.data;
}

export async function callbackMethod(req: RedirectionRequest, res: Response) {
  const code = req.query.code;
  const accessToken = await getAccessToken({ code, clientId: CLIENT_ID, clientSecret: CLIENT_SECRET });

  if (!accessToken) {
    res.status(httpCodes.SERVER_ERROR).send({
      message: 'Request to Authentication Server failed',
    });
    return;
  }

  const userData = await getUser(accessToken);
  cacheMiddleware.storeAccessToken(accessToken, JSON.stringify(userData));

  res.send({
    access_token: accessToken,
  });
}
