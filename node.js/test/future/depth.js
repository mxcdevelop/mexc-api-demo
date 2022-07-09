const Future = require('../../src/future')

const client = new Future()


client.DepthBySymbol().then(response => client.logger.log(JSON.stringify(response.data)))
  .catch(error => client.logger.error(error))