import PropTypes from "prop-types";
import React, { Component } from "react";
import { uniqueId } from "lodash";
import { postMessageScript, centerOpenTag } from "../constants/widgetConstants";

const AUTO_ADJUST_RATE = 500;

function generateBlobUrl(content, type) {
  const blob = new Blob([content], { type });
  return URL.createObjectURL(blob);
}

class AutoIframe extends Component {
  static get propTypes() {
    return {
      centerContent: PropTypes.bool,
      htmlSrc: PropTypes.string,
      iframeHeight: PropTypes.string,
      order: PropTypes.number,
    };
  }

  constructor(props) {
    super(...arguments);
    this.iframe = React.createRef();
    this.isEdge =
      typeof window !== "undefined" && /Edge/.test(window.navigator.userAgent);
    this.iframeId = uniqueId(`iframe-${props.order}`);
  }

  componentDidMount() {
    this.isIE = !!document.documentMode;
    window.addEventListener("message", this.setHeight.bind(this));
    this.autoAdjustHeight(this.props.iframeHeight);
  }

  componentWillUnmount() {
    window.removeEventListener("message", this.setHeight);
    clearTimeout(this.autoAdjustId);
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    clearTimeout(this.autoAdjustId);
    this.autoAdjustHeight(nextProps.iframeHeight);
  }

  autoAdjustHeight(height) {
    if (!this.shouldAutoUpdate(height)) return;
    const iframeEl = this.iframe.current;
    if (
      iframeEl &&
      iframeEl.contentWindow &&
      iframeEl.contentWindow.postMessage
    ) {
      iframeEl.contentWindow.postMessage(iframeEl.getAttribute("id"), "*");
    }
    if (!this.isIE) {
      this.autoAdjustId = setTimeout(
        this.autoAdjustHeight.bind(this),
        AUTO_ADJUST_RATE
      );
    }
  }

  setHeight(event) {
    if (event.data.scrollHeight && event.data.iframeId) {
      const newHeight = `${event.data.scrollHeight}px`;
      const iframeEl = document.getElementById(event.data.iframeId);
      if (iframeEl && iframeEl.style.height !== newHeight) {
        iframeEl.style.height = newHeight;
      }
    }
  }

  shouldAutoUpdate(height) {
    // returns true if height is undefined
    return height === "" || !Number(height);
  }

  render() {
    const { centerContent, iframeHeight, htmlSrc } = this.props;
    const decodedHtml = htmlSrc.replace(/\$script/g, "/script");
    const embed = centerContent
      ? `${postMessageScript}<body style='margin: 0;'>${centerOpenTag}${decodedHtml}</div></body>`
      : `${postMessageScript}<body style='margin: 0'>${decodedHtml}</body>`;

    const iframeStyles = {
      width: "100%",
      display: "block",
      height: iframeHeight ? `${iframeHeight}px` : "auto",
      overflow: "visible",
      transition: "height 1.5s ease",
      WebkitTransition: "height 1.5s ease",
      MozTransition: "height .25s ease",
    };

    const iframeSrc = this.isEdge
      ? generateBlobUrl(embed, "text/html")
      : // eslint-disable-next-line no-script-url
        'javascript: window.frameElement.getAttribute("srcdoc");';

    return (
      // eslint-disable-next-line jsx-a11y/iframe-has-title
      <iframe
        id={this.iframeId}
        frameBorder="0"
        ref={this.iframe}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-top-navigation"
        src={iframeSrc}
        srcDoc={embed}
        style={iframeStyles}
      />
    );
  }
}

export default AutoIframe;
