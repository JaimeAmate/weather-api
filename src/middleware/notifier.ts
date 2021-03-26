import { getWeather, IForecast } from '../controllers/weather';
import mailer from '../config/mailer';
import { MAIL_USERNAME } from '../config/environmentVariables';
import { getNotificationSchedules, getUserAddresses } from './databaseLayer';
import { INotificationSchedule } from '../database/notificationSchedule/types';
import { IAddress } from '../database/address/types';
import { convertUnixTimestampToDate } from '../utils/dateUtils';

function sendEmail(userEmail: string, body: string) {

  const mailOptions = {
    from: MAIL_USERNAME,
    to: userEmail,
    subject: 'Weather Alert Message',
    text: body
  };

  mailer.sendMail(mailOptions);
}

interface IWeather {
  type: string;
  description: string;
  timestamp: Date;
}

interface IAddressForecast {
  address: IAddress,
  userForecasts: IWeather[]
}


function checkForecast(forecast: IForecast, schedule: INotificationSchedule): IWeather | null  {
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
      timestamp: convertUnixTimestampToDate(forecast.dt),
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

  return userForecasts;
}

function notifyUser(schedule: INotificationSchedule, notifications: IAddressForecast[]) {
  const { email, startRange, endRange } = schedule;
  let text = `Hi! ${email}. You are receiving this alert from ${startRange} to ${endRange} for the following precipitations: ${schedule.precipitationTypes} \n\n`;

  for (const notification of notifications) {
    text += `${notification.address.street} ${notification.address.streetNumber}, ${notification.address.town} ${notification.address.postalCode}: ${JSON.stringify(notification.userForecasts)} \n`
  }
  
  sendEmail(email, text);
}

export async function checkUserSchedules() {
  // get users schedules
  const schedules = await getNotificationSchedules();

  for (const schedule of schedules) {
    // get users stored addresses
    const notifications = [];
    const addresses = await getUserAddresses(schedule.email);

    for (const address of addresses) {
      const userForecasts = await checkAddress(address, schedule);

      if (userForecasts.length) {
        notifications.push({
          address, 
          userForecasts
        });
      }
    }

    if (notifications.length) {
      notifyUser(schedule, notifications);
    }
  }
}
