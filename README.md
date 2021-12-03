# CS251 Stanford NFT

This project implements an ERC721 NFT for Stanford's CS251 Cryptocurrencies and Blockchain Technologies class.

### Install Dependencies

```shell
yarn install
```

### Compile

```shell
yarn hardhat compile
```

### Test Contract

```shell
yarn hardhat test test/index.ts
```

### Test Mint Script

```shell
yarn hardhat test test/uploadAndMintNFT.test.ts
```

### Deploy

```shell
yarn hardhat run scripts/deploy.ts --network [mumbai | polygon]
```

### Mint

Select the appropriate parameters to run the script.

```shell
yarn hardhat run scripts/uploadAndMintNFT.ts --network [mumbai | polygon]
```

### NOTE

You will need Pinata API Keys from the .env file. These are not published along with the GitHub repo. Contact the repo owners to get the keys.
