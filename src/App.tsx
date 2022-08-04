import React, { useCallback, useEffect, useState } from "react"
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "./App.css"
import { Header } from "./components/Header"
import { Nav } from "react-bootstrap"
import { Route, Routes } from "react-router-dom"
import { login, logout as destroy, accountBalance } from "./utils/near"
import Wallet from "./components/Wallet"
import coverImg from "./assets/img/registry.jpeg";
import { Notification } from "./components/Notifications"
import Cover from "./components/Cover";
import { Home } from "./pages/Home"
import { Footer } from "./components/Footer"
import { Submit } from "./pages/Submit"
import { Verify } from "./pages/Verify"


function App() {
	const account = window.walletConnection.account();

	const [balance, setBalance] = useState("0");

	const getBalance = useCallback(async () => {
		if (account.accountId) {
		  setBalance(await accountBalance());
		}
	  }, [account]);

	useEffect(() => {
		getBalance();
	}, [getBalance]);
	return (
		<>
		<Notification />
			{account.accountId ? (
				<main className="container-fluid">
					<Header></Header>
						<Nav className="justify-content-end pt-3 pb-5">
							<Nav.Item>
								<Wallet
									address={account.accountId}
									amount={balance}
									symbol="NEAR"
									destroy={destroy}
								/>
							</Nav.Item>
						</Nav>
					<Routes>
						<Route element={<Home />} path="/" />
						<Route element={<Submit />} path="/submit-document" />
						<Route element={<Verify />} path="/verify-document" />
					</Routes>
				<Footer />
			</main>
			) : (
				<Cover name="Document Registry" login={login} coverImg={coverImg} />
			)}
			
		</>
		
	)
}

export default App
