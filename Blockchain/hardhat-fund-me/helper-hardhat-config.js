const networkConfig = {
    5: {
        name: "goerli",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"
    },
    137: {
        name: "polygon",
        ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945"
    }
}

const developmentChains = ["hardhat", "localhost"]

// arguments to pass in mock's constructor
const DECIMALS = 8
const INITIAL_ANSWER = 200000000000 // 2000.00..(8 DECIMALS)

module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER
}
