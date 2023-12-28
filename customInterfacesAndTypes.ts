type allowedFileTypes = `${string}.json`;
interface PhoneBook {
  name: string;
  phoneNo: string;
  email?: string;
  address?: string;
  password?: string;
}
type PhoneBookFieldNames = keyof PhoneBook;

interface UpdateRecord {
  name?: string;
  phoneNo?: string;
  email?: string;
  address?: string;
  password?: string;
}
interface DataObject {
  [key: string]: PhoneBook;
}

type keyType = "phoneNo" | "email";

export { allowedFileTypes,PhoneBookFieldNames, PhoneBook, DataObject, keyType, UpdateRecord  };
