import * as dotenv from "dotenv";
import { keccak256 } from "js-sha3";
import { DefaultAzureCredential } from "@azure/identity";
import { KeyClient, KeyVaultKey } from "@azure/keyvault-keys";

dotenv.config();

const credential = new DefaultAzureCredential();

// Build the URL to reach your key vault
const vaultName = process.env.AZURE_KEY_VAULT_NAME;
const url = `https://${vaultName}.vault.azure.net`; // or `https://${vaultName}.managedhsm.azure.net` for managed HSM.

// Lastly, create our keys client and connect to the service
const client = new KeyClient(url, credential);

const keyName = process.env.AZURE_KEY_NAME;

const derivePublicKey = (bundle: KeyVaultKey) => {
  const merged = Buffer.alloc(bundle.key.x.length + bundle.key.y.length);
  merged.set(bundle.key.x);
  merged.set(bundle.key.y, bundle.key.x.length);
  return merged;
};

const getEthereumAddress = (publicKey: Buffer): string => {
  console.log("Encoded Pub Key: " + publicKey.toString("hex"));
  const ethereumAddress = keccak256(publicKey.toString("hex"));
  return "0x" + ethereumAddress.substring(ethereumAddress.length - 40, ethereumAddress.length);
};

async function main() {
  const latestKey = await client.getKey(keyName);
  console.log(`Latest version of the key ${keyName}: `, latestKey);

  const pubKey = derivePublicKey(latestKey);
  console.log(pubKey);
  const address = getEthereumAddress(pubKey);
  console.log("Derived Ethereum address of HSM key", address, `https://goerli.etherscan.io/address/${address}`);
}

main();
