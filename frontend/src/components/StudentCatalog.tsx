import React, { useState, useMemo } from 'react';
import { Search, Filter, BookOpen, CheckCircle2, AlertOctagon, Sparkles, Bookmark } from 'lucide-react';
import { Book, Loan, Reservation, StudentUser } from '../types/library';
import { ShelfBadge } from './ShelfBadge';

interface StudentCatalogProps {
  books: Book[];
  loans: Loan[];
  reservations: Reservation[];
  student: StudentUser;
  recommendations: Book[];
  onSelectBook: (book: Book) => void;
  onBorrowBook: (book: Book) => void;
  onReserveBook: (book: Book) => void;
}

export const StudentCatalog: React.FC<StudentCatalogProps> = ({
  books,
  loans,
  reservations,
  student,
  recommendations,
  onSelectBook,
  onBorrowBook,
  onReserveBook,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(books.map((b) => b.category));
    return ['ALL', ...Array.from(set)];
  }, [books]);

  // Filter books
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const matchesSearch =
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.shelfLocation.rack.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.shelfLocation.callNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.tags && b.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())));

      const matchesCat = selectedCategory === 'ALL' || b.category === selectedCategory;
      const matchesAvail = !onlyAvailable || b.availableCopies > 0;

      return matchesSearch && matchesCat && matchesAvail;
    });
  }, [books, searchTerm, selectedCategory, onlyAvailable]);

  const activeLoans = loans.filter(
    (l) => l.studentId === student.id && (l.status === 'ACTIVE' || l.status === 'OVERDUE')
  );
  const canBorrowMore = activeLoans.length < student.maxBorrowLimit;

  return (
    <div className="space-y-6">
      {/* Student Welcome Banner with Complete Identity */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[11px] uppercase font-bold tracking-widest text-blue-200 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                B.M.S. College of Engineering
              </span>
              <span className="text-[11px] font-mono bg-blue-900/60 text-blue-200 px-2 py-0.5 rounded border border-blue-400/30">
                Library Card: {student.libraryId}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {student.name}!
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-1">
              USN: <span className="font-mono font-semibold text-white">{student.usn}</span> • {student.department} (Semester {student.semester})
            </p>
          </div>

          {/* Quick status pill counters */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
            <div className="text-center px-3 border-r border-white/20">
              <span className="text-[11px] text-blue-200 block uppercase font-medium">Active Loans</span>
              <span className="text-xl font-bold">{activeLoans.length} / {student.maxBorrowLimit}</span>
            </div>
            <div className="text-center px-3">
              <span className="text-[11px] text-blue-200 block uppercase font-medium">Holds Ready</span>
              <span className="text-xl font-bold text-amber-300">
                {reservations.filter((r) => r.status === 'READY_FOR_PICKUP').length}
              </span>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-8 -bottom-10 w-72 h-72 bg-white/5 rounded-full pointer-events-none blur-2xl" />
      </div>

      {/* Alternative Recommendations Section */}
      {recommendations.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50/70 via-blue-50/50 to-slate-50 p-5 rounded-2xl border border-indigo-100 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs uppercase font-bold tracking-wider text-indigo-950">
                  Recommended For You ({student.department.split('&')[0].trim()})
                </h3>
                <p className="text-[11px] text-indigo-700/80">Alternative titles matched with your semester curriculum</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                onClick={() => onSelectBook(rec)}
                className="bg-white p-3 rounded-xl border border-indigo-100/80 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                    {rec.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 line-clamp-1 mt-1">
                    {rec.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{rec.author}</p>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-indigo-700">F{rec.shelfLocation.floor} • {rec.shelfLocation.rack}</span>
                  <span className={`font-bold ${rec.availableCopies > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {rec.availableCopies > 0 ? `${rec.availableCopies} in stock` : 'Out of stock'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Main search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by book title, author, ISBN, topic, rack, or call number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Availability toggle */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 transition-colors">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>In-Stock Only</span>
            </label>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Department:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1 rounded-full whitespace-nowrap font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat === 'ALL' ? 'All Collections' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Book Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Showing {filteredBooks.length} Books in Library Catalog
          </span>
          <span className="text-xs text-slate-400">Click any card to view detailed shelf location</span>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No books matched your search</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search terms or clearing the category filter to see more titles.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('ALL');
                setOnlyAvailable(false);
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBooks.map((book) => {
              const isAvailable = book.availableCopies > 0;
              const hasActive = activeLoans.some((l) => l.bookId === book.id);
              const hasReserve = reservations.some(
                (r) =>
                  r.bookId === book.id &&
                  r.studentId === student.id &&
                  (r.status === 'WAITING' || r.status === 'READY_FOR_PICKUP')
              );

              return (
                <div
                  key={book.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  {/* Top Banner */}
                  <div>
                    <div className={`p-4 bg-gradient-to-r ${book.coverGradient} text-white relative`}>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                          {book.category}
                        </span>
                        <span className="text-[10px] font-mono bg-black/20 px-1.5 py-0.5 rounded">
                          {book.publishedYear}
                        </span>
                      </div>
                      <h3
                        onClick={() => onSelectBook(book)}
                        className="text-base font-bold text-white hover:underline cursor-pointer line-clamp-1"
                        title={book.title}
                      >
                        {book.title}
                      </h3>
                      <p className="text-xs text-white/80 line-clamp-1 mt-0.5">{book.author}</p>
                    </div>

                    {/* Book Body */}
                    <div className="p-4 space-y-3">
                      {/* Availability & Count */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                            isAvailable
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {isAvailable ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{book.availableCopies} of {book.totalCopies} Available</span>
                            </>
                          ) : (
                            <>
                              <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                              <span>Out of Stock (0/{book.totalCopies})</span>
                            </>
                          )}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">ISBN: {book.isbn.slice(-6)}</span>
                      </div>

                      {/* Shelf Location Box */}
                      <ShelfBadge location={book.shelfLocation} size="md" />

                      {/* Description snippet */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {book.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectBook(book)}
                      className="text-xs font-semibold text-slate-700 hover:text-blue-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      View Details
                    </button>

                    <div className="flex items-center gap-1.5">
                      {hasActive ? (
                        <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                          Borrowed
                        </span>
                      ) : hasReserve ? (
                        <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                          Hold Active
                        </span>
                      ) : isAvailable ? (
                        <button
                          onClick={() => onBorrowBook(book)}
                          disabled={!canBorrowMore}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                            !canBorrowMore
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                          }`}
                        >
                          Borrow Book
                        </button>
                      ) : (
                        <button
                          onClick={() => onReserveBook(book)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-all flex items-center gap-1"
                        >
                          <Bookmark className="w-3 h-3" />
                          <span>Reserve</span>
                        </button>
                      )}
                    </div>
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
