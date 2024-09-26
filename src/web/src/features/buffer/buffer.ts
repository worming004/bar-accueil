import PocketBase from "pocketbase";
import { Command } from "./command";

export class Buffer {
  public static instance: Buffer = new Buffer("Production");
  public static getInstance(): Buffer {
    if (Buffer.instance === null) {
      Buffer.instance = new Buffer("Production");
    }
    return Buffer.instance;
  }
  private token: string | undefined;
  private dbName: string = "Production";

  constructor(dbName: string) {
    const dbReq = indexedDB.open(dbName, 1);
    dbReq.onupgradeneeded = (_event: Event) => {
      const db = dbReq.result;
      db.createObjectStore("commands", { keyPath: "id", autoIncrement: true });
    }

    setInterval(() => { this.tryUpload() }, 15000);
  };

  addCommand(command: Command) {
    const dbReq = indexedDB.open(this.dbName, 1);
    dbReq.onsuccess = (_event: Event) => {
      const db = dbReq.result;
      const transaction = db.transaction("commands", "readwrite")
      if (transaction === null) {
        throw "No trx";
      }
      const request = transaction?.objectStore("commands").add(command);
      request.onerror = function() {
        console.log("Error", request.error);
      };
      transaction?.commit();
    };
  }

  setToken(token: string) {
    console.log('set token');
    this.token = token;
  }

  private tryUpload() {
    console.log("start tryUpload");
    if (this.token === undefined) {
      console.log("No auth token, stop tryUpload");
      return;
    }

    const dbReq = indexedDB.open(this.dbName, 1);
    dbReq.onsuccess = (_event: Event) => {
      const db = dbReq.result;
      const transaction = db.transaction("commands", "readonly")
      if (transaction === null) {
        throw "No trx";
      }

      const toSend = transaction.objectStore("commands").getAll();
      toSend.onsuccess = function() {
        try {
          const pb = new PocketBase('https://pocketbase.bar.craftlabit.be');
          console.log("try to send " + toSend.result.length.toString() + " number of command");
          toSend.result.forEach((command: Command) => {
            const data = { data: JSON.stringify(command) };

            try {
              const prom = pb.collection("paiement").create(data, { requestKey: null });
              prom.then(() => {
                if (command.id === undefined) {
                  return
                }
                db.transaction("commands", "readwrite").objectStore("commands").delete(command.id);
              }).catch(e => {
                console.log('error while upload');
              })

            } catch (e) {

              console.log("error while upload command");
            }
          });
        } catch (e) {
          console.log("error while creating new client");
        }
      }
    };
  }

  destroy_onlyfortest() {

  }
}

let idForTest = 0;

export function getBufferByEnv(): Buffer {
  const env = process.env.ENVIRONMENT
  switch (env) {
    case "TEST":
      idForTest++
      return new Buffer(idForTest.toString());
    default:
    case "PRODUCTION":
      return Buffer.getInstance()
  }
}

