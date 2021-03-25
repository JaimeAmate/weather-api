# Weather-API  ✨

Weather-API is a REST API that allows the user to validate addresses and fetch the weather of a certain address. It also lets the user to choose notification timeframes with the precipitation types chosen (Clouds, Rain, Snow...).

The application was developed using Node.js/Typescript as the Backend framework.

## How to execute
```bash
foo@bar:~$ docker-compose up
```

> Note: In order to execute the application succesfully a properly filled .env file is needed. The .env.template file format must be followed

## Services

- Mongo DB (Database layer)
- Redis (Cache layer)
- Node.js server (API)

## Github OAuth flow

API authentication relies on the Github OAuth server. To get an access token the user must call the login API endpoint from the browser and go through the consent page. Once the user Github credentials have been validated, the user should see the access token

```sh
localhost:3000/login/github
{
    access_token=XXXXXXXXXXXXXXXXXXXXXX
}
```

This access token must be included in every API request inside the Authorization header, if the Authorization header is missing or and invalid/expired access token is provided the API returns a 401 Unathorized status code.

## Cache Layer

The Redis database is used for:

- Cache All the usages of external services for 12 hours. 
- Cache accces tokens and user data for 10 hours.
- Token validation.

## Database Layer

The Mongo DB database is used for storing queried addresses and user notification schedules.

## API

#### /login/github `GET`
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
**Optional.**
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

> Note: The user must create a notification schedule in order to receive mails. 
