import { isNav10 } from "../../../utils/navFamily";
import { WIDE_INSET } from "../../../constants/headerTreatments";

export function LogoHeading(props) {
  const { hasLogoBorder, headerTreatment, style = {} } = props;
  const hasLogoFontSelected = style.font === "logo";
  const isWideInset = headerTreatment === WIDE_INSET;

  return this.Heading(
    this.merge(
      {
        typography: "LogoAlpha",
        style: {
          lineHeight: "1.2",
          wordWrap: "break-word",
          overflowWrap: "break-word",
          maxWidth: "100%",
          ...(isNav10(this.base) &&
            hasLogoBorder &&
            !hasLogoFontSelected &&
            !isWideInset && {
              borderWidth: "xsmall",
              borderStyle: "solid",
              borderColor: "highContrast",
              paddingVertical: "xsmall",
              paddingHorizontal: "small",
              lineHeight: 1,
            }),
        },
      },
      props
    )
  );
}
