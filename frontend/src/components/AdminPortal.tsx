import React, { useState } from 'react';
import {
  BookOpen,
  PlusCircle,
  Search,
  Users,
  ShieldCheck,
  Building2,
  Trash2,
  Clock,
  AlertTriangle,
  CreditCard,
} from 'lucide-react';
import {
  Book,
  Loan,
  Reservation,
  StudentUser,
  LibrarianUser,
  AdminUser,
  ShelfLocation,
  LibraryFloorLocation,
} from '../types/library';
import { ShelfBadge } from './ShelfBadge';

interface AdminPortalProps {
  admin: AdminUser;
  activeTab: 'ANALYTICS' | 'CATALOG' | 'STUDENTS' | 'LIBRARIANS' | 'LOCATIONS';
  books: Book[];
  loans: Loan[];
  reservations: Reservation[];
  students: StudentUser[];
  librarians: LibrarianUser[];
  locations: LibraryFloorLocation[];
  onAddNewBook: (book: Omit<Book, 'id'>) => void;
  onUpdateShelf: (bookId: string, shelfLocation: ShelfLocation) => void;
  onDeleteBook: (bookId: string) => void;
  onAddStudent: (student: Omit<StudentUser, 'id'>) => void;
  onAddLibrarian: (lib: Omit<LibrarianUser, 'id'>) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  admin,
  activeTab,
  books,
  loans,
  students,
  librarians,
  locations,
  onAddNewBook,
  onUpdateShelf,
  onDeleteBook,
  onAddStudent,
  onAddLibrarian,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showLibModal, setShowLibModal] = useState(false);
  const [editingShelfBook, setEditingShelfBook] = useState<Book | null>(null);

  // Add Book Form state
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newIsbn, setNewIsbn] = useState('');
  const [newCategory, setNewCategory] = useState('Computer Science');
  const [newTotalCopies, setNewTotalCopies] = useState(5);
  const [newPublisher, setNewPublisher] = useState('MIT Press');
  const [newYear, setNewYear] = useState(2024);
  const [newDescription, setNewDescription] = useState('');
  const [newFloor, setNewFloor] = useState(1);
  const [newWing, setNewWing] = useState('North Wing (Computer Science)');
  const [newRack, setNewRack] = useState('Rack CS-06');
  const [newShelf, setNewShelf] = useState('Tier A');
  const [newCallNumber, setNewCallNumber] = useState('QA76.7 .D54 2024');

  // Add Student Form state
  const [studName, setStudName] = useState('');
  const [studUsn, setStudUsn] = useState('');
  const [studDept, setStudDept] = useState('Computer Science & Engineering');
  const [studSem, setStudSem] = useState(4);
  const [studEmail, setStudEmail] = useState('');

  // Add Librarian Form state
  const [libName, setLibName] = useState('');
  const [libStaffId, setLibStaffId] = useState('');
  const [libEmail, setLibEmail] = useState('');
  const [libDesk, setLibDesk] = useState('Digital Library Lab (Floor 2)');
  const [libShift, setLibShift] = useState('Morning (8:30 AM - 3:30 PM)');

  // Stats
  const totalTitles = books.length;
  const totalCopies = books.reduce((acc, b) => acc + b.totalCopies, 0);
  const availableCopies = books.reduce((acc, b) => acc + b.availableCopies, 0);
  const activeLoans = loans.filter((l) => l.status === 'ACTIVE' || l.status === 'OVERDUE');
  const overdueLoans = loans.filter((l) => l.status === 'OVERDUE');
  const unpaidFines = loans.filter((l) => !l.finePaid).reduce((acc, l) => acc + l.fineAmount, 0);

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAuthor || !newIsbn) return;

    onAddNewBook({
      title: newTitle,
      author: newAuthor,
      isbn: newIsbn,
      category: newCategory,
      totalCopies: Number(newTotalCopies),
      availableCopies: Number(newTotalCopies),
      publisher: newPublisher,
      publishedYear: Number(newYear),
      description: newDescription || `${newTitle} by ${newAuthor}. Added to DigiLibrary catalog.`,
      coverGradient: 'from-blue-700 to-slate-900',
      tags: [newCategory, 'New Acquisition'],
      shelfLocation: {
        floor: Number(newFloor),
        wing: newWing,
        rack: newRack,
        shelfNumber: newShelf,
        callNumber: newCallNumber,
      },
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewAuthor('');
    setNewIsbn('');
  };

  const handleSaveShelf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShelfBook) return;
    onUpdateShelf(editingShelfBook.id, editingShelfBook.shelfLocation);
    setEditingShelfBook(null);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studName || !studUsn) return;

    onAddStudent({
      name: studName,
      usn: studUsn.toUpperCase(),
      libraryId: `LIB-${studDept.slice(0, 2).toUpperCase()}-2026-${Math.floor(100 + Math.random() * 900)}`,
      department: studDept,
      semester: Number(studSem),
      email: studEmail || `${studUsn.toLowerCase()}@bmsce.ac.in`,
      maxBorrowLimit: 4,
      avatarColor: 'from-blue-600 to-indigo-600',
    });

    setShowStudentModal(false);
    setStudName('');
    setStudUsn('');
  };

  const handleCreateLibrarian = (e: React.FormEvent) => {
    e.preventDefault();
    if (!libName || !libStaffId) return;

    onAddLibrarian({
      name: libName,
      staffId: libStaffId.toUpperCase(),
      email: libEmail || `${libStaffId.toLowerCase()}@bmsce.ac.in`,
      desk: libDesk,
      shift: libShift,
    });

    setShowLibModal(false);
    setLibName('');
    setLibStaffId('');
  };

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.shelfLocation.rack.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Admin Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-purple-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-purple-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] uppercase font-bold tracking-widest text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-400/30">
                Institutional Administration
              </span>
              <span className="text-[11px] font-mono text-slate-300">Admin ID: {admin.adminId}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {admin.name}
            </h1>
            <p className="text-purple-200 text-xs sm:text-sm mt-0.5">
              {admin.roleTitle} • B.M.S. College of Engineering
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-xs">
            <div className="text-center px-3 border-r border-white/20">
              <span className="text-purple-200 block text-[10px] uppercase font-semibold">Total Students</span>
              <span className="text-lg font-bold text-white">{students.length}</span>
            </div>
            <div className="text-center px-3">
              <span className="text-purple-200 block text-[10px] uppercase font-semibold">Library Staff</span>
              <span className="text-lg font-bold text-purple-300">{librarians.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. ANALYTICS & OVERVIEW */}
      {activeTab === 'ANALYTICS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Catalog Volume</span>
                <BookOpen className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{totalTitles} <span className="text-xs font-normal text-slate-500">Titles</span></div>
              <p className="text-xs text-slate-600 mt-1">
                Total Copies: <strong className="text-slate-800">{totalCopies}</strong> ({availableCopies} on shelves)
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Checkouts</span>
                <Clock className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-indigo-700">{activeLoans.length}</div>
              <p className="text-xs text-slate-600 mt-1">
                Circulating across all college branches
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Overdue Returns</span>
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-2xl font-black text-rose-600">{overdueLoans.length}</div>
              <p className="text-xs text-rose-700/80 mt-1 font-medium">
                Pending late returns requiring notice
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Unsettled Fines</span>
                <CreditCard className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-amber-600">₹{unpaidFines}</div>
              <p className="text-xs text-slate-600 mt-1">
                Accumulated late fine balance
              </p>
            </div>
          </div>

          {/* Floor Capacity Overview */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-600" />
              <span>Library Building & Shelf Capacity</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {locations.map((loc) => (
                <div key={loc.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">Floor {loc.floor}</span>
                    <span className="text-[10px] font-mono text-purple-700 font-semibold">{loc.rackPrefix}</span>
                  </div>
                  <div className="text-slate-600 text-[11px] font-medium">{loc.wing}</div>
                  <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">{loc.totalRacks} Racks</span>
                    <span className="font-bold text-purple-800">{loc.capacityBooks.toLocaleString()} Books Max</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. CATALOG & SHELF MANAGEMENT */}
      {activeTab === 'CATALOG' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Physical Shelf & Inventory Management</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Every title has an exact Floor, Wing, Rack, and Shelf coordinate.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter title or rack..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add New Book</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="p-3 rounded-l-lg">Title & Author</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">In-Stock / Total</th>
                  <th className="p-3">Shelf Location</th>
                  <th className="p-3 rounded-r-lg text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBooks.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{b.title}</div>
                      <div className="text-[11px] text-slate-500">{b.author}</div>
                      <div className="text-[10px] font-mono text-slate-400">ISBN: {b.isbn}</div>
                    </td>
                    <td className="p-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                        {b.category}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`font-bold px-2 py-0.5 rounded ${
                          b.availableCopies > 0
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {b.availableCopies} / {b.totalCopies} Available
                      </span>
                    </td>
                    <td className="p-3">
                      <ShelfBadge location={b.shelfLocation} size="sm" />
                    </td>
                    <td className="p-3 text-right space-x-1.5">
                      <button
                        onClick={() => setEditingShelfBook(b)}
                        className="text-xs font-semibold text-purple-600 hover:text-purple-800 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200"
                      >
                        Edit Shelf
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${b.title}" from catalog?`)) {
                            onDeleteBook(b.id);
                          }
                        }}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-800 p-1 hover:bg-rose-50 rounded"
                        title="Delete Book"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. STUDENT DIRECTORY */}
      {activeTab === 'STUDENTS' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span>Registered Student Directory</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage student library accounts, borrow quotas, and credentials.
              </p>
            </div>
            <button
              onClick={() => setShowStudentModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Register Student</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="p-3 rounded-l-lg">Student Name</th>
                  <th className="p-3">USN</th>
                  <th className="p-3">Library Card ID</th>
                  <th className="p-3">Department & Sem</th>
                  <th className="p-3">Active Loans</th>
                  <th className="p-3 rounded-r-lg">Quota</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s) => {
                  const sLoans = loans.filter((l) => l.studentId === s.id && (l.status === 'ACTIVE' || l.status === 'OVERDUE'));
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-900">{s.name}</td>
                      <td className="p-3 font-mono text-purple-700 font-semibold">{s.usn}</td>
                      <td className="p-3 font-mono text-slate-500">{s.libraryId}</td>
                      <td className="p-3 text-slate-700">{s.department} (Sem {s.semester})</td>
                      <td className="p-3">
                        <span className="font-semibold text-slate-800">{sLoans.length} books</span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                          {s.maxBorrowLimit} Max
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. LIBRARIAN STAFF DIRECTORY */}
      {activeTab === 'LIBRARIANS' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-600" />
                <span>Library Staff & Circulation Officers</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Staff authorized for desk checkouts, fine collection, and inventory audits.
              </p>
            </div>
            <button
              onClick={() => setShowLibModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Librarian Staff</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="p-3 rounded-l-lg">Staff Name</th>
                  <th className="p-3">Staff ID</th>
                  <th className="p-3">Assigned Desk Location</th>
                  <th className="p-3">Shift Hours</th>
                  <th className="p-3 rounded-r-lg">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {librarians.map((lib) => (
                  <tr key={lib.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900">{lib.name}</td>
                    <td className="p-3 font-mono text-purple-700 font-semibold">{lib.staffId}</td>
                    <td className="p-3 text-slate-700">{lib.desk}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {lib.shift}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 font-mono">{lib.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. LOCATIONS & FLOOR LAYOUT */}
      {activeTab === 'LOCATIONS' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-600" />
              <span>Library Building & Physical Layout Structure</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Floor, Wing, and Rack layout for physical book placement in the college library.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {locations.map((loc) => (
              <div key={loc.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-900">Floor {loc.floor} • {loc.wing}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-100 text-purple-800">
                    {loc.rackPrefix}
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  <strong className="text-slate-800">Subject Coverage:</strong> {loc.categoryFocus}
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-700">
                  <span>Capacity: <strong>{loc.capacityBooks.toLocaleString()} volumes</strong></span>
                  <span>Racks: <strong>{loc.totalRacks} physical aisles</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Add New Book to DigiLibrary</h3>
            <p className="text-xs text-slate-500 mb-4">Enter book details and assign physical shelf coordinates.</p>

            <form onSubmit={handleCreateBook} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Book Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design Patterns: Elements of Reusable Object-Oriented Software"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Author(s) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Erich Gamma, Richard Helm"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">ISBN *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 978-0201633610"
                    value={newIsbn}
                    onChange={(e) => setNewIsbn(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Algorithms & Data Structures">Algorithms & Data Structures</option>
                    <option value="Database Systems">Database Systems</option>
                    <option value="Artificial Intelligence & ML">Artificial Intelligence & ML</option>
                    <option value="Operating Systems">Operating Systems</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Hardware & Architecture">Hardware & Architecture</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Total Copies</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={newTotalCopies}
                    onChange={(e) => setNewTotalCopies(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Publisher</label>
                  <input
                    type="text"
                    value={newPublisher}
                    onChange={(e) => setNewPublisher(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Publication Year</label>
                  <input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Description / Synopsis</label>
                <textarea
                  rows={2}
                  placeholder="Overview of syllabus or topic coverage..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>

              {/* Shelf location assignment */}
              <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-2">
                <span className="font-bold text-purple-900 block">Shelf Assignment</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-purple-800 block">Floor</label>
                    <input
                      type="number"
                      min="1"
                      max="4"
                      value={newFloor}
                      onChange={(e) => setNewFloor(Number(e.target.value))}
                      className="w-full p-1.5 border border-purple-200 bg-white rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-purple-800 block">Rack</label>
                    <input
                      type="text"
                      value={newRack}
                      onChange={(e) => setNewRack(e.target.value)}
                      className="w-full p-1.5 border border-purple-200 bg-white rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-purple-800 block">Shelf</label>
                    <input
                      type="text"
                      value={newShelf}
                      onChange={(e) => setNewShelf(e.target.value)}
                      className="w-full p-1.5 border border-purple-200 bg-white rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-purple-800 block">Wing / Section</label>
                  <input
                    type="text"
                    value={newWing}
                    onChange={(e) => setNewWing(e.target.value)}
                    className="w-full p-1.5 border border-purple-200 bg-white rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-purple-800 block">Library Call Number</label>
                  <input
                    type="text"
                    value={newCallNumber}
                    onChange={(e) => setNewCallNumber(e.target.value)}
                    className="w-full p-1.5 border border-purple-200 bg-white rounded-lg font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Shelf Modal */}
      {editingShelfBook && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Update Shelf Location: {editingShelfBook.title}
            </h3>
            <p className="text-xs text-slate-500 mb-4">Reassign physical rack, tier, or wing.</p>

            <form onSubmit={handleSaveShelf} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Floor</label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    value={editingShelfBook.shelfLocation.floor}
                    onChange={(e) =>
                      setEditingShelfBook({
                        ...editingShelfBook,
                        shelfLocation: {
                          ...editingShelfBook.shelfLocation,
                          floor: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Rack ID</label>
                  <input
                    type="text"
                    value={editingShelfBook.shelfLocation.rack}
                    onChange={(e) =>
                      setEditingShelfBook({
                        ...editingShelfBook,
                        shelfLocation: {
                          ...editingShelfBook.shelfLocation,
                          rack: e.target.value,
                        },
                      })
                    }
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Wing / Section</label>
                <input
                  type="text"
                  value={editingShelfBook.shelfLocation.wing}
                  onChange={(e) =>
                    setEditingShelfBook({
                      ...editingShelfBook,
                      shelfLocation: {
                        ...editingShelfBook.shelfLocation,
                        wing: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Shelf / Tier</label>
                <input
                  type="text"
                  value={editingShelfBook.shelfLocation.shelfNumber}
                  onChange={(e) =>
                    setEditingShelfBook({
                      ...editingShelfBook,
                      shelfLocation: {
                        ...editingShelfBook.shelfLocation,
                        shelfNumber: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Call Number</label>
                <input
                  type="text"
                  value={editingShelfBook.shelfLocation.callNumber}
                  onChange={(e) =>
                    setEditingShelfBook({
                      ...editingShelfBook,
                      shelfLocation: {
                        ...editingShelfBook.shelfLocation,
                        callNumber: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingShelfBook(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Update Coordinates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add Student to Directory</h3>
            <p className="text-xs text-slate-500 mb-4">Register college student for library borrowing rights.</p>

            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikas Sharma"
                  value={studName}
                  onChange={(e) => setStudName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">USN *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1BM23CS105"
                    value={studUsn}
                    onChange={(e) => setStudUsn(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Semester</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={studSem}
                    onChange={(e) => setStudSem(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Department</label>
                <input
                  type="text"
                  value={studDept}
                  onChange={(e) => setStudDept(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Email</label>
                <input
                  type="email"
                  value={studEmail}
                  onChange={(e) => setStudEmail(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStudentModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Librarian Modal */}
      {showLibModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add Librarian Staff</h3>
            <p className="text-xs text-slate-500 mb-4">Grant circulation and desk privileges to library staff.</p>

            <form onSubmit={handleCreateLibrarian} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Staff Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sumanth Hegde"
                  value={libName}
                  onChange={(e) => setLibName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Staff ID *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LIB-STF-04"
                  value={libStaffId}
                  onChange={(e) => setLibStaffId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl uppercase font-mono"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Staff Email</label>
                <input
                  type="email"
                  placeholder="e.g. sumanth.lib@bmsce.ac.in"
                  value={libEmail}
                  onChange={(e) => setLibEmail(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Assigned Desk Location</label>
                <input
                  type="text"
                  value={libDesk}
                  onChange={(e) => setLibDesk(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Shift</label>
                <input
                  type="text"
                  value={libShift}
                  onChange={(e) => setLibShift(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLibModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Save Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
