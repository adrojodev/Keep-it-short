export const getCountryFlag = (location: any) => {
  const codePoints = location
    .toUpperCase()
    .split("")
    .map((char: any) => 127397 + char.charCodeAt());

  return String.fromCodePoint(...codePoints);
};

export const getLocation = async () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const location = await detectLocation({ latitude, longitude });
        const countryFlag = getCountryFlag(location.countryCode);

        resolve({
          coordinates: { latitude, longitude },
          position: location,
          countryFlag: countryFlag,
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

const detectLocation = async (location: any) => {
  if (!location) return;

  const response = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${location.latitude}&longitude=${location.longitude}&localityLanguage=en`
  );
  const data = await response.json();

  return data;
};
