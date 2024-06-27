const express = require('express');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 3012;

function parseApiKeyHeader(apiKeyHeaderValue) {
    if (apiKeyHeaderValue) {
        try {
            return Buffer.from(apiKeyHeaderValue, 'base64');
        } catch (e) {
            console.error(e)
        }
    }
    return undefined;
}

app.get('/with-api-key', (req, res) => {
    var apiKeyHeaderValue = req.headers['api-key'];
    console.log(`appKeyHeaderValue: ${apiKeyHeaderValue}`);

    const apiKey = parseApiKeyHeader(apiKeyHeaderValue);
    console.log(`appKey: ${apiKey}`);

    if (apiKey === "e07b6d9c-28cf-11eb-ade1-0050568f640e") {
        res.send('*** You are in! ***\n');
    } else {
        res.status(401).send('### Oops! ###\n')
    }
})

app.listen(port, () => console.log(`Nginx Proxy Tests is running on port: ${port}`))
