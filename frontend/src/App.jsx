import { useState, useEffect } from 'react';
import Web3 from 'web3';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Landing from './pages/Landing';

// Components & Pages
import Navbar from './components/Navbar';
import ModalManager from './components/ModalManager';
import Home from './pages/Home';
import Admin from './pages/Admin';
import { contractAddress, contractABI } from './contractData';

const ganacheUrl = "http://127.0.0.1:7545";

function App() {
	const [web3, setWeb3] = useState(null);
	const [contract, setContract] = useState(null);
	const [account, setAccount] = useState("");
	const [slots, setSlots] = useState([]);
	const [loading, setLoading] = useState(true);

	const [isOwner, setIsOwner] = useState(false);
	const [facilityPaused, setFacilityPaused] = useState(false);
	const [contractBalance, setContractBalance] = useState("0");

	const [modal, setModal] = useState({ isOpen: false, type: '', slotId: null, data: null });
	const [plateInput, setPlateInput] = useState("");

	useEffect(() => {
		document.body.style.overflowY = 'scroll';
	}, []);

	const closeModal = () => {
		setModal({ isOpen: false, type: '', slotId: null, data: null });
		setPlateInput("");
	};

	// --- NEW: GUEST INITIALIZATION (Ensures data on refresh even when logged out) ---
	useEffect(() => {
		const initGuestWeb3 = async () => {
			try {
				// Connect directly to Ganache for read-only access
				const guestWeb3 = new Web3(ganacheUrl);
				const guestContract = new guestWeb3.eth.Contract(contractABI, contractAddress);

				// Set these so the background fetch can start immediately
				setWeb3(guestWeb3);
				setContract(guestContract);

				const fetchedSlots = await guestContract.methods.getAllSlots().call();
				setSlots(fetchedSlots);
			} catch (error) {
				console.error("Guest Init Error:", error);
			}
		};
		initGuestWeb3();
	}, []);

	// --- REUSABLE WALLET WEB3 INITIALIZATION ---
	const initWeb3 = async (walletAddress) => {
		setAccount(walletAddress);
		const web3Instance = new Web3(window.ethereum);
		setWeb3(web3Instance);

		const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
		setContract(contractInstance);

		const ownerAddress = await contractInstance.methods.owner().call();
		setIsOwner(walletAddress.toLowerCase() === ownerAddress.toLowerCase());

		localStorage.removeItem('parkease_logged_out');
	};

	// --- SILENT AUTO-CONNECT & ACCOUNT LISTENER ---
	useEffect(() => {
		const checkWalletConnection = async () => {
			const hasLoggedOut = localStorage.getItem('parkease_logged_out');

			if (window.ethereum && !hasLoggedOut) {
				try {
					const accounts = await window.ethereum.request({ method: 'eth_accounts' });
					if (accounts.length > 0) {
						await initWeb3(accounts[0]);
					}
				} catch (error) {
					console.error("Silent connect error:", error);
				}
			}
		};

		checkWalletConnection();

		if (window.ethereum) {
			window.ethereum.on('accountsChanged', (accounts) => {
				if (accounts.length > 0) {
					initWeb3(accounts[0]);
				} else {
					handleStateClear();
				}
			});
		}
	}, []);

	const connectWallet = async () => {
		if (window.ethereum) {
			try {
				const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
				await initWeb3(accounts[0]);
			} catch (error) {
				console.error("User denied account access");
			}
		} else {
			setModal({ isOpen: true, type: 'error', data: "Please install MetaMask to use ParkEase!" });
		}
	};

	const openLogoutModal = () => {
		setModal({ isOpen: true, type: 'logout', slotId: null, data: null });
	};

	const handleStateClear = () => {
		setAccount("");
		setIsOwner(false);
		// Note: We keep the contract/web3 set as the guest instance for the landing page
	};

	const executeLogout = () => {
		localStorage.setItem('parkease_logged_out', 'true');
		handleStateClear();
		closeModal();
	};

	const fetchFacilityData = async (isBackgroundSync = false) => {
		if (contract) {
			if (!isBackgroundSync) setLoading(true);
			try {
				const fetchedSlots = await contract.methods.getAllSlots().call();
				setSlots(fetchedSlots);
				const pausedStatus = await contract.methods.isPaused().call();
				setFacilityPaused(pausedStatus);

				// Balance check only if we are using a real wallet instance
				if (web3 && account) {
					const balanceWei = await web3.eth.getBalance(contractAddress);
					setContractBalance(web3.utils.fromWei(balanceWei, "ether"));
				}
			} catch (error) { console.error("Data Fetch Error:", error); }
			if (!isBackgroundSync) setLoading(false);
		}
	};

	useEffect(() => {
		fetchFacilityData(false);
		if (contract) {
			const interval = setInterval(() => fetchFacilityData(true), 3000);
			return () => clearInterval(interval);
		}
	}, [contract, web3, account]);

	// --- CONTRACT ACTIONS ---
	const handleWithdraw = async () => {
		setModal({ isOpen: true, type: 'loading', data: "Withdrawing funds..." });
		try {
			await contract.methods.withdrawEarnings().send({ from: account });
			fetchFacilityData(true);
			setModal({ isOpen: true, type: 'success', data: "Earnings successfully withdrawn!" });
		} catch (error) { setModal({ isOpen: true, type: 'error', data: "Withdrawal failed." }); }
	};

	const handleTogglePause = async () => {
		setModal({ isOpen: true, type: 'loading', data: "Updating facility status..." });
		try {
			await contract.methods.togglePause().send({ from: account });
			fetchFacilityData(true);
			setModal({ isOpen: true, type: 'success', data: "Facility status updated successfully!" });
		} catch (error) { setModal({ isOpen: true, type: 'error', data: "Toggle failed." }); }
	};

	const openBookModal = (slotId) => {
		if (facilityPaused) {
			setModal({ isOpen: true, type: 'error', data: "Facility is closed for maintenance." });
			return;
		}
		setModal({ isOpen: true, type: 'book', slotId: slotId, data: null });
	};

	const executeBooking = async () => {
		if (!plateInput) return;
		setModal({ isOpen: true, type: 'loading', data: "Confirming booking on blockchain..." });
		try {
			await contract.methods.bookSlot(modal.slotId, plateInput).send({ from: account });
			fetchFacilityData(true);
			closeModal();
		} catch (error) { setModal({ isOpen: true, type: 'error', data: "Booking failed." }); }
	};

	const openReleaseModal = async (slotId) => {
		setModal({ isOpen: true, type: 'loading', data: "Calculating final fee..." });
		try {
			const feeInWei = await contract.methods.calculateFee(slotId).call();
			const feeInEth = web3.utils.fromWei(feeInWei, "ether");
			setModal({ isOpen: true, type: 'release', slotId: slotId, data: { feeInWei, feeInEth } });
		} catch (error) { setModal({ isOpen: true, type: 'error', data: "Fee calculation failed." }); }
	};

	const executeRelease = async () => {
		setModal({ isOpen: true, type: 'loading', data: "Processing payment..." });
		try {
			await contract.methods.releaseSlot(modal.slotId).send({ from: account, value: modal.data.feeInWei });
			fetchFacilityData(true);
			setModal({ isOpen: true, type: 'success', data: "Payment successful! Your car is released." });
		} catch (error) { setModal({ isOpen: true, type: 'error', data: "Payment failed." }); }
	};

	return (
		<Router>
			<ModalManager
				modal={modal} closeModal={closeModal}
				plateInput={plateInput} setPlateInput={setPlateInput}
				executeBooking={executeBooking} executeRelease={executeRelease}
				executeLogout={executeLogout}
			/>

			<Routes>
				<Route path="/" element={
					!account ? (
						<Landing
							connectWallet={connectWallet}
							availableCount={slots.filter(s => !s.isOccupied).length}
							totalCount={slots.length}
						/>
					) : (
						<>
							<Navbar account={account} isOwner={isOwner} connectWallet={connectWallet} openLogoutModal={openLogoutModal} />
							<Home account={account} loading={loading} slots={slots} facilityPaused={facilityPaused} openBookModal={openBookModal} openReleaseModal={openReleaseModal} contract={contract} web3={web3} />
						</>
					)
				} />

				<Route path="/admin" element={
					!account ? (
						<Landing
							connectWallet={connectWallet}
							availableCount={slots.filter(s => !s.isOccupied).length}
							totalCount={slots.length}
						/>
					) : (
						<Admin account={account} isOwner={isOwner} contractBalance={contractBalance} facilityPaused={facilityPaused} handleTogglePause={handleTogglePause} handleWithdraw={handleWithdraw} slots={slots} />
					)
				} />
			</Routes>
		</Router>
	);
}

export default App;