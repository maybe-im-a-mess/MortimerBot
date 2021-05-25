var request = require('request');
var requestpromise = require('request-promise');
var querystring = require('querystring');

getPrediction = async () => {
    var endpointKey = "b0e625e8baa3485991cc4e513433925a";
    var endpoint = "mortimer-authoring.cognitiveservices.azure.com";
    var appId = "bd4daffe-1565-4382-968a-4d15f6a60752";
    var utterance = "ich will im sommer wandern";
    var queryParams = {
        "show-all-intents": false,
        "verbose": false,
        "query": utterance,
        "subscription-key": endpointKey
    }
    var URI = `https://${endpoint}/luis/prediction/v3.0/apps/${appId}/slots/production/predict?${querystring.stringify(queryParams)}`
    const antwort = await requestpromise(URI);
    console.log(antwort);
}

getPrediction().then(() => console.log("done")).catch((err) => console.log(err));
