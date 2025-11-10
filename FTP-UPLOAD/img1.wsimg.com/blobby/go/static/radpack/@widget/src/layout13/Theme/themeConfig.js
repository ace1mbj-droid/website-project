import { constants } from "@wsb/guac-widget-core";
import {
  FILL,
  FIT,
  INSET,
  BLUR,
  LEGACY_BLUR,
  WIDE_INSET,
  FLEX_FILL,
} from "../../common/constants/headerTreatments";
import {
  IMAGE,
  VIDEO,
  SLIDESHOW,
  NONE,
} from "../../common/constants/mediaTypes";
import { COMMON_BUTTON_CONFIG } from "../../common/constants";
import imageToHeaderTreatments from "../../common/utils/imageToHeaderTreatments";

const {
  colorPackCategories: { NEUTRAL, ACCENT },
  buttons,
  contentPositions: { CENTER },
} = constants;
const {
  LIGHT,
  LIGHT_ALT,
  LIGHT_COLORFUL,
  DARK,
  DARK_ALT,
  DARK_COLORFUL,
  COLORFUL,
  MVP,
} = constants.paintJobs;

const id = "layout13";
const imageTreatments = {
  [FILL]: "category-overlay",
  [FIT]: "category-overlay",
  [INSET]: "category-solid",
  [BLUR]: "category-overlay",
  [LEGACY_BLUR]: "category-overlay",
  [WIDE_INSET]: "category-solid",
  [FLEX_FILL]: "category-overlay",
};
const defaultHeaderTreatment = FILL;
const headerTreatments = imageToHeaderTreatments(imageTreatments);
const headerTreatmentsConfig = {
  defaultHeaderTreatment,
  imageTreatments,
  heroContentItems: ["tagline", "tagline2", "cta"],
  nonHeroContentItems: ["phone"],
  headerTreatments,
  defaultProps: {
    [FLEX_FILL]: {
      fullWidthMedia: false,
      hasNavWithBackground: false,
      roundedCorners: true,
      category: NEUTRAL,
      contentPosition: CENTER,
      alignment: "center",
    },
  },
  mediaSupport: {
    [NONE]: [defaultHeaderTreatment],
    [IMAGE]: Object.keys(imageTreatments),
    [VIDEO]: [defaultHeaderTreatment, FLEX_FILL],
    [SLIDESHOW]: [defaultHeaderTreatment, FLEX_FILL],
  },
};
const defaultPaintJob = MVP;

export default {
  id,
  name: "modern",
  packs: {
    color: "005",
    font: "league-spartan",
  },
  logo: {
    font: "primary",
  },
  packCategories: {
    color: ACCENT,
    paintJob: defaultPaintJob,
  },
  headerProperties: {
    alignmentOption: "center",
  },
  headerTreatmentsConfig,
  showSlideshowTab: true,
  hasNavWithBackground: false,
  paintJobs: [
    LIGHT,
    LIGHT_ALT,
    LIGHT_COLORFUL,
    COLORFUL,
    DARK_COLORFUL,
    DARK_ALT,
    DARK,
  ],
  defaultPaintJob,
  buttons: {
    primary: {
      fill: buttons.fills.SOLID,
      shape: buttons.shapes.ROUND,
      decoration: buttons.decorations.NONE,
      shadow: buttons.shadows.NONE,
      color: buttons.colors.PRIMARY,
    },
    secondary: {
      fill: buttons.fills.SOLID,
      decoration: buttons.decorations.NONE,
      shadow: buttons.shadows.NONE,
      color: buttons.colors.PRIMARY,
    },
    ...COMMON_BUTTON_CONFIG,
  },
  defaultNavFamily: "nav10",
  hasLogoOverhang: true,
  hasStickyNav: true,
  hasLogoBorder: false,
};
