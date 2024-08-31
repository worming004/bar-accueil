import { Command } from "./command";

export class Buffer {
  private indexedDB: IDBDatabase | null = null;

  constructor(dbName: string) {
    const dbReq = indexedDB.open(dbName, 1);
    dbReq.onupgradeneeded = (event) => {
      if (event.target !== null) {
        this.indexedDB = (event.target as IDBOpenDBRequest).result;
      }
    }
    dbReq.onsuccess = (_) => {
      this.indexedDB = dbReq.result;
    };
  };



  addCommand(command: Command) {
    const transaction = this.indexedDB?.transaction("commands", "readwrite")
    if (transaction === null) {
      throw "No trx";

    }
    transaction?.objectStore("commands").add(command);
    transaction?.commit();
  }

  async getCommands(): Promise<Command[]> {
    if (this.indexedDB === null) {
      return [];
    }
    const commands: Command[] = [];
    const transaction = this.indexedDB.transaction("commands", "readonly");
    const objectStore = transaction.objectStore("commands");
    const cmds = objectStore.getAll();
    await transaction.done;
  }

  //getCommands(): Command[] {
  //  if (this.indexedDB === null) {
  //    return [];
  //  }
  //  const commands: Command[] = [];
  //  const transaction = this.indexedDB?.transaction("commands", "readonly")
  //  const cursorReq = transaction.objectStore("commands").openCursor();
  //  cursorReq.onsuccess = (event) => {
  //    const cursor = (event.target as IDBRequest).result;
  //    if (cursor) {
  //      commands.push(cursor.value);
  //      cursor.continue();
  //    }
  //  }
  //
  //  return commands;
  //}

  destroy_onlyfortest() {

  }
}

let singletonBuffer = new Buffer("Production");

let idForTest = 0;

export function getBufferByEnv(): Buffer {
  const env = process.env.ENVIRONMENT
  switch (env) {
    case "PRODUCTION":
      return singletonBuffer;
    case "TEST":
    default:
      idForTest++;
      return new Buffer(idForTest.toString());
  }
}

