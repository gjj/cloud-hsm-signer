import * as dotenv from "dotenv";
import { DefaultAzureCredential } from "@azure/identity";
import { KeyClient } from "@azure/keyvault-keys";

dotenv.config();

const credential = new DefaultAzureCredential();

// Build the URL to reach your key vault
const vaultName = process.env.AZURE_KEY_VAULT_NAME;
const url = `https://${vaultName}.vault.azure.net`; // or `https://${vaultName}.managedhsm.azure.net` for managed HSM.

// Lastly, create our keys client and connect to the service
const client = new KeyClient(url, credential);

const keyName = process.env.AZURE_KEY_NAME;

async function main() {
  const latestKey = await client.getKey(keyName);
  console.log(`Latest version of the key ${keyName}: `, latestKey);
}

main();
