"use strict";

const fs = require("fs");
const path = require("path");
const isLocal = typeof process.pkg === "undefined";
const basePath = isLocal ? process.cwd() : path.dirname(process.execPath);
const chalk = require("chalk");

const {
  NFTName,
  collectionName,
  collectionFamily,
  symbol,
  description,
  baseUriPrefix,
  external_url,
  royaltyFee,
  creators,
} = require(path.join(basePath, "Solana/solanaConfig.js"));
const { startIndex } = require(path.join(basePath, "/src/config.js"));
const gifDir = `${basePath}/../build/gif`;
const jsonDir = `${basePath}/../build/json`;

const metaplexFilePath = `${basePath}/../build/solana`;
const metaplexDir = `${basePath}/../build/solana`;

const setup = () => {
  if (fs.existsSync(metaplexFilePath)) {
    fs.rmSync(metaplexFilePath, {
      recursive: true,
    });
  }
  fs.mkdirSync(metaplexFilePath);
  fs.mkdirSync(path.join(metaplexFilePath, "/json"));
  fs.mkdirSync(path.join(metaplexFilePath, "/gifs"));
};

const getIndividualImageFiles = () => {
  return fs
    .readdirSync(gifDir)
    .filter((item) => /^[0-9]{1,6}.gif/g.test(item));
};

const getIndividualJsonFiles = () => {
  return fs
    .readdirSync(jsonDir)
    .filter((item) => /^[0-9]{1,6}.json/g.test(item));
};

setup();
console.log(chalk.bgGreenBright.black("Beginning Solana/Metaplex conversion"));
console.log({ startIndex });
console.log(
  chalk.green(
    `\nExtracting metaplex-ready files.\nWriting to folder: ${metaplexFilePath}`
  )
);

// Rename all image files to n-1.png (to be zero indexed "start at zero") and store in solana/images
const imageFiles = getIndividualImageFiles();
imageFiles.forEach((file) => {
  let nameWithoutExtension = file.slice(0, -4);
  let editionCountFromFileName = Number(nameWithoutExtension);
  let newEditionCount = editionCountFromFileName - startIndex;
  fs.copyFile(
    `${gifDir}/${file}`,
    path.join(`${metaplexDir}`, "gifs", `${newEditionCount}.gif`),
    () => { }
  );
});
console.log(`\nFinished converting images to being metaplex-ready.\n`);

// Identify json files
const jsonFiles = getIndividualJsonFiles();
console.log(
  chalk.green(`Found ${jsonFiles.length} json files in "${jsonDir}" to process`)
);

// Iterate, open and put in metadata list
jsonFiles.forEach((file) => {
  let nameWithoutExtension = file.slice(0, -4);
  let editionCountFromFileName = Number(nameWithoutExtension);

  const rawData = fs.readFileSync(`${jsonDir}/${file}`);
  const jsonData = JSON.parse(rawData);

  let tempMetadata = {
    name: NFTName + " " + jsonData.name,
    symbol: symbol,
    description: description,
    seller_fee_basis_points: royaltyFee,
    image: `${editionCountFromFileName}.gif`,
    ...(external_url !== "" && { external_url }),
    attributes: jsonData.attributes,
    properties: {
      edition: jsonData.edition,
      files: [
        {
          uri: `${editionCountFromFileName}.gif`,
          type: "image/gif",
        },
      ],
      category: "gif",
      creators: creators,
      compiler: "HashLips Art Engine - Jalagar gif fork | qualifieddevs.io",
    },
  };
  fs.writeFileSync(
    path.join(`${metaplexDir}`, "json", `${editionCountFromFileName}.json`),
    JSON.stringify(tempMetadata, null, 2)
  );
});
console.log(
  `\nFinished converting json metadata files to being metaplex-ready.`
);
console.log(chalk.green(`\nConversion was finished successfully!\n`));
