# Weather-API  ✨

Weather-API is a REST API that allows the user to validate addresses and fetch the weather of a certain address. It also lets the user choose notification timeframes with the chosen precipitation types (Clouds, Rain, Snow...).

The application was developed using Node.js/Typescript and Express as the Backend framework.

## How to execute
```bash
foo@bar:~$ docker-compose up
```

> Note: In order to execute the application succesfully a properly filled .env file is needed. The .env.template file format must be followed

## Services

- Mongo DB (Database layer)
- Redis (Cache layer)
- Node.js server (API)

All the needed services are dockerized. See `docker-compose.yml`

## Github OAuth flow

API authentication relies on the Github OAuth server. In order to get an access token the user must call the login API endpoint from the browser and go through the consent page successfully. Once the user's Github credentials have been validated, a authentication code will be exchanged for an access token. The user will be able to see an access token in the browser page. 

```sh
localhost:3000/login/github
{
    access_token=XXXXXXXXXXXXXXXXXXXXXX
}
```

This access token must be included in every API request inside the Authorization header, if the Authorization header is missing or an invalid/expired access token is provided the API returns a `401 Unathorized` status code.

## Cache Layer

The Redis database is used for:

- Cache all the usages of external services with a TTL of 12 hours. 
- Cache accces tokens and user data with a TTL of 10 hours.
- Token validation. The cache layer validates incoming requests if the provided access token is stored.

## Database Layer

The MongoDB database is used for storing queried addresses and user notification schedules.

## API

#### /login/github `GET`

Redirects to Github consent page. If Github authentication is succesfull, the page triggers the callback function sending an Authorization code.

### /login/github/callback `GET`

Exchanges Authorization code for access token

#### Response sample
```
{
    access_token: XXXXXXXXXXXXX   
}
```

#### Url Params
**Required:**
`code=[string]`

#### /validate-address `GET`
Receives an address object, validate if the address exists and return the coordinates.

#### Url Params

**Required:**
   `street=[string]`
   `streetNumber=[integer]`
   `town=[string]`
   `postalCode=[string|number]`
   `country=[string]`
    

#### Request sample 
```bash
GET http:// localhost:3000/validate-address?street=Kiwittsmoor&streetNumber=36&town=Hamburg&postalCode=22417&country=Germany --header authorization: {ACCESS_TOKEN}
```
### Response sample
```json
{
    "message": "The address is valid",
    "location": {
        "lat": 53.678477,
        "lng": 10.021876
    }
}
```

#### /weather `GET`
Receives and address object, validate if the address exists and returns the following fields:
- current: current forecast
- hourly: hourly forecast for the following 48 hours
- daily: hourly forecast for the following 2 days

#### Url Params
**Required:**
   `street=[string]`
   `streetNumber=[integer]`
   `town=[string]`
   `postalCode=[string|number]`
   `country=[string]`
   
#### Request sample
```bash
GET http://localhost:3000/weather?street=Kiwittsmoor&streetNumber=36&town=Hamburg&postalCode=22417&country=Germany --header authorization: {ACCESS_TOKEN}
```

#### Response sample
```json
{
    "current": {
        "dt": 1616663298,
        "sunrise": 1616648995,
        "sunset": 1616694099,
        "temp": 8.51,
        "feels_like": 6.62,
        "pressure": 1020,
        "humidity": 87,
        "dew_point": 6.47,
        "uvi": 1.47,
        "clouds": 75,
        "visibility": 7000,
        "wind_speed": 1.54,
        "wind_deg": 200,
        "weather": [
            {
                "id": 803,
                "main": "Clouds",
                "description": "broken clouds",
                "icon": "04d"
            }
        ]
    },
}
```
> Note: For the sake of simplicity the response sample snippet only shows the current object.

#### /schedules/create `POST`
Creates a notification timeframe.

#### Body Params
**Required:**
   `start_range=[string]`
   `end_range=[integer]`
**Optional:**
    `precipitation_types=array[string]`

### Request sample
```bash
POST  http://localhost:3000/schedules/create --header authorization: {ACCESS_TOKEN}
```
#### Body Request sample
```json
{
    "start_range": 10,
    "end_range": 12,
    "precipitation_types": [
        "Clouds"
    ]
}
```
#### Body Response sample
```json
{
    "message": "Schedule succesfully created"
}
```
> Note: The user will receive a notification if it's cloudy from 10AM until 12AM.  
> Note: The date must be GMT+00

#### /schedules/update/:id `PUT`
Modifies an existing notification timeframe

#### Body Params
**Required:**
   `start_range=[string]`
   `end_range=[integer]`
**Optional.**
`precipitation_types=array[string]`

### Request sample
```bash
POST  http://localhost:3000/schedules/update --header authorization: {ACCESS_TOKEN}
```
#### Body Request sample
```json
{
    "start_range": 10,
    "end_range": 12,
    "precipitation_types": [
        "Rain"
    ]
}
```
#### Body Response
```json
{
    "message": "Schedule succesfully updated"
}
```
#### /schedules/delete/:id `DELETE`
Deletes an existing notification timeframe

#### Request sample
```bash
DELETE http://localhost:3000/schedules/delete/605b77945dea6605e6f7524d ---headers authorization: {ACCESS_TOKEN}
```
#### Response sample
```json
{
    "message": "Schedule succesfully deleted"
}
```

## User nofifications

The Node.js server implements a cron-job that check user notifications every 10 minutes.

### Notification mail sample
```
Hi! amate97@gmail.com. You are receiving this alert from 10 to 11 for the following precipitations: Clouds

Arabial 5, Granada 18003: [{"type":"Clouds","description":"few clouds","timestamp":"2021-03-25T11:00:00.000Z"},{"type":"Clouds","description":"overcast clouds","timestamp":"2021-03-26T10:00:00.000Z"},{"type":"Clouds","description":"overcast clouds","timestamp":"2021-03-26T11:00:00.000Z"}]

Gran vía 5, Barcelona 18003: [{"type":"Clouds","description":"scattered clouds","timestamp":"2021-03-25T10:00:00.000Z"},{"type":"Clouds","description":"scattered clouds","timestamp":"2021-03-25T11:00:00.000Z"},{"type":"Clouds","description":"broken clouds","timestamp":"2021-03-26T10:00:00.000Z"},{"type":"Clouds","description":"broken clouds","timestamp":"2021-03-26T11:00:00.000Z"}]

Kiwittsmoor 36, Hamburg 22417: [{"type":"Clouds","description":"broken clouds","timestamp":"2021-03-25T10:00:00.000Z"},{"type":"Clouds","description":"broken clouds","timestamp":"2021-03-25T11:00:00.000Z"},{"type":"Clouds","description":"few clouds","timestamp":"2021-03-26T10:00:00.000Z"},{"type":"Clouds","description":"few clouds","timestamp":"2021-03-26T11:00:00.000Z"}]
```

> Note: The user must create a notification schedule in order to receive mails. 
