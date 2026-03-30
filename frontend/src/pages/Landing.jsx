import React from 'react';

export default function Landing({ connectWallet, availableCount, totalCount }) {
    // Logic for the ticker based on existing palette
    const free = availableCount ?? 0;
    const total = totalCount ?? 10;
    const isFull = free === 0;
    const statusColor = isFull ? '#FF2A55' : '#00E676';
    const percentage = total > 0 ? (free / total) * 100 : 0;

    return (
        <div style={styles.container}>
            {/* --- ADVANCED CSS ANIMATIONS --- */}
            <style>
                {`
                @keyframes moveGrid {
                    0% { background-position: 0 0, 0 0, 50% 0; }
                    100% { background-position: 0 50px, 0 0, 50% 100px; }
                }
                @keyframes floatCard {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes slideUpFade {
                    from { opacity: 0; transform: translateY(50px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.8) translateX(-20px); }
                    to { opacity: 1; transform: scale(1) translateX(0); }
                }
                @keyframes orbitOrb {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.2); }
                    66% { transform: translate(-30px, 20px) scale(0.8); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                @keyframes pulseGlow {
                    0% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3), inset 0 0 10px rgba(59, 130, 246, 0.1); }
                    50% { box-shadow: 0 0 60px rgba(59, 130, 246, 0.8), inset 0 0 25px rgba(59, 130, 246, 0.3); }
                    100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3), inset 0 0 10px rgba(59, 130, 246, 0.1); }
                }
                @keyframes pulseDot {
                    0% { opacity: 0.4; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.2); }
                    100% { opacity: 0.4; transform: scale(1); }
                }

                .metamask-btn {
                    width: 100%;
                    background: linear-gradient(90deg, #F6851B 0%, #E2761B 100%);
                    border: none;
                    border-radius: 12px;
                    padding: 18px 20px;
                    color: white;
                    font-size: 1.1rem;
                    font-weight: 800;
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    box-shadow: 0 10px 25px rgba(246, 133, 27, 0.3);
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .metamask-btn:hover {
                    transform: translateY(-4px) scale(1.02);
                    box-shadow: 0 15px 35px rgba(246, 133, 27, 0.6);
                    background: linear-gradient(90deg, #FF9A3D 0%, #F6851B 100%);
                }
                .metamask-btn:active {
                    transform: translateY(2px) scale(0.98);
                }

                .feature-row { opacity: 0; animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                .delay-1 { animation-delay: 0.3s; }
                .delay-2 { animation-delay: 0.5s; }
                .delay-3 { animation-delay: 0.7s; }
                `}
            </style>

            {/* --- AMBIENT BACKGROUND LIGHTING (Orbs) --- */}
            <div style={{...styles.orb, background: 'rgba(59, 130, 246, 0.4)', top: '20%', left: '25%', animationDelay: '0s'}}></div>
            <div style={{...styles.orb, background: 'rgba(0, 230, 118, 0.3)', top: '60%', right: '20%', animationDelay: '2s'}}></div>
            <div style={{...styles.orb, background: 'rgba(255, 179, 0, 0.3)', top: '30%', right: '35%', animationDelay: '4s'}}></div>

            {/* --- 3D SYNTHWAVE GRID ROAD --- */}
            <div style={styles.horizon}></div>
            <div style={styles.perspectiveRoad}>
                <div style={styles.roadSurface}></div>
            </div>

            {/* --- GLASSMORPHISM LOGIN CARD --- */}
            <div style={styles.loginCard}>
                
                {/* Floating Logo with SVG Car */}
                <div style={styles.logoContainer}>
                    <div style={styles.iconWrapper}>
                        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="var(--neon-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))' }}>
                            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
                            <circle cx="7" cy="17" r="2"></circle>
                            <path d="M9 17h6"></path>
                            <circle cx="17" cy="17" r="2"></circle>
                        </svg>
                    </div>
                    <h1 style={styles.logoText}>Park<span style={{color: 'var(--neon-blue)', textShadow: '0 0 20px rgba(59, 130, 246, 0.8)'}}>Ease</span></h1>
                </div>

                <p style={styles.tagline}>The Future of Decentralized Parking Management.</p>

                {/* Features List with Staggered Entrance & SVGs */}
                <div style={styles.featureGrid}>
                    <div className="feature-row delay-1" style={styles.featureItem}>
                        <div style={styles.featureIcon}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                        </div>
                        <div style={styles.featureTextWrapper}>
                            <span style={styles.featureTitle}>Dynamic Time Billing</span>
                            <span style={styles.featureSub}>Pay securely by the minute.</span>
                        </div>
                    </div>

                    <div className="feature-row delay-2" style={styles.featureItem}>
                        <div style={styles.featureIcon}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </div>
                        <div style={styles.featureTextWrapper}>
                            <span style={styles.featureTitle}>Smart Contract Security</span>
                            <span style={styles.featureSub}>Immutable ledger protection.</span>
                        </div>
                    </div>

                    <div className="feature-row delay-3" style={styles.featureItem}>
                        <div style={styles.featureIcon}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="7" height="7"></rect>
                                <rect x="14" y="3" width="7" height="7"></rect>
                                <rect x="14" y="14" width="7" height="7"></rect>
                                <rect x="3" y="14" width="7" height="7"></rect>
                            </svg>
                        </div>
                        <div style={styles.featureTextWrapper}>
                            <span style={styles.featureTitle}>Live Matrix Sync</span>
                            <span style={styles.featureSub}>Real-time facility monitoring.</span>
                        </div>
                    </div>
                </div>

                <hr style={styles.divider} />

                {/* Connect Wallet Button */}
                <button onClick={connectWallet} className="metamask-btn">
                    <svg width="24" height="24" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '12px'}}>
                        <path d="M32.89 1.48L19.45 11.2L17.5 9.77L15.55 11.2L2.11 1.48C1.51 1.05 0.63 1.41 0.53 2.16L2.34 23.1L17.5 32.22L32.66 23.1L34.47 2.16C34.37 1.41 33.49 1.05 32.89 1.48Z" fill="#F6851B"/>
                        <path d="M17.5 32.22L32.66 23.1L26.31 20.25L17.5 25.85L8.69 20.25L2.34 23.1L17.5 32.22Z" fill="#E2761B"/>
                        <path d="M26.31 20.25L32.66 23.1L34.47 2.16L24.38 14.36L26.31 20.25Z" fill="#E2761B"/>
                        <path d="M8.69 20.25L2.34 23.1L0.53 2.16L10.62 14.36L8.69 20.25Z" fill="#E2761B"/>
                    </svg>
                    Connect MetaMask to Enter
                </button>

                {/* ⚡ COMPACT LIVE AVAILABILITY TICKER (Positioned at bottom to save space) ⚡ */}
                <div style={{
                    marginTop: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor, boxShadow: `0 0 8px ${statusColor}`, animation: 'pulseDot 1.5s infinite' }}></div>
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '1px' }}>SYSTEM LIVE</span>
                        </div>
                        <span style={{ color: statusColor, fontSize: '0.7rem', fontWeight: '900' }}>{free} / {total} FREE</span>
                    </div>
                    <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ width: `${percentage}%`, height: '100%', background: statusColor, transition: 'width 1s ease-in-out' }}></div>
                    </div>
                </div>

                <p style={styles.footerText}>Secure connection via Web3 Provider</p>
            </div>
        </div>
    );
}

// --- ALL YOUR ORIGINAL STYLES REMAIN UNTOUCHED ---
const styles = {
    container: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: '#030407',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        overflow: 'hidden', zIndex: 9999,
        fontFamily: 'var(--font-primary)'
    },
    orb: {
        position: 'absolute',
        width: '300px', height: '300px',
        borderRadius: '50%',
        filter: 'blur(100px)',
        zIndex: 0,
        animation: 'orbitOrb 10s ease-in-out infinite alternate'
    },
    horizon: {
        position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
        background: 'linear-gradient(to bottom, #030407 0%, #060b14 80%, #1e3a8a 100%)',
        zIndex: 1,
        borderBottom: '2px solid var(--neon-blue)',
        boxShadow: '0 5px 30px rgba(59, 130, 246, 0.4)'
    },
    perspectiveRoad: {
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
        perspective: '800px', zIndex: 1
    },
    roadSurface: {
        width: '200%', height: '200%',
        position: 'absolute', bottom: '-50%', left: '-50%',
        background: 'linear-gradient(to top, #0A0E17 0%, #030407 100%)',
        transform: 'rotateX(75deg)',
        backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, transparent 50%, var(--neon-gold, #FFB300) 50%)
        `,
        backgroundSize: '50px 50px, 50px 50px, 12px 100px',
        backgroundPosition: '0 0, 0 0, 50% 0',
        backgroundRepeat: 'repeat, repeat, repeat-y',
        animation: 'moveGrid 2s linear infinite'
    },
    loginCard: {
        position: 'relative', zIndex: 10,
        background: 'linear-gradient(145deg, rgba(15, 20, 30, 0.8), rgba(5, 7, 11, 0.9))',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(59, 130, 246, 0.5)',
        borderTop: '4px solid var(--neon-blue)',
        borderRadius: '24px', padding: '50px 40px',
        width: '90%', maxWidth: '480px',
        animation: 'slideUpFade 0.8s cubic-bezier(0.165, 0.84, 0.44, 1) forwards, floatCard 6s ease-in-out infinite, pulseGlow 4s infinite alternate'
    },
    logoContainer: {
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        marginBottom: '10px'
    },
    iconWrapper: {
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        marginRight: '15px', background: 'rgba(59, 130, 246, 0.1)', 
        padding: '12px', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.3)',
        boxShadow: 'inset 0 0 15px rgba(59, 130, 246, 0.2)'
    },
    logoText: {
        fontSize: '3.2rem', color: 'white', margin: 0, fontWeight: '900', letterSpacing: '-1.5px'
    },
    tagline: {
        color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '35px', lineHeight: '1.5', padding: '0 10px'
    },
    featureGrid: {
        display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '35px', textAlign: 'left',
        background: 'rgba(0,0,0,0.4)', padding: '25px', borderRadius: '16px', border: '1px inset rgba(255,255,255,0.03)',
        boxShadow: 'inset 0 4px 15px rgba(0,0,0,0.3)'
    },
    featureItem: {
        display: 'flex', alignItems: 'center', gap: '18px'
    },
    featureIcon: {
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        background: 'rgba(59, 130, 246, 0.1)', color: 'var(--neon-blue)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)'
    },
    featureTextWrapper: {
        display: 'flex', flexDirection: 'column'
    },
    featureTitle: {
        color: 'white', fontSize: '1rem', fontWeight: '700', letterSpacing: '0.5px'
    },
    featureSub: {
        color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '3px'
    },
    divider: {
        border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '0 0 30px 0'
    },
    footerText: {
        color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginTop: '20px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '1px'
    }
};