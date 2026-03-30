import { useState, useEffect } from 'react';
import { generateReceiptPDF } from '../utils/receiptGenerator';

export default function Home({ account, loading, slots, facilityPaused, openBookModal, openReleaseModal, contract, web3 }) {
    const [activeTab, setActiveTab] = useState('matrix');
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // --- SCROLLBAR JUMP FIX ---
    useEffect(() => {
        document.documentElement.style.overflowY = 'scroll';
    }, []);

    // --- SILENT BACKGROUND SYNC FOR RECEIPTS ---
    useEffect(() => {
        let interval;

        const fetchHistory = async (isBackground = false) => {
            if (activeTab === 'history' && contract && account) {
                if (!isBackground) setLoadingHistory(true);

                try {
                    const releaseEvents = await contract.getPastEvents('SlotReleased', {
                        filter: { user: account },
                        fromBlock: 0,
                        toBlock: 'latest'
                    });

                    const bookEvents = await contract.getPastEvents('SlotBooked', {
                        filter: { user: account },
                        fromBlock: 0,
                        toBlock: 'latest'
                    });

                    const receiptData = releaseEvents.map(rel => {
                        const relTime = Number(rel.returnValues.timestamp);
                        const slotId = rel.returnValues.slotId;

                        const correspondingBook = [...bookEvents].reverse().find(b =>
                            b.returnValues.slotId === slotId &&
                            Number(b.returnValues.timestamp) <= relTime
                        );

                        return {
                            hash: rel.transactionHash,
                            slotId: slotId.toString(),
                            plate: correspondingBook ? correspondingBook.returnValues.licensePlate : "Unknown",
                            fee: web3.utils.fromWei(rel.returnValues.feePaid, 'ether'),
                            date: new Date(relTime * 1000).toLocaleString('en-US', {
                                month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            }),
                            timestamp: relTime
                        };
                    }).sort((a, b) => b.timestamp - a.timestamp);

                    setHistory(receiptData);
                } catch (error) {
                    console.error("Error fetching history:", error);
                }

                if (!isBackground) setLoadingHistory(false);
            }
        };

        fetchHistory(false);

        if (activeTab === 'history') {
            interval = setInterval(() => fetchHistory(true), 3000);
        }

        return () => clearInterval(interval);
    }, [activeTab, contract, account, web3]);

    return (
        <main className="dashboard" style={{ minHeight: '100vh', paddingBottom: '40px' }}>

            {/* 🛑 HIGH-VISIBILITY ROAD ANIMATIONS 🛑 */}
            <style>
                {`
                html, body {
                    overflow-y: scroll !important;
                    scrollbar-gutter: stable !important;
                }

                /* Vertical Road Animations */
                @keyframes roadScrollVertical {
                    0% { background-position: 0 0; }
                    100% { background-position: 0 60px; }
                }
                @keyframes driveSouth {
                    0% { top: -15%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 115%; opacity: 0; }
                }
                @keyframes driveNorth {
                    0% { bottom: -15%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { bottom: 115%; opacity: 0; }
                }

                .animated-dashed-line-v {
                    position: absolute; top: 0; left: 50%; transform: translateX(-50%);
                    width: 6px; height: 100%;
                    /* Brightened the yellow to solid #FFB300 with a glow */
                    background-image: linear-gradient(to bottom, #FFB300 50%, transparent 50%);
                    background-size: 100% 60px;
                    box-shadow: 0 0 15px rgba(255, 179, 0, 0.8);
                    animation: roadScrollVertical 1s linear infinite;
                    z-index: 1;
                }

                .car-entering {
                    position: absolute; left: 50%; transform: translateX(-50%);
                    font-size: 2.8rem; /* Upscaled */
                    animation: driveSouth 5s linear infinite; z-index: 2;
                    filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.5)); /* Added bright drop shadow */
                }

                .car-exiting {
                    position: absolute; left: 50%; transform: translateX(-50%) scaleY(-1);
                    font-size: 2.8rem; /* Upscaled */
                    animation: driveNorth 6s linear infinite; animation-delay: 2.5s; z-index: 2;
                    filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.5)); /* Added bright drop shadow */
                }

                /* --- MIDDLE HORIZONTAL ROAD ANIMATIONS --- */
                @keyframes roadScrollHorizontal {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(60px); }
                }
                @keyframes patrolSweep {
                    0% { left: -15%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { left: 115%; opacity: 0; }
                }
                @keyframes policeFlash {
                    0%, 49% { filter: drop-shadow(0 0 20px rgba(255, 42, 85, 1)); }
                    50%, 100% { filter: drop-shadow(0 0 20px rgba(59, 130, 246, 1)); }
                }
                @keyframes pulseChevrons {
                    0% { opacity: 0.3; transform: translateX(0); text-shadow: none; }
                    50% { opacity: 1; transform: translateX(10px); text-shadow: 0 0 15px rgba(255,255,255,0.8); }
                    100% { opacity: 0.3; transform: translateX(0); text-shadow: none; }
                }

                .middle-road-container {
                    position: absolute;
                    top: 50%; left: 0; right: 0;
                    height: 90px; /* Slightly taller */
                    transform: translateY(-50%);
                    background: #0D1320; /* Slightly lighter than the rest of the dark background */
                    border-top: 2px solid rgba(255,255,255,0.1);
                    border-bottom: 2px solid rgba(255,255,255,0.1);
                    display: flex; align-items: center; justify-content: center;
                    overflow: hidden;
                    z-index: 0;
                    box-shadow: inset 0 0 20px rgba(0,0,0,0.9);
                }

                .animated-dashed-line-h {
                    position: absolute;
                    left: -60px; right: 0; width: calc(100% + 60px); height: 6px;
                    /* Brightened horizontal line */
                    background-image: linear-gradient(to right, #FFB300 50%, transparent 50%);
                    background-size: 60px 100%;
                    box-shadow: 0 0 15px rgba(255, 179, 0, 0.8);
                    animation: roadScrollHorizontal 1s linear infinite;
                    z-index: 1;
                }

                .patrol-vehicle {
                    position: absolute;
                    animation: patrolSweep 8s linear infinite;
                    z-index: 3;
                    display: flex; align-items: center; gap: 5px;
                }

                .police-car-svg {
                    animation: policeFlash 0.5s infinite;
                }

                .chevrons {
                    position: absolute; width: 100%; display: flex; justify-content: space-evenly;
                    color: rgba(255, 255, 255, 0.4); font-size: 2rem; font-weight: 900; letter-spacing: 5px;
                    animation: pulseChevrons 2s infinite ease-in-out;
                    z-index: 1; pointer-events: none;
                }
                `}
            </style>

            {/* =========================================
                PREMIUM DASHBOARD HEADER & TABS
            ========================================= */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '30px' }}>
                <h2 className="dashboard-title" style={{ margin: 0 }}>Facility Overview</h2>

                <div style={{ display: 'flex', background: 'rgba(0, 0, 0, 0.4)', padding: '6px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.5)' }}>
                    <button
                        onClick={() => setActiveTab('matrix')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: activeTab === 'matrix' ? 'rgba(59, 130, 246, 0.15)' : 'transparent', border: activeTab === 'matrix' ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent', color: activeTab === 'matrix' ? 'var(--neon-blue)' : 'var(--text-muted)', padding: '10px 24px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '800', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px', transition: 'all 0.3s ease', boxShadow: activeTab === 'matrix' ? '0 0 15px rgba(59, 130, 246, 0.2)' : 'none' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                        Live Matrix
                    </button>

                    <button
                        onClick={() => setActiveTab('history')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: activeTab === 'history' ? 'rgba(0, 230, 118, 0.15)' : 'transparent', border: activeTab === 'history' ? '1px solid rgba(0, 230, 118, 0.3)' : '1px solid transparent', color: activeTab === 'history' ? 'var(--neon-green)' : 'var(--text-muted)', padding: '10px 24px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '800', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px', transition: 'all 0.3s ease', boxShadow: activeTab === 'history' ? '0 0 15px rgba(0, 230, 118, 0.2)' : 'none' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        My Receipts
                    </button>
                </div>
            </div>

            {facilityPaused && (
                <div style={{ background: 'rgba(255, 42, 85, 0.1)', border: '1px dashed var(--neon-red)', color: 'var(--neon-red)', padding: '15px', borderRadius: '8px', textAlign: 'center', marginBottom: '30px', fontWeight: 'bold', letterSpacing: '1px' }}>
                    ⚠️ FACILITY IS CURRENTLY CLOSED FOR MAINTENANCE ⚠️
                </div>
            )}

            {/* =========================================
                TAB 1: LIVE PARKING MATRIX 
            ========================================= */}
            {activeTab === 'matrix' && (
                <div className="facility-wrapper">
                    <div className="status-legend" style={{ alignSelf: 'flex-end', marginBottom: '20px' }}>
                        <span className="legend-item"><span className="dot dot-green"></span> Available</span>
                        <span className="legend-item"><span className="dot dot-red"></span> Booked</span>
                    </div>

                    <div className="compass-label">▲ NORTH WING</div>
                    <div className="facility-core">

                        <div className="road vertical-road" style={{ position: 'relative', overflow: 'hidden', background: '#0A0E17', borderLeft: '1px solid rgba(255,255,255,0.05)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                            <div className="animated-dashed-line-v"></div>
                            <div className="car-entering">🚙</div>
                            <div className="road-label west" style={{ position: 'relative', zIndex: 3, background: 'rgba(5, 7, 11, 0.85)', padding: '15px 10px', borderRadius: '8px', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)' }}>WEST ENTRANCE</div>
                        </div>

                        <div className="parking-compound" style={{ position: 'relative' }}>

                            {/* THE HIGH-VISIBILITY ANIMATED MIDDLE ROAD */}
                            <div className="middle-road-container">
                                <div className="animated-dashed-line-h"></div>
                                <div className="chevrons">
                                    <span>{">>>"}</span><span>{">>>"}</span><span>{">>>"}</span><span>{">>>"}</span>
                                </div>

                                {/* Autonomous Security Vehicle */}
                                <div className="patrol-vehicle">
                                    {/* Supercharged Glowing Headlights */}
                                    <div style={{ width: '60px', height: '80px', background: 'linear-gradient(90deg, rgba(255,255,255,0.9), transparent)', clipPath: 'polygon(0 30%, 100% 0, 100% 100%, 0 70%)', filter: 'drop-shadow(0 0 10px white)' }}></div>

                                    {/* Thicker Security SVG Car */}
                                    <div className="police-car-svg">
                                        <svg width="55" height="30" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'scaleX(-1)' }}>
                                            <rect x="1" y="3" width="15" height="13"></rect>
                                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                                            <circle cx="5.5" cy="18.5" r="2.5"></circle>
                                            <circle cx="18.5" cy="18.5" r="2.5"></circle>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="parking-grid" style={{ position: 'relative', zIndex: 2 }}>
                                {!account || loading ? (
                                    <div className="loading-state">
                                        <div className="spinner"></div>
                                        <p>{!account ? "Awaiting Wallet Connection..." : "Syncing with Ganache..."}</p>
                                    </div>
                                ) : (
                                    slots.map((slot) => (
                                        <div key={slot.id} className={`slot-card ${slot.isOccupied ? 'occupied' : 'available'}`}>
                                            <div className="status-badge">{slot.isOccupied ? 'Booked' : 'Available'}</div>
                                            <div className="slot-number">{slot.id.toString()}</div>

                                            {slot.isOccupied && (
                                                <div style={{ color: '#FF2A55', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '10px', letterSpacing: '1px' }}>
                                                    {slot.licensePlate}
                                                </div>
                                            )}

                                            {slot.isOccupied ? (
                                                <button className="action-btn btn-release" onClick={() => openReleaseModal(slot.id)}>Release & Pay</button>
                                            ) : (
                                                <button className="action-btn btn-book" style={{ opacity: facilityPaused ? 0.5 : 1, cursor: facilityPaused ? 'not-allowed' : 'pointer' }} onClick={() => openBookModal(slot.id)}>Book</button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="road vertical-road" style={{ position: 'relative', overflow: 'hidden', background: '#0A0E17', borderLeft: '1px solid rgba(255,255,255,0.05)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                            <div className="animated-dashed-line-v" style={{ animationDirection: 'reverse' }}></div>
                            <div className="car-exiting">🚕</div>
                            <div className="road-label east" style={{ position: 'relative', zIndex: 3, background: 'rgba(5, 7, 11, 0.85)', padding: '15px 10px', borderRadius: '8px', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)' }}>EAST EXIT</div>
                        </div>

                    </div>
                    <div className="compass-label">▼ SOUTH WING</div>
                </div>
            )}

            {/* =========================================
                TAB 2: PARKING HISTORY (RECEIPTS)
            ========================================= */}
            {activeTab === 'history' && (
                <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', padding: '20px 0' }}>
                    {!account ? (
                        <div className="loading-state" style={{ background: 'var(--panel-bg)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <p>Connect your wallet to view your parking history.</p>
                        </div>
                    ) : loadingHistory ? (
                        <div className="loading-state" style={{ background: 'var(--panel-bg)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div className="spinner" style={{ borderTopColor: 'var(--neon-green)' }}></div>
                            <p style={{ color: 'var(--neon-green)' }}>Scanning Blockchain Logs...</p>
                        </div>
                    ) : history.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--panel-bg)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                            <div style={{ fontSize: '3.5rem', marginBottom: '20px', opacity: 0.5 }}>🧾</div>
                            <h3 style={{ color: 'var(--text-main)', marginBottom: '10px', fontSize: '1.5rem' }}>No Parking History Found</h3>
                            <p style={{ color: 'var(--text-muted)' }}>You haven't completed any parking sessions with this wallet yet.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {history.map((receipt, index) => (
                                <div key={index} style={{ background: 'var(--card-bg)', border: '1px solid rgba(0, 230, 118, 0.2)', borderRadius: '16px', display: 'flex', alignItems: 'stretch', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', overflow: 'hidden', position: 'relative' }}>
                                    <div style={{ padding: '30px', flex: 1, display: 'flex', gap: '25px', alignItems: 'center' }}>
                                        <div style={{ background: 'rgba(0, 230, 118, 0.05)', border: '1px solid rgba(0, 230, 118, 0.3)', minWidth: '80px', height: '80px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: 'inset 0 0 15px rgba(0, 230, 118, 0.1)' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--neon-green)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>Slot</span>
                                            <span style={{ fontSize: '2rem', color: 'var(--text-main)', fontWeight: '800', fontFamily: 'var(--font-numbers)', lineHeight: 1 }}>{receipt.slotId}</span>
                                        </div>
                                        <div>
                                            <h3 style={{ color: 'var(--text-main)', margin: '0 0 8px 0', fontSize: '1.4rem', letterSpacing: '1px' }}>{receipt.plate}</h3>
                                            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                                {receipt.date}
                                            </p>
                                            <a href={`https://etherscan.io/tx/${receipt.hash}`} target="_blank" rel="noreferrer" style={{ color: 'var(--neon-blue)', margin: '10px 0 0 0', fontSize: '0.8rem', fontFamily: 'monospace', textDecoration: 'none', display: 'inline-block', background: 'rgba(59, 130, 246, 0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                                                TX: {receipt.hash.substring(0, 10)}...{receipt.hash.substring(58)} ↗
                                            </a>

                                            {/* Add this inside the history map, near the transaction link */}
                                            <button
                                                onClick={() => generateReceiptPDF(receipt)}
                                                style={{
                                                    marginTop: '15px',
                                                    background: 'rgba(59, 130, 246, 0.1)',
                                                    border: '1px solid var(--neon-blue)',
                                                    color: 'var(--neon-blue)',
                                                    padding: '6px 12px',
                                                    borderRadius: '6px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 'bold',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseOver={(e) => e.target.style.background = 'rgba(59, 130, 246, 0.2)'}
                                                onMouseOut={(e) => e.target.style.background = 'rgba(59, 130, 246, 0.1)'}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                                Download PDF Ticket
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{ width: '2px', background: 'repeating-linear-gradient(to bottom, rgba(255,255,255,0.1) 0, rgba(255,255,255,0.1) 8px, transparent 8px, transparent 16px)' }}></div>
                                    <div style={{ padding: '30px', minWidth: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', background: 'rgba(0, 230, 118, 0.03)' }}>
                                        <p style={{ color: 'var(--neon-green)', margin: '0 0 8px 0', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '2px' }}>Total Paid</p>
                                        <h2 style={{ color: 'var(--text-main)', margin: 0, fontSize: '2.5rem', fontFamily: 'var(--font-numbers)' }}>{receipt.fee}</h2>
                                        <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>ETH</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </main>
    );
}