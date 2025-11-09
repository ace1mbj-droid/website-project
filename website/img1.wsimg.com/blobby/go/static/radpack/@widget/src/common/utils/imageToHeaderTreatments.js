import {
  FLEX_FILL,
  LEGACY_BLUR,
  WIDE_INSET,
} from "../constants/headerTreatments";

const priorityTreatments = [FLEX_FILL, WIDE_INSET];
export default function imageToHeaderTreatments(imageTreatments) {
  return Object.keys(imageTreatments)
    .filter((treatment) => treatment !== LEGACY_BLUR)
    .sort((t) => (priorityTreatments.includes(t) ? -1 : 1));
}
