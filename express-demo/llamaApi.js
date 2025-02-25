const request = require('request');

_LLAMA_API_URL = "http://localhost:11434/api/chat";

const callLLama = (req, res) => {
    request({
        uri: _LLAMA_API_URL,
        method: req.method,
        json: req.body
    }, (error, response, body) => {
        if (error) {
            res.status = response.statusCode;
        }
        res.body(body);
    }
    )
}  

module.exports.callLLamaApi = callLLama;