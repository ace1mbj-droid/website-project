import { deviceDetector } from "../utils/helper";

export const updateSpot = ({ map, lat, lon }) => {
  const doUpdateGoogleMaps = () => {
    map.panTo({ lat: parseFloat(lat, 10), lng: parseFloat(lon, 10) });
  };
  const didLoad = map && !!map.mapUrl;

  if (didLoad) {
    setTimeout(doUpdateGoogleMaps, 200);
  }
};

export const openDeviceMap = (address) => {
  const url = deviceDetector.isIOS()
    ? `http://maps.apple.com/?q=${address}`
    : `http://www.google.com/maps/dir//${address}`;
  window.location.href = url;
};

export const markerController = () => {
  return {
    marker: null,
    set: function (map, { lat, lng }) {
      if (!window.google) return;

      this.marker = new window.google.maps.Marker({
        position: { lat, lng },
        map,
      });
    },
    update: function (map, { lat, lng }) {
      this.marker?.setMap?.(null);
      this.marker = null;
      this.set(map, { lat, lng });
    },
  };
};
