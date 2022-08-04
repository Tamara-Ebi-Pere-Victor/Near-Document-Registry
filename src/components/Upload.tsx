import React, { useState } from "react"
import { toast } from "react-toastify";
import { Form, Button } from "react-bootstrap"
import { sha3_256 } from "js-sha3"
import * as registry from "../utils/registry"
import {  Spinner } from 'react-bootstrap';
import { NotificationError, NotificationSuccess } from "./Notifications"

export const Upload: React.FC<{ id: string }> = ({ id }) => {
	const account = window.walletConnection.account();

	const [hash, setHash] = useState("");

	const [name, setName] = useState("");

	const dateAdded = Date.now().toString();

	const [loading, setLoading] = useState(false);
	
	function handleOnChange(file : any) {
		setName(file.name);
		var reader = new FileReader();
		reader.onload = function() {
		  //@ts-ignore
		  let documentHash = sha3_256(reader.result);
		  setHash(documentHash)
		};
		reader.readAsBinaryString(file);
	}

	const addDocument= async (doc: registry.Doc) => {
		try {
		  	setLoading(true);
		  	const fee: string = await registry.uploadFee();
		  	await registry.addDoc({doc, fee}).then((resp: any) => {
				toast.success(<NotificationSuccess text={`Document ${hash.toString().slice(0, 10)} added successfully.`} />);
				registry.getNoOfDocs();
		  	});
		} catch (error) {
		  	console.log({ error });
		  	toast.warn(<NotificationError text="Failed to add Document to registry." />);
		} finally {
		  	setLoading(false);
		}
	};


	const verifyDocument= async (doc: registry.Doc) => {
		try {
		  	setLoading(true);
			const fee : string = await registry.verificationFee();
			const adminStatus: boolean  = await registry.checkAdminStatus(account.accountId);
			const userStatus: boolean = await registry.checkUserStatus(hash, account.accountId);
			
			if ( adminStatus || userStatus ){
				const publishDate = await registry.showDoc({doc, accountId:account.accountId});
				let displayDate = new Date(publishDate/1000000).toLocaleString();
				toast.success(<NotificationSuccess text={`Document ${hash.toString().slice(0, 20)}... is <b>valid<b>, date published: ${displayDate}`} />);
			
			} else {
				await registry.verify({doc, fee}).then(async (resp: any) => {
					const publishDate  = await registry.showDoc({doc, accountId:account.accountId});
					let displayDate = new Date(publishDate * 1000).toLocaleString();
					toast.success(<NotificationSuccess text={`Document ${hash.toString().slice(0, 20)}... is <b>valid<b>, date published: ${displayDate}`} />);
			  	});
			} 
		} catch (error) {
		  	console.log({ error });
		  	toast.warn(<NotificationError text={`Document ${hash.toString().slice(0, 20)}... is <b>invalid</b>: not found in the registry.`} />);
		} finally {
		  	setLoading(false);
		}
	  };

	function onSubmit(e: React.FormEvent<HTMLFormElement>){
		e.preventDefault();

		if(!hash){
			return;
		}

		if(id === "documentToVerify"){
			verifyDocument({name, hash, dateAdded})
		}else if(id === "documentForUpload"){
			addDocument({name, hash, dateAdded})
		}else{
			console.log("invalid ID")
		}
	}
	  
	return (
		<Form onSubmit={onSubmit} className="mt-4">
			<Form.Group className="my-2">
				<Form.Control
					id={id}
					type="file"
					onChange={(e: any) => handleOnChange(e.target.files[0])}
				/>
			</Form.Group>
			<Button type="submit" variant="success" id={`${id}Button`}>
				 {loading ? <> <span> {id === "documentForUpload"? "Uploading" : "Verifying" } </span><Spinner animation="border" as="span" size="sm" role="status" aria-hidden="true" className="opacity-25"/> </> : "Submit"}
			</Button>
		</Form>
	)
}
