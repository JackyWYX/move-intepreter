import {JsonRpcProvider, mainnetConnection} from "@mysten/sui.js";

const MAVEN_PACKAGE = "0xae5e7c832b4a97f2473fcf80fdf2e7ef72bb9d23552bd05d7dd8d428dbb879b9";

const MODULES = [
  "admin_operation",
  "coin_operation",
  "object_operation",
]

async function main() {
  const provider = new JsonRpcProvider(mainnetConnection);
  const module = await provider.getNormalizedMoveModule({
    package: MAVEN_PACKAGE,
    module: MODULES[0],
  });
  console.log(module);
  console.log("Data Fields: ", module.structs.UpdatePermission);
  console.log("Data Type: ", module.structs.UpdatePermission.fields[0].type);
}

main().then( () => {
  console.log("successfully executed");
})

