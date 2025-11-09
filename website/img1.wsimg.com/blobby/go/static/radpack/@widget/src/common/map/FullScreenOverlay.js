import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { UX2, constants } from "@wsb/guac-widget-core";
import { getImageUrl } from "../utils/helper";
import dataAids from "../constants/data-aids";

const { Z_INDEX_FULL_SCREEN_OVERLAY } = constants.layers;

export default class FullScreenOverlay extends Component {
  static propTypes = {
    renderMap: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleGetDirections: PropTypes.func.isRequired,
    getDirectionsLabel: PropTypes.string.isRequired,
    container: PropTypes.node.isRequired,
  };

  constructor() {
    super(...arguments);
    this.el = document.createElement("div");
    this.el.className = "x";
    this.mapContainer = null;
  }

  componentDidMount() {
    const { renderMap } = this.props;
    const viewPort = document.querySelector(
      ".device-chrome.device-chrome-mobile .viewport"
    );
    Object.assign(
      this.el.style,
      {
        backgroundColor: "#ffffff",
        zIndex: Z_INDEX_FULL_SCREEN_OVERLAY,
      },
      viewPort
        ? {
            position: "absolute",
            left: viewPort.style.left,
            right: viewPort.style.right,
            top: viewPort.style.top,
            bottom: viewPort.style.bottom,
            width: viewPort.style.width,
            height: viewPort.style.height,
          }
        : {
            position: "fixed",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
          }
    );
    this.parentContainer = viewPort ? viewPort.parentNode : document.body;

    this.parentContainer.appendChild(this.el);
    renderMap(this.mapContainer);
  }

  componentWillUnmount() {
    this.parentContainer.removeChild(this.el);
  }

  render() {
    const { handleClose, getDirectionsLabel, handleGetDirections } = this.props;

    const content = (
      <UX2.Element.Block
        category="neutral"
        section="overlay"
        style={{ width: "100%", height: "100%" }}
        data-aid={dataAids.CONTACT_MAP_MOBILE_OVERLAY}
      >
        <UX2.Element.Link
          tag="a"
          style={{
            position: "absolute",
            right: "small",
            top: "small",
            cursor: "pointer",
            background: `url('${getImageUrl("mapIcon/close.svg")}')`,
            zIndex: 1,
            width: "34px",
            height: "34px",
          }}
          onClick={handleClose}
        />
        <div
          ref={(element) => {
            this.mapContainer = element;
          }}
          style={{
            width: "100%",
            height: "100%",
          }}
        />

        <UX2.Element.Button.Primary
          style={{
            zIndex: 1,
            position: "absolute",
            bottom: "xlarger",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            width: "90%",
          }}
          onClick={handleGetDirections}
          children={getDirectionsLabel}
          solid
        />
      </UX2.Element.Block>
    );
    return ReactDOM.createPortal(content, this.el);
  }
}
