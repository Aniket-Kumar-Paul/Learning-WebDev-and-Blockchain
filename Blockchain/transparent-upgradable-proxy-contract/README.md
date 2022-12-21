[ We have two implementation contracts
 First, Proxy will point to Box.sol
 Then we upgrade to point to BoxV2 ]

1. Deploy a Proxy manually
    |_ or, using hardhat-deploy's built-in proxies (using this, here)
    |_ or, openzeppelin upgrades plugin