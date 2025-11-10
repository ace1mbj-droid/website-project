import React from "react";
import PropTypes from "prop-types";
import { UX2 } from "@wsb/guac-widget-core";
import { openDirection } from "../utils/helper";
import DataAid from "../constants/data-aids";

class ExpandIcon extends React.Component {
  render() {
    const {
      address,
      staticContent,
      isRouteMobilePreviewPublish,
      openFullScreenOverlay,
    } = this.props;
    const styles = {
      button: {
        position: "absolute",
        left: "xxlarge",
        top: "xsmall",
        width: "auto",
        "@xs-only": {
          fontSize: "xsmall",
          left: "xsmall",
          maxWidth: "90%",
        },
      },
    };

    if (!isRouteMobilePreviewPublish) {
      const label = staticContent.mapCTA;
      const getTCCLString = UX2.utils.TCCLUtils.getTCCLString;
      const tcclString = getTCCLString({
        eid: "ux2.contact.get_directions.click",
        type: "click",
      });

      return (
        <UX2.Element.Button.Primary
          tag="button"
          data-tccl={tcclString}
          onClick={openDirection.bind(null, address)}
          style={styles.button}
          solid
          icon="direction"
          size="small"
        >
          {label}
        </UX2.Element.Button.Primary>
      );
    }

    return (
      <a
        onClick={openFullScreenOverlay}
        style={styles.icon}
        data-aid={DataAid.CONTACT_MAP_EXPAND_ICON}
      />
    );
  }
}

ExpandIcon.propTypes = {
  address: PropTypes.string,
  isRouteMobilePreviewPublish: PropTypes.bool,
  staticContent: PropTypes.object.isRequired,
  openFullScreenOverlay: PropTypes.func.isRequired,
};

export default ExpandIcon;
