import React from 'react';
import { X, BookCheck, Bookmark, AlertCircle, Building2, Tag } from 'lucide-react';
import { Book } from '../types/library';
import { ShelfBadge } from './ShelfBadge';

interface BookModalProps {
  book: Book | null;
  onClose: () => void;
  onBorrow: (book: Book) => void;
  onReserve: (book: Book) => void;
  hasActiveLoan: boolean;
  hasReservation: boolean;
  canBorrowMore: boolean;
}

export const BookModal: React.FC<BookModalProps> = ({
  book,
  onClose,
  onBorrow,
  onReserve,
  hasActiveLoan,
  hasReservation,
  canBorrowMore,
}) => {
  if (!book) return null;

  const isAvailable = book.availableCopies > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-scale-up">
        {/* Header with gradient banner */}
        <div className={`p-6 bg-gradient-to-r ${book.coverGradient} text-white relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs">
              {book.category}
            </span>
            <span className="text-xs font-mono bg-black/20 px-2 py-0.5 rounded">
              ISBN: {book.isbn}
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">{book.title}</h2>
          <p className="text-white/80 text-sm mt-1">by {book.author}</p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Availability & Shelf Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status card */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">Inventory Status</span>
                <div className="text-lg font-bold mt-0.5 flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <span className={isAvailable ? 'text-emerald-700' : 'text-rose-700'}>
                    {isAvailable ? `${book.availableCopies} Copies Available` : 'All Copies Checked Out'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Total college inventory: {book.totalCopies} copies</p>
              </div>
            </div>

            {/* Quick Shelf Summary */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-blue-700">Quick Locator</span>
                <div className="text-sm font-bold text-slate-800 mt-0.5 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Floor {book.shelfLocation.floor} • {book.shelfLocation.rack}
                </div>
                <p className="text-xs text-slate-600 mt-1">{book.shelfLocation.shelfNumber}</p>
              </div>
            </div>
          </div>

          {/* Detailed Shelf Location Component */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-2">Physical Location in College Library</h3>
            <ShelfBadge location={book.shelfLocation} showDetails={true} />
          </div>

          {/* Book Synopsis */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-1">About This Book</h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {book.description}
            </p>
          </div>

          {/* Academic Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50">
              <span className="text-slate-400 block">Publisher</span>
              <span className="font-semibold text-slate-800">{book.publisher}</span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50">
              <span className="text-slate-400 block">Publication Year</span>
              <span className="font-semibold text-slate-800">{book.publishedYear}</span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 col-span-2 sm:col-span-1">
              <span className="text-slate-400 block">Call Number</span>
              <span className="font-mono font-semibold text-indigo-700">{book.shelfLocation.callNumber}</span>
            </div>
          </div>

          {/* Subject Tags */}
          {book.tags && (
            <div className="flex flex-wrap gap-1.5">
              {book.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md"
                >
                  <Tag className="w-3 h-3 text-slate-400" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Warnings / Status notices */}
          {hasActiveLoan && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
              <span>You currently have an active borrowing record for this book. Visit <strong>My Loans & Fines</strong> to check due dates.</span>
            </div>
          )}

          {hasReservation && !hasActiveLoan && (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center gap-2">
              <Bookmark className="w-4 h-4 flex-shrink-0 text-blue-600" />
              <span>You have already placed a reservation hold on this book.</span>
            </div>
          )}

          {!canBorrowMore && !hasActiveLoan && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>You have reached your 4-book maximum borrow limit. Return an existing book to checkout more.</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onReserve(book)}
              disabled={hasReservation}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                hasReservation
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 shadow-xs'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>{hasReservation ? 'Reserved' : 'Reserve Copy'}</span>
            </button>

            <button
              onClick={() => onBorrow(book)}
              disabled={!isAvailable || hasActiveLoan || !canBorrowMore}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
                !isAvailable || hasActiveLoan || !canBorrowMore
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20'
              }`}
            >
              <BookCheck className="w-4 h-4" />
              <span>{isAvailable ? 'Borrow (14-Day Loan)' : 'Out of Stock'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
