import { getWeather, IForecast } from '../controllers/weather';
import mailer from '../config/mailer';
import { MAIL_USERNAME } from '../config/environmentVariables';
import { getNotificationSchedules, getUserAddresses } from '../middleware/databaseLayer';
import { INotificationSchedule } from '../database/notificationSchedule/types';
import { IAddress } from '../database/address/types';
import { convertUnixTimestampToDate } from '../utils/dateUtils';

function sendEmail(precipitation: Weather, userEmail: string) {

  const mailOptions = {
    from: MAIL_USERNAME,
    to: userEmail,
    subject: 'Weather Alert',
    text: 'That was easy!',
  };

  mailer.sendMail(mailOptions);
}

interface Weather {
  type: string;
  description: string;
  timestamp: Date;
}

const PRECIPITATIONS = ['Rain', 'Snow', 'Clouds'];

function checkForecast(forecast: IForecast, schedule: INotificationSchedule): Weather | null  {
  const precipitation = forecast.weather.find((weather) => schedule.precipitationTypes.includes(weather.main));

  const forecastDate = convertUnixTimestampToDate(forecast.dt);

  const startRange = convertUnixTimestampToDate(forecast.dt);
  startRange.setUTCHours(schedule.startRange);

  const endRange = convertUnixTimestampToDate(forecast.dt);
  endRange.setUTCHours(schedule.endRange);

  if (precipitation && startRange <= forecastDate && forecastDate <= endRange) {
    return {
      type: precipitation.main,
      description: precipitation.description,
      timestamp: new Date(forecast.dt * 1000),
    };
  }

  return null;
}

async function checkAddress(address: IAddress, schedule: INotificationSchedule) {
  // get address weather API response
  const weatherResponse = await getWeather({ lat: address.lat, lng: address.lng});
  const userForecasts = [];

  // filter relevant hourly forecast
  for (const forecast of weatherResponse.hourly) {
    const precipitation = checkForecast(forecast, schedule);

    if (precipitation) {
      userForecasts.push(precipitation);
    }
  }

  console.log('FILTERED: ', userForecasts);
}

export async function notifyUsers() {
  // get users schedules
  const schedules = await getNotificationSchedules();
  console.log('DEBUG: ', schedules);
  

  for (const schedule of schedules) {
    // get users stored addresses
    const addresses = await getUserAddresses(schedule.email);

    checkAddress(addresses[0], schedule);
    break;
  }
}
