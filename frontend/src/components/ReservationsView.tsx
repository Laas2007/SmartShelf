import React from 'react';
import { Bookmark, Clock, CheckCircle2, AlertCircle, XCircle, Building2 } from 'lucide-react';
import { Reservation, StudentUser } from '../types/library';

interface ReservationsViewProps {
  reservations: Reservation[];
  student: StudentUser;
  onCancelReservation: (resId: string) => void;
}

export const ReservationsView: React.FC<ReservationsViewProps> = ({
  reservations,
  student,
  onCancelReservation,
}) => {
  const activeReservations = reservations.filter(
    (r) => r.status === 'WAITING' || r.status === 'READY_FOR_PICKUP'
  );

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Hold Requests</span>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">My Book Reservations</h2>
            <p className="text-xs text-slate-500 mt-1">
              Active reservations for {student.name} ({student.usn}) • Card: <span className="font-mono text-slate-700 font-semibold">{student.libraryId}</span> • {student.department}
            </p>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 p-3.5 rounded-xl flex items-center gap-3">
            <Building2 className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <div className="text-xs text-indigo-900">
              <span className="font-bold block">Circulation Desk Rule</span>
              Held books are kept reserved for 3 days after becoming available.
            </div>
          </div>
        </div>
      </div>

      {/* Reservation cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-indigo-600" />
            <span>Active Reservations ({activeReservations.length})</span>
          </h3>
        </div>

        {activeReservations.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
            <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No active book reservations</h4>
            <p className="text-xs text-slate-500 mt-1">
              When a book is checked out or out of stock, reserve it from the catalog to get in the waitlist.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeReservations.map((res) => {
              const isReady = res.status === 'READY_FOR_PICKUP';

              return (
                <div
                  key={res.id}
                  className={`bg-white rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                    isReady ? 'border-emerald-300 ring-1 ring-emerald-300/50' : 'border-slate-200'
                  }`}
                >
                  <div>
                    {/* Status Pill */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                          isReady
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {isReady ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>READY FOR PICKUP</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Waitlist Queue: Position #{res.queuePosition}</span>
                          </>
                        )}
                      </span>
                      <span className="text-[11px] text-slate-400">Reserved: {res.reservedAt}</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">{res.bookTitle}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">by {res.bookAuthor}</p>

                    {/* Readiness Details */}
                    {isReady ? (
                      <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                        <div className="flex items-center gap-1.5 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Ready at Main Circulation Desk (Floor 1)</span>
                        </div>
                        <p className="mt-1 text-emerald-800">
                          Please collect before: <span className="font-semibold underline">{res.pickupDeadline}</span> with your college ID card.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5 font-medium">
                          <AlertCircle className="w-4 h-4 text-slate-400" />
                          <span>Waiting for an issued copy to be returned.</span>
                        </div>
                        <p className="mt-1 text-slate-500">
                          You will be notified and this status will turn green as soon as a copy is returned.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">ID: {res.id}</span>
                    <button
                      onClick={() => onCancelReservation(res.id)}
                      className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel Hold</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
