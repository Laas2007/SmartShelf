import React, { useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  ShieldCheck,
  UserCheck,
  KeyRound,
  AlertCircle,
  RotateCcw,
  UserPlus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { StudentUser, LibrarianUser, AdminUser, UserRole, AuthSession } from '../types/library';
import { SAMPLE_STUDENTS, DEMO_LIBRARIANS, DEMO_ADMIN } from '../data/mockData';

interface AuthScreenProps {
  students: StudentUser[];
  librarians: LibrarianUser[];
  admin: AdminUser;
  onLoginSuccess: (session: AuthSession) => void;
  onRegisterStudent: (data: Omit<StudentUser, 'id'>) => StudentUser;
  onResetData: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  students,
  librarians,
  admin,
  onLoginSuccess,
  onRegisterStudent,
  onResetData,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');

  // Student Tab state
  const [selectedStudentIndex, setSelectedStudentIndex] = useState(0);
  const currentStudentCandidate = students[selectedStudentIndex] || students[0] || SAMPLE_STUDENTS[0];
  const [studentUsn, setStudentUsn] = useState(currentStudentCandidate.usn);
  const [studentLibraryId, setStudentLibraryId] = useState(currentStudentCandidate.libraryId);
  const [studentPassword, setStudentPassword] = useState('demo@student2026');

  // Librarian Tab state
  const [selectedLibIndex, setSelectedLibIndex] = useState(0);
  const currentLibCandidate = librarians[selectedLibIndex] || librarians[0] || DEMO_LIBRARIANS[0];
  const [libStaffId, setLibStaffId] = useState(currentLibCandidate.staffId);
  const [libPassword, setLibPassword] = useState('demo@lib2026');

  // Admin Tab state
  const [adminId, setAdminId] = useState(admin.adminId || DEMO_ADMIN.adminId);
  const [adminPassword, setAdminPassword] = useState('demo@admin2026');

  // Register Modal state
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regName, setRegName] = useState('');
  const [regUsn, setRegUsn] = useState('');
  const [regDept, setRegDept] = useState('Computer Science & Engineering');
  const [regSem, setRegSem] = useState(4);
  const [regEmail, setRegEmail] = useState('');

  // When changing selected student profile
  const handleSelectStudentProfile = (idx: number) => {
    setSelectedStudentIndex(idx);
    const target = students[idx];
    if (target) {
      setStudentUsn(target.usn);
      setStudentLibraryId(target.libraryId);
    }
  };

  const handleSelectLibProfile = (idx: number) => {
    setSelectedLibIndex(idx);
    const target = librarians[idx];
    if (target) {
      setLibStaffId(target.staffId);
    }
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Find matching student or fall back to selected candidate
    const matched =
      students.find(
        (s) =>
          s.usn.toLowerCase() === studentUsn.trim().toLowerCase() ||
          s.libraryId.toLowerCase() === studentLibraryId.trim().toLowerCase()
      ) || currentStudentCandidate;

    onLoginSuccess({
      role: 'STUDENT',
      user: matched,
    });
  };

  const handleLibrarianSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matched =
      librarians.find((l) => l.staffId.toLowerCase() === libStaffId.trim().toLowerCase()) ||
      currentLibCandidate;

    onLoginSuccess({
      role: 'LIBRARIAN',
      user: matched,
    });
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess({
      role: 'ADMIN',
      user: admin,
    });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regUsn) return;

    const generatedLibId = `LIB-${regDept.slice(0, 2).toUpperCase()}-2026-${Math.floor(100 + Math.random() * 900)}`;
    const created = onRegisterStudent({
      name: regName,
      usn: regUsn.toUpperCase(),
      libraryId: generatedLibId,
      department: regDept,
      semester: Number(regSem),
      email: regEmail || `${regUsn.toLowerCase()}@bmsce.ac.in`,
      maxBorrowLimit: 4,
      avatarColor: 'from-blue-600 to-indigo-600',
    });

    setShowRegisterModal(false);
    // Automatically log in as the newly registered student
    onLoginSuccess({
      role: 'STUDENT',
      user: created,
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner: Demo Notice */}
      <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-300 text-xs py-2.5 px-4 text-center font-medium backdrop-blur-md flex items-center justify-center gap-2">
        <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-400" />
        <span>
          <strong>DEMO MODE — Sample Credentials Only:</strong> Predefined role accounts are prefilled below. Simulated authentication for prototype presentation.
        </span>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl w-full mx-auto px-4 py-8 flex-1 flex flex-col justify-center">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25 mb-3">
            <BookOpen className="w-7 h-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-white bg-clip-text text-transparent">
            DigiLibrary
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
            Full-Stack Digital College Library Management System
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden">
          {/* Role Navigation Tabs */}
          <div className="grid grid-cols-3 p-2 bg-slate-900/80 border-b border-slate-700/60 gap-2 text-xs font-semibold">
            <button
              onClick={() => setSelectedRole('STUDENT')}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl transition-all ${
                selectedRole === 'STUDENT'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Login</span>
            </button>

            <button
              onClick={() => setSelectedRole('LIBRARIAN')}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl transition-all ${
                selectedRole === 'LIBRARIAN'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Librarian Login</span>
            </button>

            <button
              onClick={() => setSelectedRole('ADMIN')}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl transition-all ${
                selectedRole === 'ADMIN'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Login</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* 1. STUDENT LOGIN TAB */}
            {selectedRole === 'STUDENT' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-blue-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Select Sample Student Profile
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowRegisterModal(true)}
                      className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>New Student Register</span>
                    </button>
                  </div>

                  {/* Multi-student profile cards for presenter demonstration */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {students.slice(0, 3).map((std, idx) => (
                      <button
                        key={std.id}
                        type="button"
                        onClick={() => handleSelectStudentProfile(idx)}
                        className={`text-left p-3 rounded-xl border text-xs transition-all ${
                          selectedStudentIndex === idx
                            ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm ring-1 ring-blue-500'
                            : 'bg-slate-900/50 border-slate-700/80 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                        }`}
                      >
                        <div className="font-bold text-white flex items-center justify-between">
                          <span>{std.name}</span>
                          <span className="text-[10px] font-mono text-blue-400">{std.usn.slice(-3)}</span>
                        </div>
                        <div className="text-[11px] font-mono opacity-80 mt-0.5">{std.usn}</div>
                        <div className="text-[10px] mt-1 text-slate-400 truncate">{std.department}</div>
                        {idx === 0 && (
                          <span className="inline-block mt-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            1 Overdue • ₹40 Fine
                          </span>
                        )}
                        {idx === 1 && (
                          <span className="inline-block mt-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            2 Active • ₹0 Fines
                          </span>
                        )}
                        {idx === 2 && (
                          <span className="inline-block mt-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            Sem 2 • 1 Active
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form with editable inputs */}
                <form onSubmit={handleStudentSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        College USN (University Seat Number)
                      </label>
                      <input
                        type="text"
                        required
                        value={studentUsn}
                        onChange={(e) => setStudentUsn(e.target.value)}
                        className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Library Card ID
                      </label>
                      <input
                        type="text"
                        required
                        value={studentLibraryId}
                        onChange={(e) => setStudentLibraryId(e.target.value)}
                        className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Demo Password
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="password"
                        value={studentPassword}
                        onChange={(e) => setStudentPassword(e.target.value)}
                        className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group"
                    >
                      <span>Continue with Demo Student Account ({currentStudentCandidate.name.split(' ')[0]})</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 2. LIBRARIAN LOGIN TAB */}
            {selectedRole === 'LIBRARIAN' && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 block mb-2">
                    Select Librarian Staff Profile
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {librarians.map((lib, idx) => (
                      <button
                        key={lib.id}
                        type="button"
                        onClick={() => handleSelectLibProfile(idx)}
                        className={`text-left p-3 rounded-xl border text-xs transition-all ${
                          selectedLibIndex === idx
                            ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500'
                            : 'bg-slate-900/50 border-slate-700/80 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                        }`}
                      >
                        <div className="font-bold text-white">{lib.name}</div>
                        <div className="text-[11px] font-mono text-indigo-400 mt-0.5">{lib.staffId}</div>
                        <div className="text-[10px] text-slate-400 mt-1 truncate">{lib.desk}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleLibrarianSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Librarian Staff ID
                      </label>
                      <input
                        type="text"
                        required
                        value={libStaffId}
                        onChange={(e) => setLibStaffId(e.target.value)}
                        className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-indigo-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Demo Password
                      </label>
                      <input
                        type="password"
                        value={libPassword}
                        onChange={(e) => setLibPassword(e.target.value)}
                        className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-indigo-950/40 border border-indigo-800/40 rounded-xl text-xs text-indigo-200">
                    <strong>Librarian Permissions:</strong> Book checkouts & returns at circulation desk, shelf availability tracking, reservations queue management, and fine waivers/settlements.
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group"
                    >
                      <span>Continue with Demo Librarian Account ({currentLibCandidate.name})</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 3. ADMIN LOGIN TAB */}
            {selectedRole === 'ADMIN' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400">Chief Authority</span>
                    <h3 className="text-base font-bold text-white mt-0.5">{admin.name}</h3>
                    <p className="text-xs text-purple-200">{admin.roleTitle} • ID: {admin.adminId}</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                    SuperAdmin
                  </span>
                </div>

                <form onSubmit={handleAdminSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        System Admin ID
                      </label>
                      <input
                        type="text"
                        required
                        value={adminId}
                        onChange={(e) => setAdminId(e.target.value)}
                        className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-purple-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Demo Password
                      </label>
                      <input
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-purple-950/40 border border-purple-800/40 rounded-xl text-xs text-purple-200">
                    <strong>Administrator Permissions:</strong> Complete catalog governance, student directory oversight, librarian staffing, physical floor & rack layout management, and analytics.
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 group"
                    >
                      <span>Continue with Demo Admin Account ({admin.name})</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Quick Demo Reset in Auth footer */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              if (window.confirm('Reset all demo data (catalog, loans, reservations, fines) to original prototype state?')) {
                onResetData();
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 py-1.5 px-3 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data to Initial Prototype State</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 border-t border-slate-800 text-[11px] text-slate-500">
        DigiLibrary • Digital College Library Management Prototype • Client Demonstration Mode
      </footer>

      {/* Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 max-w-md w-full rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Quick Demo Student Registration</h3>
            <p className="text-xs text-slate-400 mb-4">
              Add a sample student to demonstrate new account creation.
            </p>

            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-0.5">Full Student Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Rao"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-semibold block mb-0.5">College USN *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1BM23CS101"
                    value={regUsn}
                    onChange={(e) => setRegUsn(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-0.5">Semester</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={regSem}
                    onChange={(e) => setRegSem(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-0.5">Academic Department</label>
                <select
                  value={regDept}
                  onChange={(e) => setRegDept(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Information Science & Engineering">Information Science & Engineering</option>
                  <option value="Artificial Intelligence & Machine Learning">Artificial Intelligence & ML</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-0.5">College Email</label>
                <input
                  type="email"
                  placeholder="e.g. ananya.cs23@bmsce.ac.in"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-3.5 py-2 border border-slate-700 rounded-lg text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs"
                >
                  Register & Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
