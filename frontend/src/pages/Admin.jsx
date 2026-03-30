import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- REALISTIC MOCK DATA FOR THE UI ---
const analyticsData = [
    { name: 'Mon', revenue: 0.045, utilization: 65 },
    { name: 'Tue', revenue: 0.052, utilization: 72 },
    { name: 'Wed', revenue: 0.038, utilization: 55 },
    { name: 'Thu', revenue: 0.065, utilization: 85 },
    { name: 'Fri', revenue: 0.082, utilization: 95 },
    { name: 'Sat', revenue: 0.095, utilization: 100 },
    { name: 'Sun', revenue: 0.078, utilization: 88 },
];

// Custom Tooltip for the Chart (Dark Theme)
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: 'rgba(10, 14, 23, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '15px', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                <p style={{ color: 'var(--text-main)', margin: '0 0 10px 0', fontWeight: 'bold' }}>{label}</p>
                <p style={{ color: '#FFB300', margin: '0 0 5px 0', fontSize: '0.9rem' }}>
                    Revenue: <span style={{fontWeight: 'bold'}}>{payload[0].value} ETH</span>
                </p>
                <p style={{ color: 'var(--neon-blue)', margin: 0, fontSize: '0.9rem' }}>
                    Utilization: <span style={{fontWeight: 'bold'}}>{payload[1].value}%</span>
                </p>
            </div>
        );
    }
    return null;
};

export default function Admin({ account, isOwner, contractBalance, facilityPaused, handleTogglePause, handleWithdraw, slots }) {
    
    // Security Route Guard
    if (!isOwner) {
        return (
            <main className="dashboard" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
                <div style={{ textAlign: 'center', background: 'rgba(255, 42, 85, 0.1)', padding: '50px', borderRadius: '16px', border: '1px solid var(--neon-red)', boxShadow: '0 0 30px rgba(255, 42, 85, 0.2)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🛑</div>
                    <h2 style={{ color: 'var(--neon-red)', fontSize: '2rem', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '2px' }}>Access Denied</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Security clearance required. Connect the Owner wallet.</p>
                </div>
                <Link to="/" style={{ marginTop: '30px', color: 'var(--neon-blue)', textDecoration: 'none', fontWeight: 'bold' }}>← Return to Public Facility</Link>
            </main>
        );
    }

    // --- CALCULATE LIVE STATISTICS ---
    const occupiedCount = slots.filter(s => s.isOccupied).length;
    const emptyCount = slots.length - occupiedCount;
    const utilizationRate = slots.length > 0 ? Math.round((occupiedCount / slots.length) * 100) : 0;

    return (
        <div style={{ minHeight: '100vh', background: '#05070B', color: 'white', fontFamily: 'var(--font-primary)' }}>
            
            {/* DEDICATED ADMIN HEADER */}
            <header style={{ background: '#0A0E17', borderBottom: '1px solid rgba(255, 179, 0, 0.3)', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ background: 'rgba(255, 179, 0, 0.1)', padding: '10px', borderRadius: '8px', border: '1px solid #FFB300', color: '#FFB300' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.2rem', color: '#FFB300', letterSpacing: '3px', margin: 0 }}>OVERSEER // OS</h1>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, letterSpacing: '1px', textTransform: 'uppercase' }}>ParkEase Administrative Console</p>
                    </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ fontSize: '0.85rem', color: '#FFB300', fontFamily: 'monospace', background: 'rgba(255,179,0,0.05)', padding: '8px 16px', borderRadius: '8px', border: '1px dashed rgba(255,179,0,0.3)' }}>
                        👑 ADMIN: {account.substring(0, 6)}...{account.substring(38)}
                    </div>
                    <Link to="/" style={{ background: 'rgba(255,255,255,0.05)', color: 'white', textDecoration: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s' }}>
                        Exit to Public Site →
                    </Link>
                </div>
            </header>

            <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
                
                {/* --- 1. KEY PERFORMANCE INDICATORS (KPIs) --- */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
                    <div style={{ background: 'linear-gradient(145deg, #0A0E17, #05070B)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Total Revenue</p>
                        <h3 style={{ fontSize: '2.5rem', color: '#FFB300', margin: 0 }}>{contractBalance} <span style={{fontSize: '1rem', color: 'var(--text-muted)'}}>ETH</span></h3>
                    </div>
                    
                    <div style={{ background: 'linear-gradient(145deg, #0A0E17, #05070B)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Facility Utilization</p>
                        <h3 style={{ fontSize: '2.5rem', color: 'var(--text-main)', margin: 0 }}>{utilizationRate}%</h3>
                    </div>

                    <div style={{ background: 'linear-gradient(145deg, #0A0E17, #05070B)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(0, 230, 118, 0.2)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                        <p style={{ color: 'var(--neon-green)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Empty Slots</p>
                        <h3 style={{ fontSize: '2.5rem', color: 'var(--neon-green)', margin: 0 }}>{emptyCount}</h3>
                    </div>

                    <div style={{ background: 'linear-gradient(145deg, #0A0E17, #05070B)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255, 42, 85, 0.2)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                        <p style={{ color: 'var(--neon-red)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Active Vehicles</p>
                        <h3 style={{ fontSize: '2.5rem', color: 'var(--neon-red)', margin: 0 }}>{occupiedCount}</h3>
                    </div>
                </div>

                {/* --- 2. PERFORMANCE ANALYTICS CHART --- */}
                <div style={{ background: '#0A0E17', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '1.2rem', margin: 0 }}>7-Day Network Performance</h3>
                        <span style={{ fontSize: '0.8rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--neon-blue)', padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>LIVE SYNC</span>
                    </div>
                    
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FFB300" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#FFB300" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorUtil" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} axisLine={false} tickLine={false} />
                                <YAxis yAxisId="left" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(val) => `${val} Ξ`} />
                                <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} />
                                <Tooltip content={<CustomTooltip />} />
                                
                                <Area yAxisId="right" type="monotone" dataKey="utilization" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorUtil)" />
                                <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#FFB300" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{ r: 6, fill: '#FFB300', stroke: '#000', strokeWidth: 2 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                    
                    {/* --- 3. LIVE VEHICLE ROSTER --- */}
                    <div style={{ background: '#0A0E17', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>Live Vehicle Roster</h3>
                        
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        <th style={{ padding: '15px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Slot</th>
                                        <th style={{ padding: '15px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Status</th>
                                        <th style={{ padding: '15px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>License Plate</th>
                                        <th style={{ padding: '15px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Owner Wallet</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {slots.map(slot => (
                                        <tr key={slot.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', background: slot.isOccupied ? 'rgba(255, 42, 85, 0.02)' : 'transparent' }}>
                                            <td style={{ padding: '15px 10px', fontWeight: 'bold', fontFamily: 'monospace' }}>#{slot.id.toString()}</td>
                                            <td style={{ padding: '15px 10px' }}>
                                                {slot.isOccupied ? 
                                                    <span style={{ background: 'rgba(255, 42, 85, 0.1)', color: 'var(--neon-red)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px' }}>PARKED</span> 
                                                    : 
                                                    <span style={{ background: 'rgba(0, 230, 118, 0.1)', color: 'var(--neon-green)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px' }}>EMPTY</span>
                                                }
                                            </td>
                                            <td style={{ padding: '15px 10px', fontFamily: 'monospace', color: slot.isOccupied ? 'var(--text-main)' : 'var(--text-muted)' }}>
                                                {slot.isOccupied ? slot.licensePlate : '---'}
                                            </td>
                                            <td style={{ padding: '15px 10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                {slot.isOccupied ? `${slot.bookedBy.substring(0, 8)}...` : '---'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* --- 4. SYSTEM CONTROLS --- */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        
                        <div style={{ background: 'linear-gradient(145deg, #1A1500, #0B0E14)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255, 179, 0, 0.3)', boxShadow: '0 10px 30px rgba(255, 179, 0, 0.05)' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#FFB300' }}>Treasury Setup</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '25px', lineHeight: '1.5' }}>Sweep all collected ETH parking fees directly into the master administrator wallet.</p>
                            <button 
                                onClick={handleWithdraw}
                                style={{ width: '100%', background: '#FFB300', border: 'none', color: '#000', padding: '15px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '0 0 20px rgba(255, 179, 0, 0.3)' }}
                            >
                                Withdraw Funds
                            </button>
                        </div>

                        <div style={{ background: '#0A0E17', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>System Override</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '25px', lineHeight: '1.5' }}>
                                {facilityPaused ? "Facility is currently locked. Users cannot book new slots." : "Pause the facility to block all new incoming reservations."}
                            </p>
                            <button 
                                onClick={handleTogglePause}
                                style={{ width: '100%', background: facilityPaused ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 42, 85, 0.1)', border: `1px solid ${facilityPaused ? 'var(--neon-green)' : 'var(--neon-red)'}`, color: facilityPaused ? 'var(--neon-green)' : 'var(--neon-red)', padding: '15px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}
                            >
                                {facilityPaused ? "Restore Operations" : "Halt Operations"}
                            </button>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}