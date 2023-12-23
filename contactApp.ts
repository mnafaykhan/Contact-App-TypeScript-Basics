import * as path from "path";
import {
  contactInterface,
  keyType,
  allowedFileTypes,
  DataObject,
} from "./customInterfacesAndTypes";
import { FileManager } from "./fileManager";

class Contact {
  private contacts: contactInterface[] = [];
  private fileManager: FileManager<DataObject>;
  constructor(fileManager: FileManager<DataObject>) {
    this.fileManager = fileManager;
    let backupData = this.fileManager.loadData();
    let backUpDataValues = Object.values(backupData);

    for (let value of backUpDataValues) [this.contacts.push(value)];
    console.log("Initial Contacts\n", this.contacts);
  }

  private findEmailIndex(key: string): number {
    for (let index = 0; index < this.contacts.length; index++) {
      if (this.contacts[index].email === key) {
        return index;
      }
    }
    return -1;
  }
  private findPhoneNoIndex(key: string): number {
    for (let index = 0; index < this.contacts.length; index++) {
      if (this.contacts[index].phoneNo === key) {
        return index;
      }
    }
    return -1;
  }
  private transformData(data: contactInterface[]): DataObject {
    return data.reduce<{ [key: string]: contactInterface }>(
      (acc, current, index) => {
        acc[index.toString()] = current;
        return acc;
      },
      {}
    );
  }

  addContact(contact: contactInterface): boolean {
    let emailIndex: number = contact.email
      ? this.findEmailIndex(contact.email)
      : -1;
    let phoneNoIndex: number = this.findPhoneNoIndex(contact.phoneNo);
    if (phoneNoIndex === -1 && emailIndex === -1) {
      this.contacts.push(contact);
      let parsedObj: DataObject = this.contacts.reduce<{
        [key: string]: contactInterface;
      }>((acc, current, index) => {
        acc[index.toString()] = current;
        return acc;
      }, {});
      this.fileManager.writeData(parsedObj)
        ? console.log("Data successfully stored in file.")
        : console.log("Failed to store data in file.");
      return true;
    }

    return false;
  }

  getAll(): contactInterface[] {
    return this.contacts;
  }

  getByPhoneNo(phoneNo: string): contactInterface | null {
    let phoneNoIndex = this.findPhoneNoIndex(phoneNo);
    return phoneNoIndex > -1 ? this.contacts[phoneNoIndex] : null;
  }

  getByEmail(email: string): contactInterface | null {
    let emailIndex = this.findEmailIndex(email);
    return emailIndex > -1 ? this.contacts[emailIndex] : null;
  }
  deleteByEmail(email: string): boolean {
    const emailIndex: number = this.findEmailIndex(email);
    return emailIndex === -1
      ? false
      : (this.contacts.splice(emailIndex, 1),
        this.fileManager.writeData(this.transformData(this.contacts)),
        true);
  }

  deleteByPhoneNo(phoneNo: string): boolean {
    const phoneNoIndex: number = this.findPhoneNoIndex(phoneNo);
    return phoneNoIndex === -1
      ? false
      : (this.contacts.splice(phoneNoIndex, 1),
        this.fileManager.writeData(this.transformData(this.contacts)),
        true);
  }
  updateEmail(phoneNO: string, email: string): boolean {
    try {
      for (let index = 0; index < this.contacts.length; index++) {
        if (this.contacts[index]["phoneNo"] === phoneNO) {
          this.contacts[index]["email"] = email;
          this.fileManager.writeData(this.transformData(this.contacts));
          return true;
        }
      }
      return false;
    } catch (err: any) {
      return false;
    }
  }

  find(key: keyType, value: string): contactInterface | null {
    const allowedKeyValues: keyType[] = ["email", "phoneNo"];
    for (let allowedKey of allowedKeyValues) {
      if (key === allowedKey) {
        for (let index = 0; index < this.contacts.length; index++) {
          if (this.contacts[index][key] === value) {
            return this.contacts[index];
          }
        }
      }
    }
    return null;
  }
}

let fileName: allowedFileTypes = "data.json";
let filePath: string = path.join(__dirname, fileName);
let fileManager = new FileManager<DataObject>(filePath);

let contactApp = new Contact(fileManager);

contactApp.addContact({
  name: "Davis",
  phoneNo: "082111111111",
  email: "david@gmail.com",
  address: "NewYork, USA",
  password: "davidpassword",
});

contactApp.addContact({
  name: "paris",
  phoneNo: "082333333333",
  email: "paris@gmail.com",
  address: "Washington DC",
  password: "parispassword",
});
