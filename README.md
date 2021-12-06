# CS251 Stanford NFT

This project implements an ERC-721 NFT for Stanford's CS251 Cryptocurrencies and Blockchain Technologies class.

### Install Dependencies

```shell
yarn install
```

### Compile Contract

```shell
yarn hardhat compile
```

### Test Contract

```shell
yarn hardhat test
-- or --
REPORT_GAS=true yarn hardhat test
```

### Deploy

See comments in scripts/deploy.ts.

```shell
yarn hardhat run scripts/deploy.ts --network [mumbai | polygon]
```

### Generate signatures

See comments in scripts/signNonces.ts.

```shell
yarn hardhat run scripts/signNonces.ts --network [mumbai | polygon]
```

### Claim Token

See comments in scripts/claimToken.ts.

```shell
yarn hardhat run scripts/claimToken.ts
```

### Create Random Ethereum Account

```shell
yarn hardhat run scripts/createRandomAccount.ts
```

### Configure Your Account

Check `hardhat.config.ts`. To deploy on Polygon, you'll need to set the `POLYGON_PRIVATE_KEY` variable with your desired account.

### Contributing

Please lint all your code before doing a PR.

```shell
yarn run lint
```
