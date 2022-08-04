import React from "react"
import { Upload } from "../components/Upload"

export const Verify = () => {
	return (
		<div className="my-5">
			<h5 className="fw-bold">Verify a Document</h5>
			<p>
				Blockchain users can verify documents by checking whether they exist in
				the "Document Registry" smart contract on the Celo blockchain
				decentralized network.
			</p>
			<Upload id="documentToVerify" />
		</div>
	)
}
