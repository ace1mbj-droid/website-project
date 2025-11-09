import React from "react";
import { UX2 } from "@wsb/guac-widget-core";
import DataAid from "../constants/data-aids";
import { getImageUrl } from "../utils/helper";

class StaticMap extends React.Component {
  render() {
    const styles = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      position: "absolute",
      display: "block",
      backgroundImage: `url('${getImageUrl("mapIcon/mboxThumb.png")}')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };

    return (
      <UX2.Element.Block
        data-aid={DataAid.CONTACT_MAP_STATIC_REND}
        style={styles}
        data-traffic2="pandc.vnext.edit_widget_contact.static_map.click"
      />
    );
  }
}

export default StaticMap;
