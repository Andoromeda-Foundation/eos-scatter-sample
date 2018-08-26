component.data = function () {
    return {
        total: 100000,
        asset: "10.0000 POM",
        balances: [],
        buys: [],
        sells: []
    };
};

component.created = function () {
    setInterval(() => {
        try {
            this.getBalance();
        } catch (ex) {
        }
        try {
            this.getTrades();
        } catch (ex) {
        }
    }, 5000);
};

component.methods = {
    getTrades: function () {
        var self = this;
        app.eos.getTableRows({
            code: 'pomelo',
            scope: 'pomelo',
            table: 'sellrecord',
            json: true,
        }).then(data => {
            self.sells = data.rows;
        });

        app.eos.getTableRows({
            code: 'pomelo',
            scope: 'pomelo',
            table: 'buyrecord',
            json: true,
        }).then(data => {
            self.buys = data.rows;
        });
    },
    getBalance: function () {
        if (app.account.name) {
            var self = this;
            app.eos.getCurrencyBalance('eosio.token', app.account.name).then(x => {
                self.balances = x;
            });
        }
    },
    getPublicKey: function () {
        return qv.get(`/api/chain/account/${app.account.name}/perm/${app.account.authority}`, {}).then(x => {
            return Promise.resolve(x.data);
        });
    },
    buy: function () {
        var self = this;
        app.notification('pending', '正在调用buy合约');
        var requiredFields = app.requiredFields;
        app.eos.contract('pomelo', { requiredFields }).then(contract => {
            return contract.buy(app.account.name, self.asset, self.total, { authorization: [`${app.account.name}@${app.account.authority}`] });
        })
        .then(() => {
            app.notification('succeeded', 'buy合约调用成功');
        })
        .catch((err) => {
            app.notification('error', 'buy合约调用失败', err.toString());
        });
    },
    sell: function () {
        var self = this;
        app.notification('pending', '正在调用sell合约');
        var requiredFields = app.requiredFields;
        app.eos.contract('pomelo', { requiredFields }).then(contract => {
            return contract.sell(app.account.name, self.asset, self.total, { authorization: [`${app.account.name}@${app.account.authority}`] });
        })
        .then(() => {
            app.notification('succeeded', 'sell合约调用成功');
        })
        .catch((err) => {
            app.notification('error', 'sell合约调用失败', err.toString());
        });
    },
    auth: function () {
        app.notification('pending', '正在对合约账户授权');
        return this.getPublicKey()
            .then(key => {
                return app.eos.updateauth({
                    account: app.account.name,
                    permission: app.account.authority,
                    parent: "owner",
                    auth: {
                        "threshold": 1,
                        "keys": [{
                            "key": key,
                            "weight": 1
                        }],
                        "accounts": [{
                            "permission": {
                                "actor": "pomelo",
                                "permission": "eosio.code"
                            },
                            "weight": 1
                        }]
                    }
                });
            })
            .then(() => {
                app.notification('succeeded', '对合约账户授权成功');
                return Promise.resolve(null);
            })
            .catch(err => {
                app.notification('error', '对合约账户授权失败', err.toString());
                return Promise.reject(err);
            });
    },
};