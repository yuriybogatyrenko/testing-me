const TESTING = ((() => {
        class TESTING {
            constructor() {
                this.doc = document;
                this.window = window;
                this.storage = localStorage;
            }

            submitData() {
                const _self = this;
                if (!document.querySelector('form'))
                    return;
                document.querySelector('form').onsubmit = function (e) {
                    e.preventDefault();

                    const $values = {};
                    const $errors = {};

                    const $inputs = this.querySelectorAll('input');

                    for (let i = 0; i < $inputs.length; i++) {
                        _self.nextEl($inputs[i]).innerHTML = '';

                        const $field_name = $inputs[i].getAttribute('name');
                        if ($field_name === 'age') {
                            if (parseInt($inputs[i].value) > 17 && parseInt($inputs[i].value) < 51) {
                                $values[$inputs[i].getAttribute('name')] = $inputs[i].value;
                            } else {
                                $errors[$inputs[i].getAttribute('name')] = 'Заполните поле корректно';
                                // return false;
                            }
                        } else {
                            if ($inputs[i].value.length > 2 && $inputs[i].value.length < 15) {
                                $values[$inputs[i].getAttribute('name')] = $inputs[i].value;
                            } else {
                                $errors[$inputs[i].getAttribute('name')] = 'Заполните поле корректно';
                                // return false;
                            }
                        }
                    }

                    if (Object.keys($errors).length === 0) {
                        const xhr = new XMLHttpRequest();

                        xhr.open('POST', './backend.php');
                        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                        xhr.onload = function () {
                            if (xhr.status === 200) {
                                _self.parseUser();
                            }
                            else if (xhr.status !== 200) {
                                alert('Request failed.  Returned status of ' + xhr.status);
                            }
                        };
                        xhr.send(encodeURI(`name=${$values.name}&secondname=${$values.secondname}&lastname=${$values.lastname}&age=${$values.age}`));

                        // $.post('./backend.php', $values, function (response) {
                        //     _self.parseUser();
                        // });
                    } else {
                        for (let key in $errors) {
                            const el = _self.nextEl(document.querySelector('input[name="' + key + '"]'));
                            el.innerHTML = $errors[key];
                        }
                    }
                }
            }

            nextEl(element) {
                do {
                    element = element.nextSibling;
                } while (element && element.nodeType !== 1);
                return element;
            }

            parseUser() {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', './user-file.txt?' + new Date().getTime(), true);
                xhr.setRequestHeader("Cache-Control", "no-cache");
                xhr.setRequestHeader("Pragma", "no-cache");
                xhr.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        const $user = JSON.parse(xhr.responseText);

                        const $placeholders = document.querySelectorAll('.submitted-data [data-content]');

                        for (let key in $user) {
                            for (let i = 0; i < $placeholders.length; i++) {
                                if ($placeholders[i].getAttribute('data-content') === key) {
                                    $placeholders[i].innerHTML = $user[key];
                                }
                            }
                        }

                        console.log('updated');
                    }
                    else {
                        alert('Request failed.  Returned status of ' + xhr.status);
                    }
                };
                xhr.send();

            }

            getBalance() {

                if(!document.querySelector('.balance-area'))
                    return;

                let $timeout,
                    $time = 2000;

                balance();

                function balance() {
                    clearTimeout($timeout);
                    const xhr = new XMLHttpRequest();
                    xhr.open('GET', './backend.php?balance=true&_=' + new Date().getTime(), true);
                    xhr.setRequestHeader("Cache-Control", "no-cache");
                    xhr.setRequestHeader("Pragma", "no-cache");
                    xhr.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
                    xhr.onload = function () {
                        if (xhr.status === 200) {
                            const $response = JSON.parse(xhr.responseText);

                            if ($response.success === true) {
                                document.querySelector('.balance-area').innerHTML = $response.balance;
                                document.querySelector('.error-message').innerHTML = '';
                            } else {
                                document.querySelector('.balance-area').innerHTML = '####';
                                document.querySelector('.error-message').innerHTML = 'произошла ошибка: ' + $response.message;
                            }

                            console.log('balance updated');
                        }
                        else {
                            alert('Request failed.  Returned status of ' + xhr.status);
                        }
                    };
                    xhr.send();

                    $timeout = setTimeout(function () {
                        balance();
                    }, $time)
                }
            }
        }

        return TESTING;
    })()
);


document.addEventListener("DOMContentLoaded", function (event) {
    const app = new TESTING();

    if (document.querySelector('.parse-user')) {
        document.querySelector('.parse-user').addEventListener('click', function () {
            app.parseUser();
        });
    }

    app.parseUser();

    app.submitData();
    app.getBalance();
});





