export default function ModalManager({ modal, closeModal, plateInput, setPlateInput, executeBooking, executeRelease, executeLogout }) {
    if (!modal.isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                
                {/* 1. BOOK MODAL */}
                {modal.type === 'book' && (
                    <>
                        <h3 className="modal-title" style={{ color: 'var(--neon-green)' }}>Secure Parking Slot {modal.slotId}</h3>
                        <p className="modal-message">Please enter your vehicle's license plate number to secure this booking. No upfront payment required.</p>
                        <input
                            type="text" className="modal-input" placeholder="e.g. ABC-1234"
                            value={plateInput} onChange={(e) => setPlateInput(e.target.value.toUpperCase())} autoFocus
                        />
                        <div className="modal-actions">
                            <button className="action-btn btn-cancel" onClick={closeModal}>Cancel</button>
                            <button className="action-btn btn-book" onClick={executeBooking}>Confirm Booking</button>
                        </div>
                    </>
                )}

                {/* 2. RELEASE MODAL */}
                {modal.type === 'release' && (
                    <>
                        <h3 className="modal-title" style={{ color: 'var(--neon-red)' }}>Checkout Slot {modal.slotId}</h3>
                        <p className="modal-message">Your vehicle has been successfully retrieved. Please settle your time-based parking fee to complete the release.</p>
                        <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '25px', textAlign: 'center' }}>
                            {modal.data.feeInEth} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>ETH</span>
                        </div>
                        <div className="modal-actions">
                            <button className="action-btn btn-cancel" onClick={closeModal}>Cancel</button>
                            <button className="action-btn btn-release" onClick={executeRelease}>Pay & Release</button>
                        </div>
                    </>
                )}

                {/* 3. SUCCESS MODAL */}
                {modal.type === 'success' && (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(0, 230, 118, 0.1)', border: '2px solid var(--neon-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', boxShadow: '0 0 20px rgba(0, 230, 118, 0.4)' }}>
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--neon-green)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <h3 className="modal-title" style={{ color: 'var(--text-main)' }}>Success</h3>
                        <p className="modal-message">{modal.data}</p>
                        <div className="modal-actions" style={{ justifyContent: 'center' }}>
                            <button className="action-btn btn-book" style={{ width: 'auto', padding: '10px 40px' }} onClick={closeModal}>Done</button>
                        </div>
                    </div>
                )}

                {/* 4. ERROR MODAL */}
                {modal.type === 'error' && (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255, 42, 85, 0.1)', border: '2px solid var(--neon-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', boxShadow: '0 0 20px rgba(255, 42, 85, 0.4)' }}>
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--neon-red)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </div>
                        <h3 className="modal-title" style={{ color: 'var(--neon-red)' }}>Action Failed</h3>
                        <p className="modal-message">{modal.data}</p>
                        <div className="modal-actions" style={{ justifyContent: 'center' }}>
                            <button className="action-btn btn-cancel" style={{ borderColor: 'var(--neon-red)', color: 'white', width: 'auto', padding: '10px 40px' }} onClick={closeModal}>Dismiss</button>
                        </div>
                    </div>
                )}

                {/* 5. LOADING MODAL */}
                {modal.type === 'loading' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
                        <div className="spinner" style={{ marginBottom: '20px' }}></div>
                        <p className="modal-message" style={{ marginBottom: 0, fontWeight: '600', color: 'var(--neon-blue)' }}>{modal.data}</p>
                    </div>
                )}

                {/* 6. LOGOUT CONFIRMATION MODAL */}
                {modal.type === 'logout' && (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>🔌</div>
                        <h3 className="modal-title" style={{ color: 'var(--text-main)' }}>Disconnect Wallet?</h3>
                        <p className="modal-message" style={{ marginBottom: '30px' }}>
                            This will end your current session and return you to the gateway.
                        </p>

                        <div className="modal-actions" style={{ gap: '15px' }}>
                            <button
                                style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button
                                style={{ flex: 1, padding: '12px', background: 'var(--neon-red)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 0 15px rgba(255, 42, 85, 0.4)' }}
                                onClick={executeLogout}
                            >
                                Disconnect
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}