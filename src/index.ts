import { JsonRpcProvider, mainnetConnection } from "@mysten/sui.js";
import { SuiMoveNormalizedModule, SuiMoveNormalizedType, SuiMoveNormalizedStructType } from "@mysten/sui.js";
const MAVEN_PACKAGE = "0xae5e7c832b4a97f2473fcf80fdf2e7ef72bb9d23552bd05d7dd8d428dbb879b9";

const MODULES = [
  "admin_operation",
  "coin_operation",
  "object_operation",
]

type QueryId = {
  id: PermissionID | RoleID,
  is_ref: boolean
}

type PermissionID = {
  id: number
}

type RoleID = {
  id: number
}

async function main() {
  const provider = new JsonRpcProvider(mainnetConnection);
  const module = await provider.getNormalizedMoveModule({
    package: MAVEN_PACKAGE,
    module: MODULES[0],
  });
  console.log(module);
  // console.log("Data Fields: ", module.structs.UpdatePermission);
  // console.log("Data Type: ", module.structs.UpdatePermission.fields[0].type);
  console.log(printTypeScriptDefinitions(module));

}

main().then(() => {
  console.log("successfully executed");
})

function printTypeScriptDefinitions(module: any) {

  for (const structName in module.structs) {
    const struct = module.structs[structName];
    let tsType = `type ${structName} = {\n`;

    for (const field of struct.fields) {
      tsType += `  ${field.name}: ${convertToTypeScriptType(field.type)},\n`;
    }

    tsType += '};\n';
    console.log(tsType);
  }
}

function convertToTypeScriptType(moveType: SuiMoveNormalizedType) {
  switch (moveType) {
    case 'address' || 'Address': return 'SuiAddress';
    case 'u64' || 'U64': return 'number';
    // 添加其他类型映射
    default: return convertFromStruct(moveType);
  }
}
function convertFromStruct(obj: any): String {

  if (typeof obj === 'string') {
    switch (obj) {
      case 'U64':
        return 'number'
      default:
        return obj
    }
  }
  if ('Reference' in obj) {
    // obj is { Reference: SuiMoveNormalizedType }
  } else if ('MutableReference' in obj) {
    // obj is { MutableReference: SuiMoveNormalizedType }
  } else if ('Vector' in obj) {
    // obj is { Vector: SuiMoveNormalizedType }
    const struct = <SuiMoveNormalizedStructType>obj.Vector
    return convertFromStruct(struct) + '[]'

  } else if ('Struct' in obj) {
    const struct = <SuiMoveNormalizedStructType>obj
    switch (struct.Struct.name) {
      case 'String':
        return 'String';
      case 'RoleID' :
        return struct.Struct.name;
      case 'PermissionID' :
        return struct.Struct.name;
      case 'ID':
        return struct.Struct.name;
      case 'QueryID':
        const innerType = convertFromStruct(struct.Struct.typeArguments[0])
        return `QueryID<${innerType}>`;
      default:
        return 'unknown'
    }

  } else return obj

  return obj
}

