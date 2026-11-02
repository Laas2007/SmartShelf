import React from 'react';
import { Clock, AlertTriangle, CheckCircle, RotateCcw, CreditCard, Calendar, BookOpen, AlertCircle } from 'lucide-react';
import { Loan, StudentUser } from '../types/library';

interface MyLoansViewProps {
  loans: Loan[];
  student: StudentUser;
  onReturnBook: (loanId: string) => void;
  onPayFine: (loanId: string) => void;
}

export const MyLoansView: React.FC<MyLoansViewProps> = ({
  loans,
  student,
  onReturnBook,
  onPayFine,
}) => {
  const activeLoans = loans.filter((l) => l.status === 'ACTIVE' || l.status === 'OVERDUE');
  const returnedLoans = loans.filter((l) => l.status === 'RETURNED');
  const totalUnpaidFine = loans
    .filter((l) => !l.finePaid)
    .reduce((acc, l) => acc + l.fineAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header Overview Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Circulation Records</span>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">My Borrowed Books & Fines</h2>
            <p className="text-xs text-slate-500 mt-1">
              Active loans for {student.name} ({student.usn}) • Library ID: <span className="font-mono text-slate-700 font-semibold">{student.libraryId}</span> • Limit: {activeLoans.length}/{student.maxBorrowLimit} books
            </p>
          </div>

          {/* Fines summary widget */}
          <div className={`p-4 rounded-xl border flex items-center gap-4 ${
            totalUnpaidFine > 0 ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}>
            <div className={`p-2.5 rounded-lg ${totalUnpaidFine > 0 ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}>
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider opacity-80">Outstanding Fines</span>
              <div className="text-xl font-black">₹{totalUnpaidFine}</div>
              <p className="text-[11px] opacity-75">College overdue rate: ₹5.00/day</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Loans Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Currently Issued Books ({activeLoans.length})</span>
          </h3>
          <span className="text-xs text-slate-400">Books must be returned by 5:00 PM on due date</span>
        </div>

        {activeLoans.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No active books checked out</h4>
            <p className="text-xs text-slate-500 mt-1">You can borrow up to {student.maxBorrowLimit} books from the catalog.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeLoans.map((loan) => {
              const isOverdue = loan.status === 'OVERDUE';
              return (
                <div
                  key={loan.id}
                  className={`bg-white rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                    isOverdue ? 'border-rose-300 ring-1 ring-rose-300/50' : 'border-slate-200'
                  }`}
                >
                  <div>
                    {/* Status header */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                          isOverdue
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {isOverdue ? (
                          <>
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                            <span>OVERDUE ({Math.abs(loan.daysRemaining)} Days Late)</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                            <span>Due in {loan.daysRemaining} Days</span>
                          </>
                        )}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">ISBN: {loan.bookIsbn}</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">{loan.bookTitle}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">by {loan.bookAuthor}</p>

                    {/* Timeline dates */}
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Issue Date
                        </span>
                        <span className="font-semibold text-slate-700 mt-0.5 block">{loan.issueDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Due Date
                        </span>
                        <span className={`font-semibold mt-0.5 block ${isOverdue ? 'text-rose-600' : 'text-slate-700'}`}>
                          {loan.dueDate}
                        </span>
                      </div>
                    </div>

                    {/* Fine badge if applicable */}
                    {loan.fineAmount > 0 && (
                      <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                          <span className="text-xs text-rose-900 font-semibold">
                            Overdue Fine: ₹{loan.fineAmount} {loan.finePaid ? '(Paid)' : '(Unpaid)'}
                          </span>
                        </div>
                        {!loan.finePaid && (
                          <button
                            onClick={() => onPayFine(loan.id)}
                            className="px-2.5 py-1 text-xs font-bold text-rose-700 bg-white border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
                          >
                            Pay ₹{loan.fineAmount}
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Return simulation action */}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">ID: {loan.id}</span>
                    <button
                      onClick={() => onReturnBook(loan.id)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Simulate Return</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Return History Table */}
      {returnedLoans.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Borrowing History (Past Returns)</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="p-3 rounded-l-lg">Book Title</th>
                  <th className="p-3">Issued On</th>
                  <th className="p-3">Returned On</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 rounded-r-lg text-right">Fine Settled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {returnedLoans.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-800">{r.bookTitle}</td>
                    <td className="p-3 text-slate-500">{r.issueDate}</td>
                    <td className="p-3 text-slate-500">{r.returnDate || 'Recent'}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                        Returned
                      </span>
                    </td>
                    <td className="p-3 text-right text-slate-600">
                      {r.fineAmount > 0 ? `₹${r.fineAmount} (${r.finePaid ? 'Cleared' : 'Pending'})` : '₹0 (On Time)'}
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
