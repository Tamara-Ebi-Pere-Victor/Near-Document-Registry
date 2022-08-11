import { storage, PersistentUnorderedMap, u128, context, math } from "near-sdk-core";

@nearBindgen //serializes custom class before storing it on the blockchain
export class Document {
    name: string;
    dateAdded: u64;
    hash: string;
    allowedUsers: Array<String>;
    public static fromPayload(payload: Document): Document { //static method that takses a payload and returns a new Product object
        const document = new Document();
        document.name = payload.name;
        document.dateAdded = context.blockTimestamp;
        document.hash = payload.hash;
        document.allowedUsers = new Array<String>();
        return document;
    }

    // add new users
    public addUser(accountId: string): void {
        this.allowedUsers.push(accountId);
    }

    // check if a user has paid for document
    public checkUser(accountId: string): boolean {
        var isAllowed: boolean = false;
        for (let i = 0; i < this.allowedUsers.length; i++) {
            if (this.allowedUsers[i] === accountId) {
                isAllowed = true;
                break;
            }
        }
        return isAllowed;
    }
}

//Create Document mapping
export const Docs = new PersistentUnorderedMap<Uint8Array, Document>("Docs");

export function addDocument(doc: Document): void {
    //encrypt document hash
    const hash: Uint8Array = math.hash(doc.hash);
    const key = math.keccak256(hash);
    Docs.set(key, doc);
}

//Output format for users and admins
export class Idocument {
    name: string;
    dateAdded: u64;
    hash: string;
}

export function getDocument(_hash: string): Document | null {
    //encrypt document hash
    const hash: Uint8Array = math.hash(_hash);
    const key = math.keccak256(hash);
    return Docs.get(key);
}

//Set fee for document verification.
export const VERIFICATION_FEE: u128 = u128.from("10000000000000000000000");

//Set fee for uploading Document.
export const UPLOAD_FEE: u128 = u128.from("100000000000000000000000");

// Make people admins
@nearBindgen //serializes custom class before storing it on the blockchain
export class Admin {
    stillAdmin: bool;

    constructor(
        public id: string,
    ) { }

    public giveAdminRights(): void {
        this.stillAdmin = true
    }

    public revokeAdminRights(): void {
        this.stillAdmin = false
    }
}

const Admins = new PersistentUnorderedMap<String, Admin>("Admins");

export function makeAdmin(accountId: string): void {
    // create new admin
    const newAdmin: Admin = new Admin(accountId);
    // give admin rights
    newAdmin.giveAdminRights();
    // add to mapping
    Admins.set(accountId, newAdmin);
}

export function checkIfAdmin(accountId: string): bool {
    // get admin data
    const admin = Admins.get(accountId);

    // run checks
    if (admin == null) {
        return false
    } else if (admin.stillAdmin) {
        return true
    } else {
        return false
    }
}

export function setOwner(owner: string): void {
    storage.set<string>("owner", owner)
}

export function getOwner(): string {
    return storage.getPrimitive<string>("owner", "docreg.tamaraebi.testnet")
}
