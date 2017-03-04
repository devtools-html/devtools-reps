// Dependencies
const React = require("react");
const {
  createFactories,
  wrapRender,
} = require("./rep-utils");
const Caption = React.createFactory(require("./caption"));
const { MODE } = require("./constants");

const ModePropType = React.PropTypes.oneOf(
  // @TODO Change this to Object.values once it's supported in Node's version of V8
  Object.keys(MODE).map(key => MODE[key])
);

// Shortcuts
const DOM = React.DOM;

/**
 * Renders an array. The array is enclosed by left and right bracket
 * and the max number of rendered items depends on the current mode.
 */
let ArrayRep = React.createClass({
  displayName: "ArrayRep",

  propTypes: {
    mode: ModePropType,
    objectLink: React.PropTypes.func,
    object: React.PropTypes.array.isRequired,
  },

  getTitle: function (object, context) {
    return "[" + object.length + "]";
  },

  arrayIterator: function (array, max) {
    let items = [];
    let delim;

    for (let i = 0; i < array.length && i < max; i++) {
      try {
        let value = array[i];

        delim = (i == array.length - 1 ? "" : ", ");

        items.push(ItemRep({
          object: value,
          // Hardcode tiny mode to avoid recursive handling.
          mode: MODE.TINY,
          delim: delim
        }));
      } catch (exc) {
        items.push(ItemRep({
          object: exc,
          mode: MODE.TINY,
          delim: delim
        }));
      }
    }

    if (array.length > max) {
      items.push(Caption({
        object: this.safeObjectLink({
          object: this.props.object
        }, (array.length - max) + " more…")
      }));
    }

    return items;
  },

  /**
   * Returns true if the passed object is an array with additional (custom)
   * properties, otherwise returns false. Custom properties should be
   * displayed in extra expandable section.
   *
   * Example array with a custom property.
   * let arr = [0, 1];
   * arr.myProp = "Hello";
   *
   * @param {Array} array The array object.
   */
  hasSpecialProperties: function (array) {
    function isInteger(x) {
      let y = parseInt(x, 10);
      if (isNaN(y)) {
        return false;
      }
      return x === y.toString();
    }

    let propsArray = Object.getOwnPropertyNames(array);
    for (let i = 0; i < propsArray.length; i++) {
      let p = propsArray[i];

      // Valid indexes are skipped
      if (isInteger(p)) {
        continue;
      }

      // Ignore standard 'length' property, anything else is custom.
      if (p != "length") {
        return true;
      }
    }

    return false;
  },

  // Event Handlers

  onToggleProperties: function (event) {
  },

  onClickBracket: function (event) {
  },

  safeObjectLink: function (config, ...children) {
    if (this.props.objectLink) {
      return this.props.objectLink(Object.assign({
        object: this.props.object
      }, config), ...children);
    }

    if (Object.keys(config).length === 0 && children.length === 1) {
      return children[0];
    }

    return DOM.span(config, ...children);
  },

  render: wrapRender(function () {
    let {
      object,
      mode = MODE.SHORT,
    } = this.props;

    let items;
    let brackets;
    let needSpace = function (space) {
      return space ? { left: "[ ", right: " ]"} : { left: "[", right: "]"};
    };

    if (mode === MODE.TINY) {
      let isEmpty = object.length === 0;
      items = [DOM.span({className: "length"}, isEmpty ? "" : object.length)];
      brackets = needSpace(false);
    } else {
      let max = (mode === MODE.SHORT) ? 3 : 10;
      items = this.arrayIterator(object, max);
      brackets = needSpace(items.length > 0);
    }

    return (
      DOM.span({
        className: "objectBox objectBox-array"},
        this.safeObjectLink({
          className: "arrayLeftBracket",
          object: object
        }, brackets.left),
        ...items,
        this.safeObjectLink({
          className: "arrayRightBracket",
          object: object
        }, brackets.right),
        DOM.span({
          className: "arrayProperties",
          role: "group"}
        )
      )
    );
  }),
});

/**
 * Renders array item. Individual values are separated by a comma.
 */
let ItemRep = React.createFactory(React.createClass({
  displayName: "ItemRep",

  propTypes: {
    object: React.PropTypes.any.isRequired,
    delim: React.PropTypes.string.isRequired,
    mode: ModePropType,
  },

  render: wrapRender(function () {
    const { Rep } = createFactories(require("./rep"));

    let object = this.props.object;
    let delim = this.props.delim;
    let mode = this.props.mode;
    return (
      DOM.span({},
        Rep({object: object, mode: mode}),
        delim
      )
    );
  })
}));

function supportsObject(object, type) {
  return Array.isArray(object) ||
    Object.prototype.toString.call(object) === "[object Arguments]";
}

// Exports from this module
module.exports = {
  rep: ArrayRep,
  supportsObject: supportsObject
};
