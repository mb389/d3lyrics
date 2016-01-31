
var _ = require("lodash");


var data = [];

function add (name, track_id, text) {
  data.push({ name: name, track_id:track_id, text: text });
};

function list () {
  return _.cloneDeep(data);
};

function find (properties) {
  return _.filter(data, properties);
};

module.exports = { add: add, list: list, find: find, data: data };
