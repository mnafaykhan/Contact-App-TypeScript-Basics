import * as fs from "fs";
import * as path from "path";

type allowedFileTypes = `${string}.json`;

export class FileManager {
  fileName: string = "";
  constructor(fileName: allowedFileTypes) {
    this.fileName = fileName;
  }
  loadData(): object {
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
