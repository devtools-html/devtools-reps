const React = require("react");
const { DOM: dom, PropTypes, createFactory } = React;

const { MODE } = require("../../reps/constants");
const Rep = createFactory(require("../../reps/rep"));
const Grip = require("../../reps/grip");

Console = React.createClass({
  getInitialState: function () {
    return {
      expressions: []
    };
  },

  propTypes: {
    client: PropTypes.object.isRequired
  },

  onSubmitForm: function (e) {
    e.preventDefault();
    let data = new FormData(e.target);
    let expression = data.get("expression");
    this.props.client.clientCommands.evaluate(expression, {})
      .then(result => {
        this.setState(function (prevState, props) {
          return {
            expressions: [{
              input: expression,
              packet: result,
            }, ...prevState.expressions]
          };
        });
      })
      .catch(e => {
        console.warn("Error when evaluating", e);
      });
  },

  renderRepInAllModes: function ({object}) {
    return Object.keys(MODE).map(modeKey =>
       this.renderRep({ object, modeKey })
     );
  },

  renderRep: function ({ object, modeKey }) {
    return dom.div(
      {
        className: `rep-element ${modeKey}`,
        key: JSON.stringify(object) + modeKey,
        "data-mode": modeKey,
      },
      Rep({ object, defaultRep: Grip, mode: MODE[modeKey] })
    );
  },

  render: function () {
    return dom.main({},
      dom.form({
        onSubmit: this.onSubmitForm,
      },
        dom.input({
          type: "text",
          placeholder: "Enter an expression",
          name: "expression"
        })
      ),
      dom.div({className: "results"},
        this.state.expressions.map(expression =>
          dom.div({
            className: "rep-row",
            key: JSON.stringify(expression)
          },
            dom.div({className: "rep-input"}, expression.input),
            dom.div({className: "reps"},
              this.renderRepInAllModes({
                object: expression.packet.exception || expression.packet.result
              })
            )
          )
        )
      )
    );
  }
});

module.exports = Console;
