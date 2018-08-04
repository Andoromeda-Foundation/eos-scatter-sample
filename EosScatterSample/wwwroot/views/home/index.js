component.data = function () {
    return {
        requiredFields: null,
        eos: null,
        network: null,
        account: null,
        chainId: null
    };
};

component.created = function () {
    
};

component.methods = {
    init_scatter: function () {
        if (!('scatter' in window)) {
            app.notification('important', '没有找到Scatter', 'Scatter是一款EOS的Chrome插件，运行本例程需要使用Chrome并安装Scatter插件。', '我知道了');
        }

        var self = this;
        qv.get('http://127.0.0.1:8888/v1/chain/get_info')
            .then(x => {
                self.chainId = x.chain_id;
                self.network = {
                    blockchain: 'eos',
                    host: '127.0.0.1',
                    port: 8888,
                    protocol: 'http',
                    chainId: self.chainId,
                    verbose: true,
                    debug: true
                };
                scatter.getIdentity({ accounts: [self.network] }).then(identity => {
                    self.account = identity.accounts.find(acc => acc.blockchain === 'eos');
                    self.eos = scatter.eos(self.network, Eos.Localnet, {}, "http");
                    self.requiredFields = { accounts: [self.network] };
                });
            });
    },
    hello: function () {
        app.notification('pending', '正在调用hello合约');
        var requiredFields = this.requiredFields;
        this.eos.contract('hello', { requiredFields }).then(contract => {
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
        var requiredFields = this.requiredFields;
        this.eos.contract('counter', { requiredFields }).then(contract => {
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
        var requiredFields = this.requiredFields;
        this.eos.contract('counter', { requiredFields }).then(contract => {
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