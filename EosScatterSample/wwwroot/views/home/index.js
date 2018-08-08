﻿component.data = function () {
};

component.created = function () {
    
};

component.methods = {
    ite: function () {
        app.redirect("/ite");
    },
    hello: function () {
        app.notification('pending', '正在调用hello合约');
        var requiredFields = app.requiredFields;
        app.eos.contract('hello', { requiredFields }).then(contract => {
            return contract.hi('hello', { authorization: ["hello@active"] });
        })
        .then(() => {
            app.notification('succeeded', 'hello合约调用成功');
        })
        .catch((err) => {
            app.notification('error', 'hello合约调用失败', err.toString());
        });
    },
    counter_init: function () {
        app.notification('pending', '正在调用counter_init合约');
        var requiredFields = app.requiredFields;
        app.eos.contract('counter', { requiredFields }).then(contract => {
            return contract.init('counter', { authorization: ["counter@active"] });
        })
        .then(() => {
            app.notification('succeeded', 'counter_init合约调用成功');
        })
        .catch((err) => {
            app.notification('error', 'counter_init合约调用失败', err.toString());
        });
    },
    counter_add: function () {
        app.notification('pending', '正在调用counter_add合约');
        var requiredFields = app.requiredFields;
        app.eos.contract('counter', { requiredFields }).then(contract => {
            return contract.add('counter', { authorization: ["counter@active"] });
        })
            .then(() => {
                app.notification('succeeded', 'counter_add合约调用成功');
            })
            .catch((err) => {
                app.notification('error', 'counter_add合约调用失败', err.toString());
            });
    }
};