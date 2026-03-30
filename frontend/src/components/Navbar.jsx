import { Link } from 'react-router-dom';

export default function Navbar({ account, isOwner, connectWallet, openLogoutModal }) {
    
    // We wrap the nav in a rigid div to forcefully lock the width and prevent the scrollbar jump bug
    return (
        <div style={{ width: '100%', minWidth: '1100px', display: 'flex', justifyContent: 'center' }}>
            <nav className="navbar" style={{ 
                width: '100%', 
                maxWidth: '1200px', /* Matches typical dashboard widths */
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '20px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)' /* Subtle separator line */
            }}>
                <div className="logo">
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        🚗 Park<span style={{color: 'var(--neon-blue)'}}>Ease</span>
                    </Link>
                </div>
                
                <div className="wallet-container" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    
                    {/* 👑 ADMIN BUTTON */}
                    {isOwner && (
                        <Link 
                            to="/admin" 
                            style={{ 
                                background: 'rgba(255, 179, 0, 0.1)', border: '1px solid rgba(255, 179, 0, 0.5)', color: '#FFB300', textDecoration: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 0 15px rgba(255, 179, 0, 0.2)', transition: 'all 0.3s ease'
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                            Admin Console
                        </Link>
                    )}

                    {/* 🦊 WALLET BUTTON & LOGOUT */}
                    {!account ? (
                        <button className="connect-btn" onClick={connectWallet} style={{
                            background: 'linear-gradient(90deg, #F6851B 0%, #E2761B 100%)', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'
                        }}>
                            Connect MetaMask
                        </button>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {/* The Wallet Pill */}
                            <div style={{ 
                                display: 'flex', alignItems: 'center', gap: '10px',
                                background: isOwner ? 'rgba(255, 179, 0, 0.05)' : 'rgba(0, 230, 118, 0.05)', 
                                border: `1px solid ${isOwner ? 'rgba(255, 179, 0, 0.3)' : 'rgba(0, 230, 118, 0.3)'}`, 
                                padding: '8px 16px', borderRadius: '8px',
                                color: isOwner ? '#FFB300' : 'var(--neon-green)',
                                fontFamily: 'monospace', fontSize: '0.95rem',
                                boxShadow: isOwner ? '0 0 15px rgba(255, 179, 0, 0.1)' : '0 0 15px rgba(0, 230, 118, 0.1)'
                            }}>
                                <div style={{
                                    width: '8px', height: '8px', borderRadius: '50%', 
                                    background: isOwner ? '#FFB300' : 'var(--neon-green)',
                                    boxShadow: `0 0 10px ${isOwner ? '#FFB300' : 'var(--neon-green)'}`
                                }}></div>
                                {account.substring(0, 6)}...{account.substring(38)}
                            </div>

                            {/* NEW: LOGOUT BUTTON */}
                            <button 
                                onClick={openLogoutModal}
                                title="Disconnect Wallet Session"
                                style={{
                                    background: 'rgba(255, 42, 85, 0.1)',
                                    border: '1px solid rgba(255, 42, 85, 0.3)',
                                    color: 'var(--neon-red)',
                                    padding: '8px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16 17 21 12 16 7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
}