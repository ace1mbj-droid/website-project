import React from "react";
import PropTypes from "prop-types";
import GoogleMapsClient from "./googleMapsClient";
import StaticMap from "./staticMap";
import mapTypes from "../constants/mapTypes";

class GenericMap extends React.Component {
  // Commenting for change
  render() {
    const { type } = this.props;

    switch (type) {
      case mapTypes.STATIC:
        return <StaticMap />;
      case mapTypes.GOOGLEMAPS_PROVIDER:
        return <GoogleMapsClient {...this.props} />;
      default:
        // should never default since only map type that matches a defined provider will have map enabled
        return null;
    }
  }
}

GenericMap.propTypes = {
  type: PropTypes.string,
  ...GoogleMapsClient.propTypes,
};

export default GenericMap;
