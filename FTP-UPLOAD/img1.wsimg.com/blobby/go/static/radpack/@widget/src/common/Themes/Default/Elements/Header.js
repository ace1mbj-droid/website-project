import { isNav10 } from "../../../utils/navFamily";
import { FLEX_FILL } from "../../../constants/headerTreatments";

export function Phone({ treatment, ...props }) {
  const style = {
    a: {
      textDecoration: "none",
    },
  };

  if (treatment === FLEX_FILL) {
    style.fontSize = "large";
  }

  return this.Text(
    this.merge(
      {
        typography: "BodyBeta",
        featured: true,
        style,
      },
      props
    )
  );
}

export function NavBarPhone(props) {
  return this.Phone(
    this.merge(
      {
        ...(isNav10(this.base) && {
          typography: "BodyAlpha",
        }),
        style: {
          ["@md"]: {
            marginBottom: 0,
          },
        },
      },
      props
    )
  );
}

export function MembershipHeading(props) {
  return this.Text(
    this.merge(
      {
        typography: "BodyAlpha",
        style: {
          paddingHorizontal: "medium",
          paddingBottom: 0,
          cursor: "auto",
        },
      },
      props
    )
  );
}
