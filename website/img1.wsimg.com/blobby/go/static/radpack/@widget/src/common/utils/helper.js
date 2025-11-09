import {
  calculateTotalFieldsWeight,
  getFieldsBalancingInfo,
} from "@wsb/guac-widget-shared/lib/common/utils/form";

const getImageUrl = (filename) =>
  `//img1.wsimg.com/isteam/ip/static/${filename}`;

const isSSR = typeof window === "undefined";

const devices = {
  windows: "IEMobile",
  android: "Android",
  blackberry: "BlackBerry",
  ios: "iPhone|iPad|iPod",
};

const isMobile = (
  deviceArray = [
    devices.android,
    devices.blackberry,
    devices.ios,
    devices.windows,
  ]
) =>
  !isSSR &&
  deviceArray.reduce(
    (isMobile_, deviceName) =>
      isMobile_ || new RegExp(deviceName, "i").test(navigator.userAgent),
    false
  );

const isIOS = () => isMobile([devices.ios]);

const openDirection = (address) => {
  const url = `http://maps.google.com/maps?daddr=${address}`;
  window.open(url);
};

const deviceDetector = {
  isMobile,
  isIOS,
};

const getPhoneUri = (phone) => phone && `tel:${phone.replace(/[^\d]/g, "")}`;

// to handle the fact that by default formEnabled is true but options is missing formEnabled: true
const getFormEnabled = (props) => props.formEnabled !== false;

const isNumeric = (n) => !isNaN(parseFloat(n)) && isFinite(n);

const isAddressEmpty = (address) =>
  !(
    address &&
    address.value &&
    isNumeric(address.lat) &&
    isNumeric(address.lng)
  );

const isRouteMobilePreviewPublish = (route) => {
  const isMobilePreview = route && route.match(/mobile/i);
  const isMobilePublish = !route && isMobile();
  return isMobilePreview || isMobilePublish;
};

export {
  getImageUrl,
  deviceDetector,
  isMobile,
  openDirection,
  getPhoneUri,
  getFormEnabled,
  isAddressEmpty,
  isRouteMobilePreviewPublish,
  calculateTotalFieldsWeight,
  getFieldsBalancingInfo,
};
