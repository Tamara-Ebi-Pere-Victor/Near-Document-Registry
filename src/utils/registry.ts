export interface Doc {
    name: string;
    dateAdded: string;
    hash: string;
}

const GAS = 100000000000000;

export function addDoc(params: { doc: Doc, fee: string }) {
    const { doc, fee } = params;
    //@ts-ignore
    return window.contract.AddDoc({ doc }, GAS, fee);
}

export function newAdmin(admin: string) {
    //@ts-ignore
    return window.contract.giveAdminRights({ accountId: admin })
}

export function verify(params: { doc: Doc, fee: string }) {
    const { doc, fee } = params;
    //@ts-ignore
    return window.contract.verifyDoc({ doc }, GAS, fee)
}

export function showDoc(params: { doc: Doc, accountId: string }) {
    const { doc, accountId } = params;
    //@ts-ignore
    return window.contract.showDoc({ doc, accountId })
}

export function checkAdminStatus(accountId: string) {
    //@ts-ignore
    return window.contract.adminStatus({ accountId })
}

export function checkUserStatus(hash: string, accountId: string) {
    //@ts-ignore
    return window.contract.isUserAllowed({ hash, accountId })
}

export function getNoOfDocs() {
    //@ts-ignore
    return window.contract.getNoofDocs()
}

export function Owner() {
    //@ts-ignore
    return window.contract.owner()
}

export function verificationFee() {
    //@ts-ignore
    return window.contract.verificationFee()
}

export function uploadFee() {
    //@ts-ignore
    return window.contract.uploadFee();
}