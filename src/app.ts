import * as dotenv from "dotenv";
import { AzureKeyVaultCredentials, AzureKeyVaultSigner } from "ethersjs-azure-keyvault-signer";
import { getPublicKey } from "ethersjs-azure-keyvault-signer/dist/util/azure_utils";

import { ethers } from "ethers";

dotenv.config();

const keyVaultCredentials: AzureKeyVaultCredentials = {
  keyName: process.env.AZURE_KEY_NAME,
  vaultUrl: `https://${process.env.AZURE_KEY_VAULT_NAME}.vault.azure.net`,
  tenantId: process.env.AZURE_TENANT_ID,
  clientId: process.env.AZURE_CLIENT_ID,
  clientSecret: process.env.AZURE_CLIENT_SECRET,
};

let azureKeyVaultSigner = new AzureKeyVaultSigner(keyVaultCredentials);

const provider = ethers.providers.getDefaultProvider("goerli");
azureKeyVaultSigner = azureKeyVaultSigner.connect(provider);

async function main() {
  console.log("Public key from Key Vault or Cloud HSM:", await getPublicKey(keyVaultCredentials));
  console.log("Derived Ethereum address from public key:", await azureKeyVaultSigner.getAddress());
  const tx = await azureKeyVaultSigner.sendTransaction({
    to: "0x00000000219ab540356cbb839cbe05303d7705fa",
    value: 10000,
  });
  console.log(tx);
}

main();
