import React, { useState } from 'react';
import {
  BookOpen,
  LogOut,
  Bell,
  Clock,
  Bookmark,
  ShieldCheck,
  UserCheck,
  User,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { StudentUser, LibrarianUser, AdminUser, UserRole, LibraryNotification } from '../types/library';

export type StudentTab = 'CATALOG' | 'MY_LOANS' | 'RESERVATIONS';
export type LibrarianTab = 'CIRCULATION' | 'STUDENT_LOOKUP' | 'RESERVATIONS' | 'FINES' | 'CATALOG';
export type AdminTab = 'ANALYTICS' | 'CATALOG' | 'STUDENTS' | 'LIBRARIANS' | 'LOCATIONS';

interface NavbarProps {
  currentRole: UserRole;
  currentUser: StudentUser | LibrarianUser | AdminUser;
  studentTab: StudentTab;
  onStudentTabChange: (tab: StudentTab) => void;
  librarianTab: LibrarianTab;
  onLibrarianTabChange: (tab: LibrarianTab) => void;
  adminTab: AdminTab;
  onAdminTabChange: (tab: AdminTab) => void;
  activeLoansCount: number;
  hasOverdue: boolean;
  reservationsCount: number;
  notifications: LibraryNotification[];
  onMarkNotificationRead: (id: string) => void;
  onLogout: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  currentUser,
  studentTab,
  onStudentTabChange,
  librarianTab,
  onLibrarianTabChange,
  adminTab,
  onAdminTabChange,
  activeLoansCount,
  hasOverdue,
  reservationsCount,
  notifications,
  onMarkNotificationRead,
  onLogout,
  onResetData,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadNotifs = notifications.filter((n) => !n.read);

  const student = currentRole === 'STUDENT' ? (currentUser as StudentUser) : null;
  const librarian = currentRole === 'LIBRARIAN' ? (currentUser as LibrarianUser) : null;
  const admin = currentRole === 'ADMIN' ? (currentUser as AdminUser) : null;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                  DigiLibrary
                </span>
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                    currentRole === 'STUDENT'
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : currentRole === 'LIBRARIAN'
                      ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                      : 'bg-purple-100 text-purple-800 border-purple-200'
                  }`}
                >
                  {currentRole === 'STUDENT' ? 'Student Portal' : currentRole === 'LIBRARIAN' ? 'Librarian Desk' : 'Admin Console'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">Digital College Library Management System</p>
            </div>
          </div>

          {/* Central Role-Specific Tabs */}
          {currentRole === 'STUDENT' && (
            <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => onStudentTabChange('CATALOG')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  studentTab === 'CATALOG' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Book Catalog</span>
              </button>

              <button
                onClick={() => onStudentTabChange('MY_LOANS')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                  studentTab === 'MY_LOANS' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>My Loans & Fines</span>
                {activeLoansCount > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      hasOverdue ? 'bg-rose-500 text-white animate-pulse' : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {activeLoansCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => onStudentTabChange('RESERVATIONS')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  studentTab === 'RESERVATIONS' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Reservations</span>
                {reservationsCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    {reservationsCount}
                  </span>
                )}
              </button>
            </nav>
          )}

          {currentRole === 'LIBRARIAN' && (
            <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => onLibrarianTabChange('CIRCULATION')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  librarianTab === 'CIRCULATION' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Circulation Desk
              </button>
              <button
                onClick={() => onLibrarianTabChange('STUDENT_LOOKUP')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  librarianTab === 'STUDENT_LOOKUP' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Student Records
              </button>
              <button
                onClick={() => onLibrarianTabChange('RESERVATIONS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  librarianTab === 'RESERVATIONS' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Waitlists
              </button>
              <button
                onClick={() => onLibrarianTabChange('FINES')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  librarianTab === 'FINES' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Fine Ledger
              </button>
              <button
                onClick={() => onLibrarianTabChange('CATALOG')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  librarianTab === 'CATALOG' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Shelf Locator
              </button>
            </nav>
          )}

          {currentRole === 'ADMIN' && (
            <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => onAdminTabChange('ANALYTICS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  adminTab === 'ANALYTICS' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => onAdminTabChange('CATALOG')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  adminTab === 'CATALOG' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Catalog & Shelf
              </button>
              <button
                onClick={() => onAdminTabChange('STUDENTS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  adminTab === 'STUDENTS' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Students
              </button>
              <button
                onClick={() => onAdminTabChange('LIBRARIANS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  adminTab === 'LIBRARIANS' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Staff
              </button>
              <button
                onClick={() => onAdminTabChange('LOCATIONS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  adminTab === 'LOCATIONS' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Floor Layout
              </button>
            </nav>
          )}

          {/* Right Controls: User Profile, Notifications & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Student Notifications Bell */}
            {currentRole === 'STUDENT' && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifs.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-scale-up">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                        Library Notifications
                      </span>
                      <span className="text-[11px] text-slate-400">{unreadNotifs.length} unread</span>
                    </div>

                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">No notifications at this time.</p>
                    ) : (
                      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => onMarkNotificationRead(n.id)}
                            className={`p-2.5 rounded-xl text-xs transition-colors cursor-pointer border ${
                              n.read
                                ? 'bg-slate-50/60 border-slate-100 text-slate-600'
                                : 'bg-blue-50/70 border-blue-200 text-blue-900 font-medium'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />}
                              {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />}
                              {n.type === 'info' && <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />}
                              <div className="flex-1">
                                <div className="font-semibold text-slate-900">{n.title}</div>
                                <div className="text-[11px] mt-0.5 leading-snug">{n.message}</div>
                                <div className="text-[10px] text-slate-400 mt-1">{n.date}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* User Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              {currentRole === 'STUDENT' && student && (
                <>
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <div className="leading-tight">
                    <span className="font-bold text-slate-800">{student.name}</span>
                    <span className="text-[10px] text-slate-500 block font-mono">{student.usn}</span>
                  </div>
                </>
              )}

              {currentRole === 'LIBRARIAN' && librarian && (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <div className="leading-tight">
                    <span className="font-bold text-slate-800">{librarian.name}</span>
                    <span className="text-[10px] text-indigo-600 block font-mono">{librarian.staffId}</span>
                  </div>
                </>
              )}

              {currentRole === 'ADMIN' && admin && (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <div className="leading-tight">
                    <span className="font-bold text-slate-800">{admin.name}</span>
                    <span className="text-[10px] text-purple-600 block">{admin.roleTitle}</span>
                  </div>
                </>
              )}
            </div>

            {/* Reset Data Button */}
            <button
              onClick={onResetData}
              title="Reset sample data"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Logout Button */}
            <button
              onClick={() => {
                if (window.confirm('Log out of DigiLibrary and return to role sign-in?')) {
                  onLogout();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition-all shadow-xs"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Submenu */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 text-xs">
          {currentRole === 'STUDENT' && (
            <>
              <button
                onClick={() => onStudentTabChange('CATALOG')}
                className={`py-1 px-2 rounded font-semibold ${studentTab === 'CATALOG' ? 'text-blue-700 bg-blue-50' : 'text-slate-600'}`}
              >
                Catalog
              </button>
              <button
                onClick={() => onStudentTabChange('MY_LOANS')}
                className={`py-1 px-2 rounded font-semibold ${studentTab === 'MY_LOANS' ? 'text-blue-700 bg-blue-50' : 'text-slate-600'}`}
              >
                Loans ({activeLoansCount})
              </button>
              <button
                onClick={() => onStudentTabChange('RESERVATIONS')}
                className={`py-1 px-2 rounded font-semibold ${studentTab === 'RESERVATIONS' ? 'text-blue-700 bg-blue-50' : 'text-slate-600'}`}
              >
                Holds ({reservationsCount})
              </button>
            </>
          )}

          {currentRole === 'LIBRARIAN' && (
            <>
              <button
                onClick={() => onLibrarianTabChange('CIRCULATION')}
                className={`py-1 px-2 rounded font-semibold ${librarianTab === 'CIRCULATION' ? 'text-indigo-700 bg-indigo-50' : 'text-slate-600'}`}
              >
                Desk
              </button>
              <button
                onClick={() => onLibrarianTabChange('STUDENT_LOOKUP')}
                className={`py-1 px-2 rounded font-semibold ${librarianTab === 'STUDENT_LOOKUP' ? 'text-indigo-700 bg-indigo-50' : 'text-slate-600'}`}
              >
                Students
              </button>
              <button
                onClick={() => onLibrarianTabChange('RESERVATIONS')}
                className={`py-1 px-2 rounded font-semibold ${librarianTab === 'RESERVATIONS' ? 'text-indigo-700 bg-indigo-50' : 'text-slate-600'}`}
              >
                Waitlists
              </button>
              <button
                onClick={() => onLibrarianTabChange('FINES')}
                className={`py-1 px-2 rounded font-semibold ${librarianTab === 'FINES' ? 'text-indigo-700 bg-indigo-50' : 'text-slate-600'}`}
              >
                Fines
              </button>
            </>
          )}

          {currentRole === 'ADMIN' && (
            <>
              <button
                onClick={() => onAdminTabChange('ANALYTICS')}
                className={`py-1 px-2 rounded font-semibold ${adminTab === 'ANALYTICS' ? 'text-purple-700 bg-purple-50' : 'text-slate-600'}`}
              >
                Analytics
              </button>
              <button
                onClick={() => onAdminTabChange('CATALOG')}
                className={`py-1 px-2 rounded font-semibold ${adminTab === 'CATALOG' ? 'text-purple-700 bg-purple-50' : 'text-slate-600'}`}
              >
                Catalog
              </button>
              <button
                onClick={() => onAdminTabChange('STUDENTS')}
                className={`py-1 px-2 rounded font-semibold ${adminTab === 'STUDENTS' ? 'text-purple-700 bg-purple-50' : 'text-slate-600'}`}
              >
                Students
              </button>
              <button
                onClick={() => onAdminTabChange('LOCATIONS')}
                className={`py-1 px-2 rounded font-semibold ${adminTab === 'LOCATIONS' ? 'text-purple-700 bg-purple-50' : 'text-slate-600'}`}
              >
                Floors
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
