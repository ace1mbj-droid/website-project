const forwardslash = "/";
const constants = {
  // eslint-disable-next-line max-len
  postMessageScript: `<script>window.onmessage = function(event) {event.source.postMessage({iframeId: event.data, scrollHeight: document.body.getBoundingClientRect().height || document.body.scrollHeight}, event.origin);};<${forwardslash}script>`,
  centerOpenTag: '<div style="display: flex; justify-content: center">',
};

module.exports = constants;
