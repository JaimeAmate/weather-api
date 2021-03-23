import redache from 'redache';

const cacheClient = new redache({
  host: 'cache',
  port: '6379',
});

const REQUEST_TTL = 43200;
const ACCESS_TOKEN_TTL = 36000;

async function storeRequest(url: string, response: string) {
  await cacheClient.set(url, response, REQUEST_TTL);
}

async function getRequest(url: string) {
  const cacheResponse = await cacheClient.get(url);
  return cacheResponse;
}

async function storeAccessToken(accessToken: string | null, userData: string | null) {
  await cacheClient.set(`token_${accessToken}`, userData, ACCESS_TOKEN_TTL);
}

async function getUser(accesToken: string | undefined) {
  const cacheResponse = await cacheClient.get(`token_${accesToken}`);

  return cacheResponse;
}

export { storeRequest, getRequest, storeAccessToken, getUser };
