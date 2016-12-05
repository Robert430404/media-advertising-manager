/**
 * AjaxHelpers Class
 *
 * Contains functions that execute and help execute AJAX calls
 */
class AjaxHelpers {
    /**
     * Registers all dependencies to the object, and creates checks
     * before executing the setup functions on this object
     *
     * @return void
     */
    constructor() {
        this.ActionHelpers = new ActionHelpers();
    }

    /**
     * Executes a GET call and returns an ASYNC promise for use inside
     * of the requesting function
     *
     * @param url
     * @returns {Promise}
     */
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

    /**
     * Executes a POST call and returns an ASYNC promise for use inside
     * of the requesting function
     *
     * @param url
     * @param data
     * @returns {Promise}
     */
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

    /**
     * Serializes form data for use inside of the post call, works
     * similarly to the jQuery serialize function
     *
     * @param form
     * @returns {string}
     */
    static serialize(form) {
        let field = [];
        let value = [];

        if (typeof form == 'object' && form.nodeName == "FORM") {
            const length = form.elements.length;

            for (let i = 0; i < length; i++) {
                field = form.elements[i];
                const fieldCheck = ActionHelpers.fieldTypeCheck(field);

                if (fieldCheck) {
                    if (field.type == 'select-multiple') {
                        const optionLength = form.elements[i].options.length - 1;

                        for (let j = optionLength; j >= 0; j--) {
                            if (field.options[j].selected) {
                                value[value.length] = encodeURIComponent(field.name) +
                                                      "=" +
                                                      encodeURIComponent(field.options[j].value);
                            }
                        }
                    } else if ((field.type != 'checkbox' &&
                               field.type != 'radio') ||
                               field.checked) {
                        value[value.length] = encodeURIComponent(field.name) +
                                              "=" +
                                              encodeURIComponent(field.value);
                    }
                }
            }
        }

        return value.join('&').replace(/%20/g, '+');
    }
}