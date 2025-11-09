import React from "react";
import PropTypes from "prop-types";
import { UX2 } from "@wsb/guac-widget-core";
import DataAid from "../constants/data-aids";
import config from "../../config";

const { GOOGLE_MAP_STATIC } = DataAid;

class StaticGoogleMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      staticUrl: "",
    };
  }

  componentDidMount() {
    const { lat, lon, address } = this.props;
    ((lat && lon) || address) && this.generateUrl();
  }

  generateStyles() {
    return {
      width: "100%",
      height: "100%",
      ["@xs-only"]: {
        objectFit: "contain",
        position: "absolute",
      },
    };
  }

  generateUrl() {
    const { lat, lon, address, dimensions, env } = this.props;
    const { height, width } = dimensions;
    const envConfig = (config && config[env]) || {};
    const generateUrlHost = envConfig.generateUrlHost;
    if (!generateUrlHost) return;
    const options = [
      `lat=${lat}`,
      `&lon=${lon}`,
      `&address=${address}`,
      `&height=${height}`,
      `&width=${width}`,
    ].join("");
    window
      .fetch(`${generateUrlHost}/v1/static-google-map?${options}`)
      .then((res) => res.json())
      .then(({ url }) => this.setState({ staticUrl: url }));
  }

  render() {
    const { staticUrl } = this.state;

    return staticUrl ? (
      <UX2.Element.Image
        data-aid={GOOGLE_MAP_STATIC}
        style={this.generateStyles()}
        src={staticUrl}
      />
    ) : null;
  }
}

StaticGoogleMap.propTypes = {
  lat: PropTypes.number,
  lon: PropTypes.number,
  address: PropTypes.string,
  dimensions: PropTypes.object,
  env: PropTypes.string,
};

StaticGoogleMap.defaultProps = {
  dimensions: {
    height: 80,
    width: 275,
  },
};

export default StaticGoogleMap;
