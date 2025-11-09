/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import PropTypes from "prop-types";
import { UX2 } from "@wsb/guac-widget-core";
import DataAid from "../constants/data-aids";
import FullScreenOverlay from "./FullScreenOverlay";
import { updateSpot, openDeviceMap, markerController } from "./mapUtil";
import { loadGoogleMapsLibrary } from "./googleMapsClientUtil";
import { deviceDetector } from "../utils/helper";
import ExpandIcon from "./expandIcon";
import StaticGoogleMap from "./staticGoogleMap";
import { noop } from "lodash";

class GoogleMapsClient extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: deviceDetector.isMobile(),
      isViewPortRender:
        props.viewDevice === "MOBILE_RENDER_DEVICE" &&
        !!document.querySelector(".device-chrome"),
      showMobileOverlay: false,
    };
    this.generateGMap = this.generateGMap.bind(this);
    this.googleMap = null;
    this.mapContainer = null;
    this.markerController = markerController();
    this.currentCoords = { lastLat: null, lastLon: null };
  }

  componentDidMount() {
    loadGoogleMapsLibrary(
      this.generateGMap.bind(this, this.mapContainer, false)
    );
  }

  componentDidUpdate(prevProps) {
    const { lat, lon, address, isEditMode } = this.props;
    const { isMobile } = this.state;
    const { lastLat, lastLon } = this.currentCoords;
    if (lat && lon && lastLat !== lat && lastLon !== lon) {
      updateSpot({
        map: this.googleMap,
        lat,
        lon,
      });
      this.currentCoords = { lastLat: lat, lastLon: lon };
      this.markerController.update(this.googleMap, {
        lat: parseFloat(lat, 10),
        lng: parseFloat(lon, 10),
      });
    }

    if (prevProps.address !== address || (!isEditMode && !isMobile)) {
      this.generateGMap(this.mapContainer);
    }
  }

  toggleMobileOverlay = () => {
    this.setState({
      showMobileOverlay: !this.state.showMobileOverlay,
    });
  };

  handleGetDirections = () => {
    const { address } = this.props;
    openDeviceMap(address);
  };

  renderFullScreenMap = (container) => {
    this.generateGMap(container, true);
  };

  generateGMap(targetContainer, isOverlay = false) {
    const { lat, lon, zoom, viewDevice } = this.props;
    const { isMobile, isViewPortRender } = this.state;
    if (!lat || !lon || !window.google) {
      return;
    }

    const coords = {
      lat: parseFloat(lat, 10),
      lng: parseFloat(lon, 10),
    };

    const mapOptions = {
      center: coords,
      zoom: zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      scrollwheel: false,
      fullscreenControl: false,
      streetViewControl: false,
      zoomControl:
        (isOverlay || !isMobile || viewDevice === "DESKTOP_RENDER_DEVICE") &&
        !isViewPortRender,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP,
      },
    };

    if (isMobile && !isOverlay) {
      mapOptions.gestureHandling = "none";
    }

    this.googleMap = new google.maps.Map(targetContainer, mapOptions);

    // this is needed to display the marker on the map
    // eslint-disable-next-line no-new
    this.markerController.set(this.googleMap, coords);
  }

  render() {
    const {
      lat,
      lon,
      zoom,
      category,
      section,
      address,
      staticContent,
      overrideOverlay,
    } = this.props;
    const { isViewPortRender, showMobileOverlay } = this.state;

    const showMap = Boolean(Number(lat) && Number(lon) && Number(zoom));
    if (!showMap) return null;

    const styles = {
      shared: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        position: "absolute",
        transform: "translate3d(0,0,0)",
      },
      wrapper: {
        display: "block",
        cursor: "pointer",
        position: "absolute !important", // Edit mode
      },
    };

    const shouldRenderOverlay = overrideOverlay;
    const openFullScreenOverlay =
      shouldRenderOverlay && !isViewPortRender
        ? this.toggleMobileOverlay
        : noop;
    const expandIconProps = {
      address,
      staticContent,
      isRouteMobilePreviewPublish: shouldRenderOverlay,
      openFullScreenOverlay,
    };

    return (
      <UX2.Element.Block
        category={category}
        section={section}
        style={{ ...styles.shared, ...styles.wrapper }}
      >
        <div
          ref={(element) => {
            this.mapContainer = element;
          }}
          style={styles.shared}
          data-aid={DataAid.CONTACT_MAP_REND}
          onClick={openFullScreenOverlay}
        >
          {shouldRenderOverlay && <StaticGoogleMap {...this.props} />}
        </div>
        {!isViewPortRender && <ExpandIcon {...expandIconProps} />}
        {showMobileOverlay && (
          <FullScreenOverlay
            getDirectionsLabel={staticContent.mapCTA}
            renderMap={this.renderFullScreenMap}
            handleClose={this.toggleMobileOverlay}
            handleGetDirections={this.handleGetDirections}
          />
        )}
      </UX2.Element.Block>
    );
  }
}

GoogleMapsClient.propTypes = {
  lat: PropTypes.string,
  lon: PropTypes.string,
  zoom: PropTypes.number,
  address: PropTypes.string,
  env: PropTypes.string,
  category: PropTypes.string,
  section: PropTypes.string,
  staticContent: PropTypes.object.isRequired,
  isPublishMode: PropTypes.bool,
  viewDevice: PropTypes.string,
  isEditMode: PropTypes.bool,
  overrideOverlay: PropTypes.bool,
  renderMode: PropTypes.string,
};

GoogleMapsClient.defaultProps = {
  staticContent: {
    mapCTA: "",
  },
};

export default GoogleMapsClient;
