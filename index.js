function createLib (execlib) {
  'use strict';

  return execlib.loadDependencies('client', ['allex:dboperationsawarehotel:lib'], require('./libindex').bind(null, execlib));
}

module.exports = createLib;
