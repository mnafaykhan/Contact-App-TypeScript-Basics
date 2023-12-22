type allowedFileTypes = `${string}.json`;
interface contactInterface {
  name: string;
  phoneNo: string;
  email?: string;
  address?: string;
  password?: string;
}
interface DataObject {
  [key: string]: contactInterface;
}

type keyType = "phoneNo" | "email";

export { allowedFileTypes, contactInterface, DataObject, keyType };
