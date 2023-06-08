export const getLocation = async () => {
  if (!navigator.geolocation) {
    return "Geolocation is not supported by your browser";
  } else {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        return `${position.coords.latitude},${position.coords.longitude}`;
      },
      () => {
        return "Unable to retrieve your location";
      }
    );
  }
};

const detectCity = async (location: any) => {
  if (!location) return;

  const response = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${location.latitude}&longitude=${location.longitude}&localityLanguage=en`
  );
  const data = await response.json();

  return data;
};
