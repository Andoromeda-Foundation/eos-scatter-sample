component.data = function () {
    return {
        amount: "1.0000 EOS",
        to: "itegame",
        balances: [],
        hodl: 0
    };
};

component.created = function () {
    setInterval(() => {
        try {
            this.getBalance();
            this.getHodl();
        } catch (ex) {
        }
    }, 5000);
};

component.methods = {
    getBalance: function () {
        if (app.account.name) {
            var self = this;
            app.eos.getCurrencyBalance('eosio.token', app.account.name).then(x => {
                self.balances = x;
            });
        }
    },
    getHodl: function () {
        if (app.account.name) {
            var self = this;
            app.eos.getTableRows(true, 'itegame', app.account.name, 'userinfo').then(x => {
                if (x.rows.length) {
                    self.hodl = x.rows[0].hodl;
                }
            });
        }
    },
    getPublicKey: function () {
        return qv.get(`/api/chain/account/${app.account.name}/perm/${app.account.authority}`, {}).then(x => {
            return Promise.resolve(x.data);
        });
    },
    transfer: function () {
        var self = this;
        app.notification('pending', '正在调用eosio.token_transfer(' + self.amount + ')合约');
        var requiredFields = app.requiredFields;
        app.eos.contract('eosio.token', { requiredFields })
            .then(contract => {
                return contract.transfer(app.account.name, self.to, self.amount, 'MEMO', { authorization: [`${app.account.name}@${app.account.authority}`] });
            })
            .then(() => {
                app.notification('succeeded', 'eosio.token_transfer合约调用成功');
            })
            .catch((err) => {
                app.notification('error', 'eosio.token_transfer合约调用失败', err.toString());
            });
    }
};