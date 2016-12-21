const React = require("react");
const { DOM: dom, PropTypes } = React;

require("./Header.css");

const expressions = {
  array: [
    "x = [1, \"2\", {three: 3}, []]",
    "x = []"
  ],

  object: [
    "x = {a: 2}"
  ],

  function: [
    "x = () => { 2 }"
  ],

  yolo: [

  ]
};

const Header = React.createClass({

  propTypes: {
    evaluate: PropTypes.function
  },

  displayName: "Header",

  evaluateExpressions(label) {
    expressions[label].forEach(
      expression => this.props.evaluate(expression)
    );
  },

  renderLinks() {
    return Object.keys(expressions).map(label => dom.span(
      {
        key: label,
        onClick: () => this.evaluateExpressions(label)
      },
      label
    ));
  },

  onSubmitForm: function(e) {
    e.preventDefault();
    let data = new FormData(e.target);
    let expression = data.get("expression");
    this.props.evaluate(expression);
  },

  render() {
    return dom.div(
      { className: "header" },
      dom.h1({}, "Reps"),
      dom.form({
        onSubmit: this.onSubmitForm,
      },
        dom.input({
          type: "text",
          placeholder: "Enter an expression",
          name: "expression"
        })
      ),
      dom.div(
        { className: "quick-links" },
        this.renderLinks()
      )
    );
  }
});

module.exports = Header;
