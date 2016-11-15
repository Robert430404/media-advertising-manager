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

    serialize(form) {
        var field, s = [];

        if (typeof form == 'object' && form.nodeName == "FORM") {
            var len = form.elements.length;

            for (var i = 0; i < len; i++) {
                field = form.elements[i];

                if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
                    if (field.type == 'select-multiple') {
                        for (var j = form.elements[i].options.length - 1; j >= 0; j--) {
                            if (field.options[j].selected)
                                s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[j].value);
                        }
                    } else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
                        s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value);
                    }
                }
            }
        }
        return s.join('&').replace(/%20/g, '+');
    }
}