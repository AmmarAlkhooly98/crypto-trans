# crypto-trans

CLI program to help crypto investors query their portfolio data from a csv file

## Video Demo

https://user-images.githubusercontent.com/48621790/182963152-168ea935-7366-4b98-93b1-fcbed3028fef.mov

## Table of Contents

1. [Usage](#Usage)
2. [Design](#Design)
    1. [/index.js](#installing-dependencies)
    1. [/utils](#/utils)
    1. [/lib](#/lib)
    1. [/lib/index.js](#/lib/index.js)
    1. [/lib/portfolio](#/lib/portfolio)
    1. [/lib/portfolio/csv](#/lib/portfolio/csv)
    1. [/lib/portfolio/index.js](#/lib/portfolio/index.js)
    1. [/lib/portfolio/portfolioBalance.js](#/lib/portfolio/portfolioBalance.js)
    1. [/lib/service](#/lib/service)
    1. [/lib/api](#/lib/api)
    1. [/lib/validation](#/lib/api)
3. [Cache key standard](#Cache-Key-Naming-Conventions)
4. [More Details about crypto-trans](#More-Details-about-crypto-trans)

## Usage

-   Clone/download the [repo](https://github.com/AmmarAlkhooly98/crypto-trans)
-   `npm i`
-   `npm link` (this will allow you to use the `crypto-trans` command to run any cli commands in the repo from your terminal)

### CLI example commands

```
  crypto-trans help                      Print help
  crypto-trans                           get all portfolio balances for each token
  crypto-trans -d 25-10-2019 -t ETH      query portfolio by date and token
  crypto-trans -d 25-10-2019             query portfolio by date
  crypto-trans -t BTC                    query portfolio by token
```

## Cache Key Naming Conventions

###### as the CSV file can be quite large in size, the best way to store the data after readstream would be to save it in memory cache for easy access for later on when the user uses the same query command again to be retrieved from the cache instead of reading the large file. Please follow the cache key naming conventions below:

-   For **no** query input, the cached key should be `tokens`
-   For only **token** query input, the cached key should be dynamic. For example, if the user added _BTC_ as the token query, then the cached key should be `token_BTC`. Where as, if the user query was _ETH_, then the cached key should be `token_ETH`
-   For only **date** query input, the cached key should be dynamic. For example, if the user added _24-10-2019_ as the date query, then the cached key should be `date_24-10-2019`. Where as, if the user query was _10-11-2018_, then the cached key should be `date_10-11-2018`
-   For **date** and **token** query input, the cached key should be dynamic. For example, if the user added _24-10-2019_ as the date query and _BTC_ for the token query, then the cached key should be `token_BTC_date_24-10-2019`

## More Details about crypto-trans

Checkout [crypto-trans](https://www.npmjs.com/package/crypto-trans) for further more details about crypto-trans CLI and upcoming releases.
