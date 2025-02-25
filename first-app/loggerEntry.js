const log = require('./logger');
const os = require('os');

log(`freemem ${1}`,os.freemem());
log('message');