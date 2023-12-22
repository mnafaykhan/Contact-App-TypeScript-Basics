import * as fs from "fs";
import {
  allowedFileTypes,
  DataObject,
  contactInterface,
} from "./customInterfacesAndTypes";

export class FileManager<CustomType> {
  private fileName: string = "";
  constructor(fileName: string) {
    this.fileName = fileName;
  }
  loadData(): CustomType {
    try {
      const fileContent = fs.readFileSync(this.fileName, "utf-8");

      return fileContent ? JSON.parse(fileContent) : {};
    } catch (err: any) {
      console.log(err.message);
      return {} as CustomType;
    }
  }

  writeData(data: CustomType): boolean {
    try {
      fs.writeFileSync(this.fileName, JSON.stringify(data));
      return true;
    } catch (err: any) {
      console.log(err.message);
      return false;
    }
  }
}
