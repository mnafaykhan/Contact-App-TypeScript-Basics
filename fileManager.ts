import * as fs from "fs";
import * as path from "path";

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
export class FileManager {
  fileName: string = "";
  constructor(fileName: allowedFileTypes) {
    this.fileName = fileName;
  }
  loadData(): DataObject {
    try {
      const fileContent = fs.readFileSync(
        path.join(__dirname, this.fileName),
        "utf-8"
      );

      return fileContent ? JSON.parse(fileContent) : {};
    } catch (err: any) {
      console.log(err.message);
      return {};
    }
  }
  writeData(data: {}): boolean {
    try {
      fs.writeFileSync(
        path.join(__dirname, this.fileName),
        JSON.stringify(data)
      );
      return true;
    } catch (err: any) {
      console.log(err.message);
      return false;
    }
  }

  appendData(data: {}): boolean {
    try {
      let previousData = this.loadData();
      fs.writeFileSync(
        path.join(__dirname, this.fileName),
        JSON.stringify({ ...previousData, ...data })
      );
      return true;
    } catch (err: any) {
      console.log(err.message);
      return false;
    }
  }
  deleteData(): boolean {
    try {
      fs.writeFileSync(path.join(__dirname, this.fileName), "");
      return true;
    } catch (err: any) {
      console.log(err.message);
      return false;
    }
  }
  deleteByPhoneNo(phoneNo: string): boolean {
    const data: DataObject = this.loadData();
    for (let objKey of Object.keys(data)) {
      if (data[objKey]["phoneNo"] === phoneNo) {
        delete data[objKey];
        break;
      }
    }
    this.writeData(data);
    return true;
  }

  updateEmail(phoneNo: string, email: string): boolean {
    const data: DataObject = this.loadData();
    for (let objKey of Object.keys(data)) {
      if (data[objKey]["phoneNo"] === phoneNo) {
        data[objKey]["email"] = email;
        break;
      }
    }
    this.writeData(data);
    return true;
  }

  deleteByPhoneNoGivenIndex(phoneNo: string, index: string): boolean {
    const data: DataObject = this.loadData();
    delete data[index];
    this.writeData(data);
    return true;
  }
}

// let obj1 = new FileManager("file1.json");
// obj1.writeData({
//   company: "Tkxel",
//   Designation: "Software Engr",
//   Level: "10",
//   Building: "Canal",
//   Group: "Engineering",
// });
// console.log(obj1.loadData());
