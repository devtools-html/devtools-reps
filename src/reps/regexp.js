// ReactJS
const React = require("react");

// Reps
const {
  isGrip,
  safeObjectLink,
  wrapRender,
} = require("./rep-utils");

/**
 * Renders a grip object with regular expression.
 */
RegExp.propTypes = {
  key: React.PropTypes.any,
  object: React.PropTypes.object.isRequired,
  objectLink: React.PropTypes.func,
};

function RegExp(props) {
  let {
    key,
    object,
  } = props;

  return (
    safeObjectLink(props, {
      key,
      className: "objectBox objectBox-regexp regexpSource"
    }, getSource(object))
  );
}

function getSource(grip) {
  return grip.displayString;
}

// Registration
function supportsObject(object, type) {
  if (!isGrip(object)) {
    return false;
  }

  return (type == "RegExp");
}

// Exports from this module
module.exports = {
  rep: wrapRender(RegExp),
  supportsObject,
};
