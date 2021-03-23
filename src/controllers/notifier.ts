import { AddressModel } from '../database/address/model';
import { getWeather, IForecast } from '../controllers/weather';
import mailer from '../config/mailer';
import { MAIL_USERNAME } from '../config/environmentVariables';

function sendEmail(precipitation: Precipitation, userEmail: string) {

  const mailOptions = {
    from: MAIL_USERNAME,
    to: userEmail,
    subject: 'Weather Alert',
    text: 'That was easy!',
  };

  mailer.sendMail(mailOptions);
}

interface Precipitation {
  type: string;
  description: string;
  timestamp: Date;
}

const PRECIPITATIONS = ['Rain', 'Snow', 'Clouds'];

function checkForecastPrecipitation(forecast: IForecast): Precipitation | null  {
  console.log(forecast.weather);
  const precipitation = forecast.weather.find((weather) => PRECIPITATIONS.includes(weather.main));

  if (precipitation) {
    return {
      type: precipitation.main,
      description: precipitation.description,
      timestamp: new Date(forecast.dt * 1000),
    };
  }

  return null;
}

export async function notifyUsers() {
  const addresses = await AddressModel.find();

  for (const address of addresses) {
    const weatherResponse = await getWeather({ lat: address.lat, lng: address.lng });

    for (const forecast of weatherResponse.hourly) {
      const precipitation = checkForecastPrecipitation(forecast);

      if (precipitation) {
        console.log('DEBUG: ', precipitation);
      }
    }
  }
}
