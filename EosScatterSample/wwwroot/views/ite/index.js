component.data = function () {
    return {
        buy_amount: "0 SYS",
        sell_amount: 0
    };
};

component.created = function () {
    
};

component.methods = {
    buy: function (amount) {
        app.notification('pending', '正在调用itegame_buy(' + amount + ')合约');
        var requiredFields = app.requiredFields;
        app.eos.contract('itegame', { requiredFields }).then(contract => {
            console.warn(amount);
            return contract.buy('itegame', amount, { authorization: ["itegame@active"] });
        })
        .then(() => {
            app.notification('succeeded', 'itegame_buy合约调用成功');
        })
        .catch((err) => {
            app.notification('error', 'itegame_buy合约调用失败', err.toString());
        });
    },
    sell: function (amount) {
        app.notification('pending', '正在调用itegame_sell(' + amount + ')合约');
        var requiredFields = app.requiredFields;
        app.eos.contract('itegame', { requiredFields }).then(contract => {
            console.log(contract);
            return contract.sell('itegame', parseInt(amount), { authorization: ["itegame@active"] });
        })
        .then(() => {
            app.notification('succeeded', 'itegame_sell合约调用成功');
        })
        .catch((err) => {
            app.notification('error', 'itegame_sell合约调用失败', err.toString());
        });
    },
};