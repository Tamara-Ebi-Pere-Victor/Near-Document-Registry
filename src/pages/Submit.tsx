import React from "react"
import { Upload } from "../components/Upload"

export const Submit = () => {
	return (
		<div className="my-5">
			<h5 className="fw-bold">Submit a Document</h5>
			<p>
				Contract owners can register (upload) new documents to the "Document
				Registry" smart contract on the Celo blockchain decentralized network.
			</p>
			<div>
				<Upload id="documentForUpload" />
			</div>
		</div>
	)
}
