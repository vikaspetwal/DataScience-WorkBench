var urls = require('./urls');
var fetch = require('node-fetch');
module.exports = {

    trainModel: (req, res) => {


        var info = {};
        var predictBody = {};
        var columnData = [];
        var rowData = [];
        var options = {
            method: 'GET',
            headers: {},        // request header. format {a:'1'} or {b:['1','2','3']}
            redirect: 'follow', // set to `manual` to extract redirect headers, `error` to reject redirect
            follow: 20,        // maximum redirect count. 0 to not follow redirect
            timeout: 0,        // req/res timeout in ms, it resets on redirect. 0 to disable (OS limit applies)
            compress: true,    // support gzip/deflate content encoding. false to disable
            size: 0,         // maximum response body size in bytes. 0 to disable
            body: null,       // request body. can be a string, buffer, readable stream
            agent: null       // http.Agent instance, allows custom proxy, certificate etc.
        }
        var statusCode;
        fetch(urls.url + '/regression/trainModel?regressionType=' + req.query.regressionType + '&userId=' + req.query.userId, options)
            .then(function (res) {
                statusCode = res.status;
                return res.text();
            }).then(function (body) {

                if (statusCode == 200) {

                    var jsonString = {};
                    try {

                        var jsonString = {};
                        jsonString = JSON.stringify(eval('(' + body + ')'));;
                        jsonString = JSON.parse(jsonString);

                        rowData = jsonString.rowData;
                        columnData = jsonString.columnData;

                        for (var index = 0; index < columnData.length; index++) {
                            predictBody[columnData[index]] = rowData[index];

                        }
                        jsonString["predictData"] = predictBody;
                        info = {
                            status: true,
                            body: jsonString
                        }


                    }
                    catch (error) {

                        info = {
                            status: true,
                            body: body
                        }
                    }
                } else {

                    info = {
                        status: false,
                        msg: body
                    }
                }
                res.send(info);
                res.end();

            }).catch(function (err) {
                info = {
                    status: false,
                    msg: err
                }
                res.send(info);
                res.end();
            });
    }
}