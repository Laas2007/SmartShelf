import React, { useState } from 'react';
import {
  UserCheck,
  RotateCcw,
  Clock,
  Bookmark,
  Search,
} from 'lucide-react';
import { Book, Loan, Reservation, StudentUser, LibrarianUser } from '../types/library';
import { ShelfBadge } from './ShelfBadge';

interface LibrarianPortalProps {
  librarian: LibrarianUser;
  activeTab: 'CIRCULATION' | 'STUDENT_LOOKUP' | 'RESERVATIONS' | 'FINES' | 'CATALOG';
  books: Book[];
  loans: Loan[];
  reservations: Reservation[];
  students: StudentUser[];
  onIssueBook: (bookId: string, studentId: string) => void;
  onReturnBook: (loanId: string) => void;
  onCollectFine: (loanId: string) => void;
  onWaiveFine: (loanId: string) => void;
  onCancelReservation: (resId: string) => void;
}

export const LibrarianPortal: React.FC<LibrarianPortalProps> = ({
  librarian,
  activeTab,
  books,
  loans,
  reservations,
  students,
  onIssueBook,
  onReturnBook,
  onCollectFine,
  onWaiveFine,
  onCancelReservation,
}) => {
  // Circulation Desk state
  const [selectedBookId, setSelectedBookId] = useState(books[0]?.id || '');
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');

  // Student Lookup state
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [selectedStudentForView, setSelectedStudentForView] = useState<StudentUser>(students[0] || {} as StudentUser);

  // Catalog filter
  const [catalogSearch, setCatalogSearch] = useState('');

  // Active Loans & Overdues
  const activeLoans = loans.filter((l) => l.status === 'ACTIVE' || l.status === 'OVERDUE');
  const overdueLoans = loans.filter((l) => l.status === 'OVERDUE');
  const unsettledFines = loans.filter((l) => !l.finePaid && l.fineAmount > 0);
  const totalUnsettledAmount = unsettledFines.reduce((acc, l) => acc + l.fineAmount, 0);

  // Student search match
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      s.usn.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      s.libraryId.toLowerCase().includes(studentSearchQuery.toLowerCase())
  );

  const studentLoans = loans.filter((l) => l.studentId === selectedStudentForView.id);

  return (
    <div className="space-y-6">
      {/* Librarian Desk Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-indigo-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] uppercase font-bold tracking-widest text-indigo-300 bg-indigo-500/20 px-2.5 py-0.5 rounded-full border border-indigo-400/30">
                Staff Circulation Portal
              </span>
              <span className="text-[11px] font-mono text-slate-300">Staff ID: {librarian.staffId}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Librarian Desk: {librarian.name}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              {librarian.desk} • {librarian.shift}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-xs">
            <div className="text-center px-3 border-r border-white/20">
              <span className="text-indigo-200 block text-[10px] uppercase font-semibold">Total Checked Out</span>
              <span className="text-lg font-bold text-white">{activeLoans.length} Books</span>
            </div>
            <div className="text-center px-3">
              <span className="text-indigo-200 block text-[10px] uppercase font-semibold">Overdue Alerts</span>
              <span className="text-lg font-bold text-rose-400">{overdueLoans.length} Books</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. CIRCULATION DESK (ISSUE & RETURN) */}
      {activeTab === 'CIRCULATION' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Issue Desk */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-600" />
                  <span>Issue Book to Student</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Check out an available textbook with automatic 14-day loan.</p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">Desk A</span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.usn}) — {s.department}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Book from Catalog</label>
                <select
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                >
                  {books.map((b) => (
                    <option key={b.id} value={b.id} disabled={b.availableCopies <= 0}>
                      {b.title} ({b.availableCopies}/{b.totalCopies} copies available)
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-900">
                <span className="font-bold block mb-0.5">Circulation Rules:</span>
                Students may borrow up to 4 books simultaneously for 14 calendar days. A late fee of ₹5/day is automatically levied upon overdue return.
              </div>

              <button
                onClick={() => onIssueBook(selectedBookId, selectedStudentId)}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all"
              >
                Complete Book Issue (14 Days)
              </button>
            </div>
          </div>

          {/* Quick Return Desk */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-emerald-600" />
                  <span>Accept Book Return</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Scan or click to return issued books back to shelf inventory.</p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                {activeLoans.length} Active Loans
              </span>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {activeLoans.length === 0 ? (
                <p className="text-xs text-slate-400 py-8 text-center">No active loans to return.</p>
              ) : (
                activeLoans.map((l) => (
                  <div
                    key={l.id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs transition-all ${
                      l.status === 'OVERDUE' ? 'bg-rose-50/60 border-rose-200' : 'bg-slate-50/80 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900">{l.bookTitle}</div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        Student: <strong className="text-slate-800">{l.studentName}</strong> ({l.studentUsn})
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Due: {l.dueDate} •{' '}
                        {l.status === 'OVERDUE' ? (
                          <span className="text-rose-600 font-bold">
                            OVERDUE ({Math.abs(l.daysRemaining)} days late • Fine: ₹{l.fineAmount})
                          </span>
                        ) : (
                          <span className="text-blue-600 font-semibold">{l.daysRemaining} days left</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => onReturnBook(l.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-all whitespace-nowrap"
                    >
                      Receive Return
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. STUDENT RECORDS LOOKUP */}
      {activeTab === 'STUDENT_LOOKUP' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Search & List */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Search Student Directory</h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search USN, Library ID, or Name..."
                value={studentSearchQuery}
                onChange={(e) => setStudentSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {filteredStudents.map((s) => {
                const sLoans = loans.filter((l) => l.studentId === s.id && (l.status === 'ACTIVE' || l.status === 'OVERDUE'));
                const isSelected = selectedStudentForView.id === s.id;

                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedStudentForView(s)}
                    className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-300'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-bold text-slate-900">{s.name}</div>
                    <div className="text-[11px] font-mono text-indigo-700 mt-0.5">{s.usn}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{s.department}</div>
                    <div className="mt-1.5 flex items-center justify-between text-[10px]">
                      <span className="font-semibold text-slate-700">{sLoans.length}/4 Books Borrowed</span>
                      <span className="text-slate-400 font-mono">{s.libraryId}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Student Detail Dossier */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            {/* Dossier Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-700">Official Student Profile</span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">{selectedStudentForView.name}</h3>
                <p className="text-xs text-slate-500">
                  USN: <strong className="font-mono text-slate-700">{selectedStudentForView.usn}</strong> • Library Card: <span className="font-mono">{selectedStudentForView.libraryId}</span>
                </p>
              </div>
              <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Department</span>
                <span className="font-semibold text-slate-800">{selectedStudentForView.department} (Sem {selectedStudentForView.semester})</span>
              </div>
            </div>

            {/* Loans Table for this specific student */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Borrowing Records for {selectedStudentForView.name}</span>
              </h4>

              {studentLoans.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center bg-slate-50 rounded-2xl">
                  No active or past loans found for this student.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                      <tr>
                        <th className="p-2.5 rounded-l-lg">Book Title</th>
                        <th className="p-2.5">Issued Date</th>
                        <th className="p-2.5">Due Date</th>
                        <th className="p-2.5">Status</th>
                        <th className="p-2.5 rounded-r-lg text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentLoans.map((l) => (
                        <tr key={l.id} className="hover:bg-slate-50/50">
                          <td className="p-2.5 font-semibold text-slate-800">{l.bookTitle}</td>
                          <td className="p-2.5 text-slate-500">{l.issueDate}</td>
                          <td className="p-2.5 text-slate-500">{l.dueDate}</td>
                          <td className="p-2.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                l.status === 'OVERDUE'
                                  ? 'bg-rose-100 text-rose-800'
                                  : l.status === 'RETURNED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {l.status}
                            </span>
                          </td>
                          <td className="p-2.5 text-right">
                            {l.status !== 'RETURNED' && (
                              <button
                                onClick={() => onReturnBook(l.id)}
                                className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg border border-emerald-200"
                              >
                                Return
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. RESERVATIONS & WAITLISTS */}
      {activeTab === 'RESERVATIONS' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-indigo-600" />
                <span>Student Hold Requests & Waitlists</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage books held for pickup and monitor waiting queue order.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-indigo-50 text-indigo-800">
              {reservations.length} Active Holds
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="p-3 rounded-l-lg">Book Title</th>
                  <th className="p-3">Student Name (USN)</th>
                  <th className="p-3">Request Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Pickup Window</th>
                  <th className="p-3 rounded-r-lg text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reservations.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-800">{r.bookTitle}</td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-900">{r.studentName}</div>
                      <div className="text-[11px] font-mono text-slate-400">{r.studentUsn}</div>
                    </td>
                    <td className="p-3 text-slate-500">{r.reservedAt}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.status === 'READY_FOR_PICKUP'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.status === 'READY_FOR_PICKUP' ? 'Ready at Desk' : `Queue #${r.queuePosition}`}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">
                      {r.pickupDeadline ? `Hold until ${r.pickupDeadline}` : 'Waiting on Returns'}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onCancelReservation(r.id)}
                        className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 rounded-lg font-semibold border border-rose-200"
                      >
                        Cancel Hold
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. FINE MANAGEMENT DESK */}
      {activeTab === 'FINES' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-rose-50 rounded-2xl border border-rose-200">
              <span className="text-xs uppercase font-bold text-rose-800 tracking-wider">Unsettled Overdue Fines</span>
              <div className="text-2xl font-black text-rose-700 mt-1">₹{totalUnsettledAmount}</div>
              <p className="text-xs text-rose-600 mt-1">{unsettledFines.length} pending fines across all student borrowers</p>
            </div>
            <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-200">
              <span className="text-xs uppercase font-bold text-indigo-800 tracking-wider">College Fine Policy</span>
              <div className="text-base font-bold text-indigo-900 mt-1">₹5.00 per Calendar Day</div>
              <p className="text-xs text-indigo-700 mt-1">Grace period: 0 days. Fines must be cleared before exam hall tickets are issued.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Overdue Fine Ledger</h3>

            {unsettledFines.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">No outstanding fines currently pending.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                    <tr>
                      <th className="p-3 rounded-l-lg">Student USN & Name</th>
                      <th className="p-3">Overdue Book Title</th>
                      <th className="p-3">Due Date</th>
                      <th className="p-3">Fine Amount</th>
                      <th className="p-3 rounded-r-lg text-right">Librarian Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {unsettledFines.map((loan) => (
                      <tr key={loan.id} className="hover:bg-slate-50/50">
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{loan.studentName}</div>
                          <div className="text-[11px] font-mono text-slate-500">{loan.studentUsn}</div>
                        </td>
                        <td className="p-3 font-semibold text-slate-800">{loan.bookTitle}</td>
                        <td className="p-3 text-rose-600 font-semibold">{loan.dueDate}</td>
                        <td className="p-3 font-bold text-slate-900">₹{loan.fineAmount}</td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => onCollectFine(loan.id)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs"
                          >
                            Collect Cash/UPI
                          </button>
                          <button
                            onClick={() => onWaiveFine(loan.id)}
                            className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-lg border border-slate-300"
                          >
                            Waive Fine
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. CATALOG & SHELF LOCATOR */}
      {activeTab === 'CATALOG' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Physical Shelf & Inventory Lookup</h3>
              <p className="text-xs text-slate-500">Live locations across library floors and wings.</p>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter title or rack..."
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="p-3 rounded-l-lg">Book Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Availability</th>
                  <th className="p-3 rounded-r-lg">Physical Shelf Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {books
                  .filter((b) => b.title.toLowerCase().includes(catalogSearch.toLowerCase()) || b.shelfLocation.rack.toLowerCase().includes(catalogSearch.toLowerCase()))
                  .map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-semibold text-slate-900">
                        {b.title}
                        <div className="text-[11px] text-slate-500">{b.author}</div>
                      </td>
                      <td className="p-3">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                          {b.category}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`font-bold px-2 py-0.5 rounded ${
                            b.availableCopies > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {b.availableCopies} of {b.totalCopies} Available
                        </span>
                      </td>
                      <td className="p-3">
                        <ShelfBadge location={b.shelfLocation} size="sm" />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
