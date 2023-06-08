export const getLocation = async () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        resolve({ latitude, longitude });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

const detectCity = async (location: any) => {
  if (!location) return;

  const response = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${location.latitude}&longitude=${location.longitude}&localityLanguage=en`
  );
  const data = await response.json();

  return data;
};
