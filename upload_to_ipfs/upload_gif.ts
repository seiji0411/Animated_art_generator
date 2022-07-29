import fs from "fs";
import path from "path";
import {create, IPFSHTTPClient} from "ipfs-http-client";
// @ts-ignore
import { infura_ipfs_key, infura_ipfs_secret } from "./config.ts";

let ipfs: IPFSHTTPClient;
const tokenIpfs = `${infura_ipfs_key}:${infura_ipfs_secret}`;
const authIpfs = Buffer.from(tokenIpfs).toString('base64');
try {
    ipfs = create({
        url: "https://ipfs.infura.io:5001/api/v0",
        headers: {
            Authorization: `Basic ${authIpfs}`,
        },
        timeout: 600000,
    });
} catch (error) {
    console.error("IPFS error ", error);
    throw new Error("loading IPFS was failed");
}

const main = async () => {
    const allAssets = [];

    console.log("\n\n Loading gifs...\n");
    const imagesFolder = "../build/gif/";

    const files = fs.readdirSync(imagesFolder);

    const params = [];
    for (const index in files) {
        const filename = files[index];
        const filePath = path.join(imagesFolder, files[index]);
        const stat = fs.lstatSync(filePath);

        if (!stat.isDirectory() && filename !== ".DS_Store") {
            const gif = fs.readFileSync(filePath);
            params.push({ path: filename, content: gif });
        }
    }
    const uploaded = await ipfs.addAll(params, { wrapWithDirectory: true, pin: true });

    let cid: string = "";
    try {
        for await (const file of uploaded) {
            console.log("  Uploaded: ", file);
            if (file.path.length === 0) {
                cid = file.cid.toString();
            }
        }
    } catch (err) {
        console.error(err);
    }

    console.log(
        `NFT Metadata uploaded. Directory CID: ${cid}, Number: ${params.length}, Directory Path: https://ipfs.io/ipfs/${cid}/`
    );
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        throw new Error("Excuting failed");
    });