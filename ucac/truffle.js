module.exports = {
    networks: {
        testrpc: {
            host: "localhost",
            port: 8545,
            network_id: "*" // Match any network id
        },
        gethtest: {
            host: "localhost",
            port: 8545,
            network_id: 58342
        },
        ganache: {
            host: "localhost",
            port: 7545,
            network_id: "*"
        }
    }
};
