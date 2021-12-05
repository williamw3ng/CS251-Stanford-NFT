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
```

### Deploy

See comments on scripts/deploy.ts.

```shell
yarn hardhat run scripts/deploy.ts --network [mumbai | polygon]
```

### Generate signatures

See comments on scripts/signNonces.ts.

```shell
yarn hardhat run scripts/signNonces.ts --network [mumbai | polygon]
```

### NOTE

To deploy on Polygon, you'll need to set the PRIVATE_KEY of the contract deployer/owner/nonce-signer in a .env file. See .env.example for an example .env.

### Contributing

Please lint all your code before doing a PR.

```shell
yarn run lint
```
