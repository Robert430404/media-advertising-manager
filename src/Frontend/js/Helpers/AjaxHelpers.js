class AjaxHelpers {
    constructor() {

    }

    getCall(url) {
        return new Promise(function (resolve, reject) {
            let request = new XMLHttpRequest();

            request.open('GET', url);

            request.onload = function () {
                if (request.status === 200) {
                    resolve(JSON.parse(request.response));
                }
                else {
                    reject(new Error(request.statusText));
                }
            };

            request.onerror = function () {
                reject(new Error('Network Error'));
            };

            request.send();
        });
    }

    postCall(url, data) {
        return new Promise(function (resolve, reject) {
            let request = new XMLHttpRequest();

            request.open('POST', url, true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            request.onload = function () {
                if (request.status === 200) {
                    resolve(JSON.parse(request.response));
                }
                else {
                    reject(new Error(request.statusText));
                }
            };

            request.onerror = function () {
                reject(new Error('Network Error'));
            };

            request.send(data);
        });
    }
}