import React, { useState, useEffect, useCallback } from 'react';
import {
  Book,
  Loan,
  Reservation,
  StudentUser,
  LibrarianUser,
  AdminUser,
  ShelfLocation,
  AuthSession,
  LibraryFloorLocation,
} from './types/library';
import { storageService } from './services/storageService';
import { AuthScreen } from './components/AuthScreen';
import { Navbar, StudentTab, LibrarianTab, AdminTab } from './components/Navbar';
import { StudentCatalog } from './components/StudentCatalog';
import { MyLoansView } from './components/MyLoansView';
import { ReservationsView } from './components/ReservationsView';
import { LibrarianPortal } from './components/LibrarianPortal';
import { AdminPortal } from './components/AdminPortal';
import { BookModal } from './components/BookModal';
import { Toast, ToastMessage } from './components/Toast';

export const App: React.FC = () => {
  // Session State (Null = Show AuthScreen)
  const [authSession, setAuthSession] = useState<AuthSession | null>(() => storageService.getSession());

  // Active Tabs for each role
  const [studentTab, setStudentTab] = useState<StudentTab>('CATALOG');
  const [librarianTab, setLibrarianTab] = useState<LibrarianTab>('CIRCULATION');
  const [adminTab, setAdminTab] = useState<AdminTab>('ANALYTICS');

  // Core Data
  const [books, setBooks] = useState<Book[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [students, setStudents] = useState<StudentUser[]>([]);
  const [librarians, setLibrarians] = useState<LibrarianUser[]>([]);
  const [locations, setLocations] = useState<LibraryFloorLocation[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Sync state from storage
  const syncState = useCallback(() => {
    setBooks(storageService.getBooks());
    setLoans(storageService.getAllLoans());
    setReservations(storageService.getAllReservations());
    setStudents(storageService.getStudents());
    setLibrarians(storageService.getLibrarians());
    setLocations(storageService.getLocations());
  }, []);

  useEffect(() => {
    syncState();
  }, [syncState]);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({
      id: String(Date.now()),
      type,
      message,
    });
  };

  // Auth Handlers
  const handleLoginSuccess = (session: AuthSession) => {
    storageService.setSession(session);
    setAuthSession(session);
    showToast(
      'success',
      `Welcome to DigiLibrary, ${session.user.name} (${session.role === 'STUDENT' ? 'Student' : session.role === 'LIBRARIAN' ? 'Librarian' : 'Administrator'})`
    );
  };

  const handleLogout = () => {
    storageService.logout();
    setAuthSession(null);
    setSelectedBook(null);
    showToast('info', 'Logged out successfully. Returned to DigiLibrary sign-in.');
  };

  const handleResetData = () => {
    storageService.resetAllData();
    syncState();
    showToast('info', 'DigiLibrary prototype reset to original demonstration dataset.');
  };

  // Student Actions
  const currentStudent = authSession?.role === 'STUDENT' ? (authSession.user as StudentUser) : null;

  const handleBorrowBook = (book: Book) => {
    if (!currentStudent) return;
    const res = storageService.borrowBook(book.id, currentStudent);
    if (res.success) {
      showToast('success', res.message);
      syncState();
      if (selectedBook && selectedBook.id === book.id) {
        setSelectedBook(null);
      }
    } else {
      showToast('error', res.message);
    }
  };

  const handleReserveBook = (book: Book) => {
    if (!currentStudent) return;
    const res = storageService.reserveBook(book.id, currentStudent);
    if (res.success) {
      showToast('success', res.message);
      syncState();
      if (selectedBook && selectedBook.id === book.id) {
        setSelectedBook(null);
      }
    } else {
      showToast('error', res.message);
    }
  };

  const handleReturnBook = (loanId: string) => {
    const res = storageService.returnBook(loanId);
    if (res.success) {
      showToast('success', res.message);
      syncState();
    } else {
      showToast('error', res.message);
    }
  };

  const handlePayFine = (loanId: string) => {
    const res = storageService.payFine(loanId);
    if (res.success) {
      showToast('success', res.message);
      syncState();
    } else {
      showToast('error', res.message);
    }
  };

  const handleCancelReservation = (resId: string) => {
    const res = storageService.cancelReservation(resId);
    showToast('info', res.message);
    syncState();
  };

  const handleMarkNotificationRead = (notifId: string) => {
    storageService.markNotificationRead(notifId);
    syncState();
  };

  // Librarian & Admin Actions
  const handleLibrarianIssue = (bookId: string, studentId: string) => {
    const targetStudent = students.find((s) => s.id === studentId) || students[0];
    const res = storageService.borrowBook(bookId, targetStudent);
    if (res.success) {
      showToast('success', `Issued: ${res.message}`);
      syncState();
    } else {
      showToast('error', res.message);
    }
  };

  const handleWaiveFine = (loanId: string) => {
    const res = storageService.waiveFine(loanId);
    showToast('info', res.message);
    syncState();
  };

  const handleAddNewBook = (newBook: Omit<Book, 'id'>) => {
    const created = storageService.addBook(newBook);
    showToast('success', `Added "${created.title}" to catalog.`);
    syncState();
  };

  const handleUpdateShelf = (bookId: string, shelfLocation: ShelfLocation) => {
    const updated = storageService.updateShelfLocation(bookId, shelfLocation);
    if (updated) {
      showToast('success', `Updated shelf coordinates for "${updated.title}".`);
      syncState();
    }
  };

  const handleDeleteBook = (bookId: string) => {
    storageService.deleteBook(bookId);
    showToast('info', 'Book removed from catalog.');
    syncState();
  };

  const handleAddStudent = (studentData: Omit<StudentUser, 'id'>) => {
    const created = storageService.registerStudent(studentData);
    showToast('success', `Registered ${created.name} (${created.usn}).`);
    syncState();
  };

  const handleAddLibrarian = (libData: Omit<LibrarianUser, 'id'>) => {
    const created = storageService.addLibrarian(libData);
    showToast('success', `Added staff member ${created.name}.`);
    syncState();
  };

  // If not logged in, render the professional authentication screen
  if (!authSession) {
    return (
      <>
        <AuthScreen
          students={students}
          librarians={librarians}
          admin={storageService.getAdmin()}
          onLoginSuccess={handleLoginSuccess}
          onRegisterStudent={(data) => {
            const created = storageService.registerStudent(data);
            syncState();
            return created;
          }}
          onResetData={handleResetData}
        />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  // Derived student-specific datasets (strictly filtered to active student only)
  const studentLoans = currentStudent ? loans.filter((l) => l.studentId === currentStudent.id) : [];
  const activeStudentLoans = studentLoans.filter((l) => l.status === 'ACTIVE' || l.status === 'OVERDUE');
  const hasOverdue = activeStudentLoans.some((l) => l.status === 'OVERDUE');
  const studentReservations = currentStudent
    ? reservations.filter((r) => r.studentId === currentStudent.id)
    : [];
  const studentNotifications = currentStudent
    ? storageService.getNotifications(currentStudent.id)
    : [];
  const studentRecommendations = currentStudent
    ? storageService.getRecommendations(currentStudent)
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navbar */}
      <Navbar
        currentRole={authSession.role}
        currentUser={authSession.user}
        studentTab={studentTab}
        onStudentTabChange={setStudentTab}
        librarianTab={librarianTab}
        onLibrarianTabChange={setLibrarianTab}
        adminTab={adminTab}
        onAdminTabChange={setAdminTab}
        activeLoansCount={activeStudentLoans.length}
        hasOverdue={hasOverdue}
        reservationsCount={studentReservations.length}
        notifications={studentNotifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onLogout={handleLogout}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 1. STUDENT VIEW */}
        {authSession.role === 'STUDENT' && currentStudent && (
          <div>
            {studentTab === 'CATALOG' && (
              <StudentCatalog
                books={books}
                loans={loans}
                reservations={reservations}
                student={currentStudent}
                recommendations={studentRecommendations}
                onSelectBook={(book) => setSelectedBook(book)}
                onBorrowBook={handleBorrowBook}
                onReserveBook={handleReserveBook}
              />
            )}

            {studentTab === 'MY_LOANS' && (
              <MyLoansView
                loans={studentLoans}
                student={currentStudent}
                onReturnBook={handleReturnBook}
                onPayFine={handlePayFine}
              />
            )}

            {studentTab === 'RESERVATIONS' && (
              <ReservationsView
                reservations={studentReservations}
                student={currentStudent}
                onCancelReservation={handleCancelReservation}
              />
            )}
          </div>
        )}

        {/* 2. LIBRARIAN VIEW */}
        {authSession.role === 'LIBRARIAN' && (
          <LibrarianPortal
            librarian={authSession.user as LibrarianUser}
            activeTab={librarianTab}
            books={books}
            loans={loans}
            reservations={reservations}
            students={students}
            onIssueBook={handleLibrarianIssue}
            onReturnBook={handleReturnBook}
            onCollectFine={handlePayFine}
            onWaiveFine={handleWaiveFine}
            onCancelReservation={handleCancelReservation}
          />
        )}

        {/* 3. ADMIN VIEW */}
        {authSession.role === 'ADMIN' && (
          <AdminPortal
            admin={authSession.user as AdminUser}
            activeTab={adminTab}
            books={books}
            loans={loans}
            reservations={reservations}
            students={students}
            librarians={librarians}
            locations={locations}
            onAddNewBook={handleAddNewBook}
            onUpdateShelf={handleUpdateShelf}
            onDeleteBook={handleDeleteBook}
            onAddStudent={handleAddStudent}
            onAddLibrarian={handleAddLibrarian}
          />
        )}
      </main>

      {/* Book Detail Modal */}
      <BookModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        onBorrow={handleBorrowBook}
        onReserve={handleReserveBook}
        hasActiveLoan={Boolean(
          selectedBook && currentStudent && activeStudentLoans.some((l) => l.bookId === selectedBook.id)
        )}
        hasReservation={Boolean(
          selectedBook &&
            currentStudent &&
            studentReservations.some(
              (r) =>
                r.bookId === selectedBook.id &&
                (r.status === 'WAITING' || r.status === 'READY_FOR_PICKUP')
            )
        )}
        canBorrowMore={Boolean(
          currentStudent && activeStudentLoans.length < currentStudent.maxBorrowLimit
        )}
      />

      {/* Notification Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium">
            <span className="font-bold text-slate-800">DigiLibrary</span>
            <span>•</span>
            <span>Digital College Library Management System</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Interactive Demo Mode (LocalStorage)</span>
            <span>•</span>
            <span>Role-Based Access Control Enabled</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
