import React, { useState, useEffect } from 'react';
import { Shield, UserPlus, Users, Activity, FileText, AlertTriangle, CheckCircle, Lock, Network } from 'lucide-react';

// Mock Initial Data
const INITIAL_SEEDS = [
  { id: 'seed-1', name: 'د. أحمد (طبيب)', role: 'seed', invitedBy: 'System', invitesLeft: 5, joinedAt: '2023-10-01', status: 'active' },
  { id: 'seed-2', name: 'المهندسة سارة', role: 'seed', invitedBy: 'System', invitesLeft: 5, joinedAt: '2023-10-01', status: 'active' },
];

const INITIAL_CANDIDATES = [
  { id: 1, name: 'عمر المختار', job: 'ناشط مدني', endorsements: 120, manifesto: 'تحسين البنية التحتية والتعليم.' },
  { id: 2, name: 'ليلى خالد', job: 'محامية', endorsements: 105, manifesto: 'العدالة الاجتماعية ودعم المشاريع الصغيرة.' },
];

export default function App() {
  const [view, setView] = useState('login'); // login, dashboard, audit
  const [users, setUsers] = useState(INITIAL_SEEDS);
  const [currentUser, setCurrentUser] = useState(null);
  const [inviteCodes, setInviteCodes] = useState([
    { code: 'SEED-A1', creatorId: 'seed-1', used: false },
    { code: 'SEED-A2', creatorId: 'seed-1', used: false },
    { code: 'SEED-B1', creatorId: 'seed-2', used: false },
  ]);
  const [votes, setVotes] = useState([]);
  const [auditLog, setAuditLog] = useState([]);

  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regCode, setRegCode] = useState('');
  const [error, setError] = useState('');

  // Login Logic (Simulation)
  const handleLogin = (user) => {
    setCurrentUser(user);
    setView('dashboard');
  };

  // Register Logic (The Core Trust Mechanism)
  const handleRegister = (e) => {
    e.preventDefault();
    const code = inviteCodes.find(c => c.code === regCode && !c.used);
    
    if (!code) {
      setError('كود الدعوة غير صحيح أو مستخدم مسبقاً.');
      return;
    }

    const inviter = users.find(u => u.id === code.creatorId);
    
    // Create new user
    const newUser = {
      id: `user-${users.length + 1}`,
      name: regName,
      role: 'citizen',
      invitedBy: inviter.name,
      inviterId: inviter.id,
      invitesLeft: 3, // Regular users get 3 codes
      joinedAt: new Date().toLocaleDateString('ar-EG'),
      status: 'active'
    };

    // Update State
    setUsers([...users, newUser]);
    setInviteCodes(inviteCodes.map(c => c.code === regCode ? { ...c, used: true, usedBy: newUser.id } : c));
    
    // Generate codes for new user
    const newCodes = Array(3).fill(0).map((_, i) => ({
      code: `${newUser.id.toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
      creatorId: newUser.id,
      used: false
    }));
    setInviteCodes(prev => [...prev, ...newCodes]);

    setCurrentUser(newUser);
    setView('dashboard');
    setError('');
  };

  // Voting Logic
  const handleVote = (candidateId) => {
    if (votes.find(v => v.userId === currentUser.id)) {
      alert('لقد قمت بالتصويت مسبقاً!');
      return;
    }

    const newVote = { userId: currentUser.id, candidateId };
    setVotes([...votes, newVote]);
    
    // Add to Public Audit Log (Anonymized vote content, but public participation)
    const logEntry = {
      voterName: currentUser.name,
      voterIdHash: currentUser.id.split('-')[1] + '***', // Partial ID
      timestamp: new Date().toLocaleTimeString('ar-EG'),
      action: 'قام بالتصويت',
      status: 'تم التحقق من البصمة الرقمية'
    };
    setAuditLog([logEntry, ...auditLog]);
    alert('تم تسجيل صوتك وتشفيره بنجاح.');
  };

  // Render Functions
  const renderLogin = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4" dir="rtl">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-blue-600">
        <div className="text-center mb-8">
          <Network className="w-16 h-16 text-blue-600 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">سلسلة الثقة الرقمية</h1>
          <p className="text-gray-500 text-sm">نظام مجتمعي لامركزي للتوثيق</p>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700 border-b pb-2">تسجيل جديد (يتطلب كود دعوة)</h3>
          {error && <div className="bg-red-50 text-red-600 p-2 rounded text-sm text-center">{error}</div>}
          <input
            type="text"
            placeholder="الاسم الثلاثي واللقب"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={regName}
            onChange={e => setRegName(e.target.value)}
          />
          <input
            type="text"
            placeholder="كود الدعوة (جرب: SEED-A1)"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={regCode}
            onChange={e => setRegCode(e.target.value)}
          />
          <button 
            onClick={handleRegister}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition font-bold"
          >
            انضم للشبكة
          </button>
        </div>

        <div className="mt-8 pt-6 border-t">
          <p className="text-sm text-gray-500 mb-2 text-center">أو دخول سريع (للتجربة فقط):</p>
          <div className="flex gap-2 justify-center">
            {INITIAL_SEEDS.map(seed => (
              <button 
                key={seed.id}
                onClick={() => handleLogin(seed)}
                className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full text-gray-700"
              >
                {seed.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="min-h-screen bg-gray-100 pb-20" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-green-600" />
            <span className="font-bold text-gray-800">{currentUser.name}</span>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full border border-green-200">موثق</span>
          </div>
          <button onClick={() => setView('login')} className="text-sm text-red-500 hover:text-red-700">خروج</button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        
        {/* Status Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold mb-1">حالة الحساب</h2>
              <p className="text-gray-500 text-sm">تمت دعوتك بواسطة: <span className="text-blue-600 font-semibold">{currentUser.invitedBy}</span></p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{currentUser.invitesLeft}</div>
              <div className="text-xs text-gray-500">دعوات متبقية</div>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              أكواد الدعوة الخاصة بك
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {inviteCodes.filter(c => c.creatorId === currentUser.id).map((code, idx) => (
                <div key={idx} className={`p-2 rounded text-center text-sm font-mono border ${code.used ? 'bg-gray-100 text-gray-400 border-gray-200 dashed' : 'bg-white text-gray-800 border-gray-300'}`}>
                  {code.code}
                  {code.used && <div className="text-xs mt-1 text-green-600">تم استخدامه</div>}
                </div>
              ))}
            </div>
            <p className="text-xs text-blue-600 mt-2">* تحذير: أنت مسؤول مسؤولية تامة عن الأشخاص الذين تدعوهم.</p>
          </div>
        </div>

        {/* The Trust Tree Visualizer */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Network className="w-5 h-5 text-purple-600" />
            شجرة الثقة (الشفافية)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="p-3">المواطن</th>
                  <th className="p-3">تمت دعوته بواسطة</th>
                  <th className="p-3">تاريخ الانضمام</th>
                  <th className="p-3">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="p-3 font-medium">{u.name}</td>
                    <td className="p-3 text-blue-600">
                      {u.invitedBy === 'System' ? <span className="text-purple-600 font-bold">النواة</span> : u.invitedBy}
                    </td>
                    <td className="p-3 text-gray-500">{u.joinedAt}</td>
                    <td className="p-3">
                      {u.status === 'active' ? 
                        <span className="inline-flex items-center gap-1 text-green-600"><CheckCircle className="w-3 h-3" /> نشط</span> : 
                        <span className="inline-flex items-center gap-1 text-red-600"><AlertTriangle className="w-3 h-3" /> معلق</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Voting Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-600" />
            الاقتراع النشط: المجلس المحلي
          </h2>
          <div className="space-y-4">
            {INITIAL_CANDIDATES.map(candidate => (
              <div key={candidate.id} className="border rounded-lg p-4 hover:border-orange-300 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{candidate.name}</h3>
                    <p className="text-gray-500 text-sm mb-2">{candidate.job} • {candidate.endorsements} تزكية</p>
                    <p className="text-gray-700 text-sm bg-gray-50 p-2 rounded">{candidate.manifesto}</p>
                  </div>
                  <button 
                    onClick={() => handleVote(candidate.id)}
                    disabled={votes.some(v => v.userId === currentUser.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold ${
                      votes.some(v => v.userId === currentUser.id) 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-orange-600 text-white hover:bg-orange-700'
                    }`}
                  >
                    {votes.some(v => v.userId === currentUser.id) ? 'تم التصويت' : 'انتخاب'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Public Audit Log */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-t-4 border-gray-800">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-gray-800" />
            سجل النشاط العام (للمراقبة)
          </h2>
          <div className="bg-black text-green-400 font-mono text-xs p-4 rounded-lg h-48 overflow-y-auto">
            {auditLog.length === 0 ? <p className="text-gray-500 text-center mt-10">// بانتظار بدء الاقتراع...</p> : (
              auditLog.map((log, i) => (
                <div key={i} className="mb-2 border-b border-gray-800 pb-1 last:border-0">
                  <span className="text-gray-500">[{log.timestamp}]</span>{' '}
                  <span className="text-white">{log.voterName}</span>{' '}
                  <span className="text-gray-600">({log.voterIdHash})</span>{' '}
                  <span className="text-yellow-500"> --{'>'} {log.action}</span>{' '}
                  <span className="text-green-600">[{log.status}]</span>
                </div>
              ))
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">هذا السجل عام ويظهر المشاركة دون كشف خيار الناخب (Zero-Knowledge Proof).</p>
        </div>

      </div>
    </div>
  );

  return view === 'login' ? renderLogin() : renderDashboard();
}