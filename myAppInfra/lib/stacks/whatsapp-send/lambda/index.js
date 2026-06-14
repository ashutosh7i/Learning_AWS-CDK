const axios = require('axios');

// httpbin.org returns the requested HTTP status — mix of success and failure codes.
const STATUS_CODES = [200, 201, 204, 400, 404, 500, 503];

async function callRandomStatusApi() {
  const statusCode = STATUS_CODES[Math.floor(Math.random() * STATUS_CODES.length)];
  const url = `https://httpbin.org/status/${statusCode}`;

  const response = await axios.get(url, {
    validateStatus: () => true,
    timeout: 10000,
  });

  if (response.status >= 400) {
    throw new Error(`Downstream API returned HTTP ${response.status} (${url})`);
  }

  return response.status;
}

exports.handler = async function (event) {
  for (const record of event.Records) {
    const status = await callRandomStatusApi();
    console.log(
      `Processed message ${record.messageId} after API returned HTTP ${status}:`,
      record.body,
    );
  }
};
