// Dependencies
const React = require("react");

const { wrapRender } = require("./rep-utils");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders undefined value
 */
const Undefined = function (props) {
  return (
    span({
      key: props.key,
      className: "objectBox objectBox-undefined"
    }, "undefined")
  );
};

function supportsObject(object, type) {
  if (object && object.type && object.type == "undefined") {
    return true;
  }

  return (type == "undefined");
}

// Exports from this module

module.exports = {
  rep: wrapRender(Undefined),
  supportsObject,
};
