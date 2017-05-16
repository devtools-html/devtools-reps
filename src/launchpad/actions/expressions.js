const constants = require("../constants");
const { generateKey } = require("../utils/utils");

function evaluateInput(input) {
  return async function ({ dispatch, client }) {
    const packet = await client.evaluate(input, {});
    dispatch(addExpression(input, packet));
  };
}

function addExpression(input, packet) {
  return {
    key: generateKey(),
    type: constants.ADD_EXPRESSION,
    value: {
      input,
      packet
    }
  };
}

function clearExpressions() {
  return {
    type: constants.CLEAR_EXPRESSIONS
  };
}

function showResultPacket(key) {
  return {
    key,
    type: constants.SHOW_RESULT_PACKET
  };
}

function hideResultPacket(key) {
  return {
    key,
    type: constants.HIDE_RESULT_PACKET
  };
}

module.exports = {
  addExpression,
  clearExpressions,
  evaluateInput,
  showResultPacket,
  hideResultPacket
};
