import * as registry from "./model";
import { u128, context, logging, PersistentVector } from 'near-sdk-as';

// near call documentregistry.tamaraebi.testnet init '{"owner": ""}' --accountId=
export function initialize(newOwner: string): void {
    assert(context.predecessor == context.contractName, "Method is private");
    // give admin rights to owner
    giveAdminRights(newOwner);
    // sets accountid as owner
    registry.setOwner(newOwner);
}

// Add document function
export function AddDoc(doc: registry.Document): void {
    // check if caller has attached the right fee
    if (registry.UPLOAD_FEE.toString() != context.attachedDeposit.toString()) {
        throw new Error("you need to pay for upload.")
    }
    // check if user is admin returns error if not admin
    if (!registry.checkIfAdmin(context.predecessor)) {
        throw new Error("Only Admins can call this function")
    }
    const document = registry.getDocument(doc.hash);

    //check if doc exists
    if (document !== null) {
        throw new Error(`${doc.name} already exists on our records`);
    }

    //adds document to registry
    registry.addDocument(registry.Document.fromPayload(doc));
}

// verify doc
export function verifyDoc(doc: registry.Document): void {
    if (registry.VERIFICATION_FEE.toString() != context.attachedDeposit.toString()) {
        throw new Error("You need to pay for verification.")
    }

    const document = registry.getDocument(doc.hash);

    if (document == null) {
        throw new Error(`${doc.name} does not exist on our records`);
    }
    // checks if user has already paid
    if (document.checkUser(context.predecessor)) {
        throw new Error(`User already has access to this ${doc.name}`);
    };

    const user = context.predecessor;
    document.addUser(user);

    registry.addDocument(document);
}

//check if user has paid

export function isUserAllowed(hash: string, accountId: string): boolean {
    const document = registry.getDocument(hash);

    if (document == null) {
        throw new Error(`Invalid Hash`);
    }

    return document.checkUser(accountId);
}

export function getUsers(hash: string, accountId: string): Array<String> {
    assert(adminStatus(accountId), "Only Admins have access to this function")
    const document = registry.getDocument(hash);

    if (document == null) {
        throw new Error(`Invalid Hash`);
    }

    return document.allowedUsers;
}

// Reveal Date doc was added if it exists
export function showDoc(doc: registry.Document, accountId: string): u64 {
    // check if user is admin or has already paid the fee for this doc
    assert(adminStatus(accountId) || isUserAllowed(doc.hash, accountId), "Only Admins and allowed users have access to this function")
    const docResult = registry.getDocument(doc.hash);
    if (docResult == null) {
        throw new Error(`${doc.name} does not exist on our records`);
    }
    return docResult.dateAdded
}

// returns the no of docs on the registry
export function getNoofDocs(): i32 {
    return registry.Docs.length;
}

// give admin rights to other users only by owner
export function giveAdminRights(accountId: string): void {
    //check if contract caller owner of contract
    assert(owner() == context.predecessor, "Only Owner can call this function");

    //check if account to be made admin is already admin
    if (adminStatus(accountId)) {
        throw new Error(`${accountId} is already an admin`)
    }
    registry.makeAdmin(accountId);
}

export function adminStatus(accountId: string): bool {
    //returns admin status
    return registry.checkIfAdmin(accountId);
}

export function owner(): string {
    return registry.getOwner();
}

export function transferOwnership(newOwner: string): void {
    //check if contract caller owner of contract
    assert(owner() == context.predecessor, "Only Owner can call this function");
    registry.setOwner(newOwner);
}

export function verificationFee(): u128 {
    return registry.VERIFICATION_FEE;
}

export function uploadFee(): u128 {
    return registry.UPLOAD_FEE;
}
