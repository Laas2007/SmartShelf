import {
  Book,
  Loan,
  Reservation,
  StudentUser,
  LibrarianUser,
  AdminUser,
  ShelfLocation,
  AuthSession,
  LibraryNotification,
  LibraryFloorLocation,
} from '../types/library';
import {
  INITIAL_BOOKS,
  INITIAL_LOANS,
  INITIAL_RESERVATIONS,
  SAMPLE_STUDENTS,
  DEMO_LIBRARIANS,
  DEMO_ADMIN,
  INITIAL_NOTIFICATIONS,
  INITIAL_LOCATIONS,
} from '../data/mockData';

const KEYS = {
  SESSION: 'digilibrary_auth_session_v2',
  BOOKS: 'digilibrary_books_v2',
  LOANS: 'digilibrary_loans_v2',
  RESERVATIONS: 'digilibrary_reservations_v2',
  STUDENTS: 'digilibrary_students_v2',
  LIBRARIANS: 'digilibrary_librarians_v2',
  NOTIFICATIONS: 'digilibrary_notifications_v2',
  LOCATIONS: 'digilibrary_locations_v2',
};

class StorageService {
  private get<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return fallback;
      return JSON.parse(data) as T;
    } catch {
      return fallback;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving key ${key}`, e);
    }
  }

  public init(): void {
    if (!localStorage.getItem(KEYS.BOOKS)) {
      this.set(KEYS.BOOKS, INITIAL_BOOKS);
    }
    if (!localStorage.getItem(KEYS.LOANS)) {
      this.set(KEYS.LOANS, INITIAL_LOANS);
    }
    if (!localStorage.getItem(KEYS.RESERVATIONS)) {
      this.set(KEYS.RESERVATIONS, INITIAL_RESERVATIONS);
    }
    if (!localStorage.getItem(KEYS.STUDENTS)) {
      this.set(KEYS.STUDENTS, SAMPLE_STUDENTS);
    }
    if (!localStorage.getItem(KEYS.LIBRARIANS)) {
      this.set(KEYS.LIBRARIANS, DEMO_LIBRARIANS);
    }
    if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
      this.set(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    }
    if (!localStorage.getItem(KEYS.LOCATIONS)) {
      this.set(KEYS.LOCATIONS, INITIAL_LOCATIONS);
    }
  }

  public resetAllData(): void {
    this.set(KEYS.BOOKS, INITIAL_BOOKS);
    this.set(KEYS.LOANS, INITIAL_LOANS);
    this.set(KEYS.RESERVATIONS, INITIAL_RESERVATIONS);
    this.set(KEYS.STUDENTS, SAMPLE_STUDENTS);
    this.set(KEYS.LIBRARIANS, DEMO_LIBRARIANS);
    this.set(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    this.set(KEYS.LOCATIONS, INITIAL_LOCATIONS);
  }

  // --- AUTHENTICATION SESSION ---
  public getSession(): AuthSession | null {
    return this.get<AuthSession | null>(KEYS.SESSION, null);
  }

  public setSession(session: AuthSession | null): void {
    if (!session) {
      localStorage.removeItem(KEYS.SESSION);
    } else {
      this.set(KEYS.SESSION, session);
    }
  }

  public logout(): void {
    localStorage.removeItem(KEYS.SESSION);
  }

  // --- STUDENTS ---
  public getStudents(): StudentUser[] {
    return this.get<StudentUser[]>(KEYS.STUDENTS, SAMPLE_STUDENTS);
  }

  public getStudentById(id: string): StudentUser | undefined {
    return this.getStudents().find((s) => s.id === id);
  }

  public getStudentByUsnOrLibId(query: string): StudentUser | undefined {
    const q = query.trim().toUpperCase();
    return this.getStudents().find(
      (s) => s.usn.toUpperCase() === q || s.libraryId.toUpperCase() === q
    );
  }

  public registerStudent(studentData: Omit<StudentUser, 'id'>): StudentUser {
    const students = this.getStudents();
    const newStudent: StudentUser = {
      ...studentData,
      id: `std_${Date.now()}`,
    };
    students.push(newStudent);
    this.set(KEYS.STUDENTS, students);
    return newStudent;
  }

  // --- LIBRARIANS ---
  public getLibrarians(): LibrarianUser[] {
    return this.get<LibrarianUser[]>(KEYS.LIBRARIANS, DEMO_LIBRARIANS);
  }

  public addLibrarian(libData: Omit<LibrarianUser, 'id'>): LibrarianUser {
    const list = this.getLibrarians();
    const created: LibrarianUser = {
      ...libData,
      id: `lib_${Date.now()}`,
    };
    list.push(created);
    this.set(KEYS.LIBRARIANS, list);
    return created;
  }

  // --- ADMIN ---
  public getAdmin(): AdminUser {
    return DEMO_ADMIN;
  }

  // --- LOCATIONS ---
  public getLocations(): LibraryFloorLocation[] {
    return this.get<LibraryFloorLocation[]>(KEYS.LOCATIONS, INITIAL_LOCATIONS);
  }

  // --- BOOKS ---
  public getBooks(): Book[] {
    return this.get<Book[]>(KEYS.BOOKS, INITIAL_BOOKS);
  }

  public getBookById(id: string): Book | undefined {
    return this.getBooks().find((b) => b.id === id);
  }

  public addBook(newBook: Omit<Book, 'id'>): Book {
    const books = this.getBooks();
    const created: Book = {
      ...newBook,
      id: `book_${Date.now()}`,
    };
    books.unshift(created);
    this.set(KEYS.BOOKS, books);
    return created;
  }

  public updateBook(updated: Book): void {
    const books = this.getBooks().map((b) => (b.id === updated.id ? updated : b));
    this.set(KEYS.BOOKS, books);
  }

  public deleteBook(id: string): void {
    const books = this.getBooks().filter((b) => b.id !== id);
    this.set(KEYS.BOOKS, books);
  }

  public updateShelfLocation(bookId: string, shelfLocation: ShelfLocation): Book | undefined {
    const books = this.getBooks();
    const book = books.find((b) => b.id === bookId);
    if (!book) return undefined;
    book.shelfLocation = shelfLocation;
    this.set(KEYS.BOOKS, books);
    return book;
  }

  // --- NOTIFICATIONS ---
  public getNotifications(studentId: string): LibraryNotification[] {
    const notifs = this.get<LibraryNotification[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    return notifs.filter((n) => n.studentId === studentId);
  }

  public markNotificationRead(notifId: string): void {
    const notifs = this.get<LibraryNotification[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const updated = notifs.map((n) => (n.id === notifId ? { ...n, read: true } : n));
    this.set(KEYS.NOTIFICATIONS, updated);
  }

  public addNotification(notif: Omit<LibraryNotification, 'id'>): void {
    const notifs = this.get<LibraryNotification[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    notifs.unshift({
      ...notif,
      id: `notif_${Date.now()}`,
    });
    this.set(KEYS.NOTIFICATIONS, notifs);
  }

  // --- LOANS ---
  public getAllLoans(): Loan[] {
    return this.get<Loan[]>(KEYS.LOANS, INITIAL_LOANS);
  }

  public getStudentLoans(studentId: string): Loan[] {
    return this.getAllLoans().filter((l) => l.studentId === studentId);
  }

  public borrowBook(bookId: string, student: StudentUser): { success: boolean; message: string; loan?: Loan } {
    const books = this.getBooks();
    const bookIndex = books.findIndex((b) => b.id === bookId);

    if (bookIndex === -1) {
      return { success: false, message: 'Book record not found in college catalog.' };
    }

    const book = books[bookIndex];
    if (book.availableCopies <= 0) {
      return { success: false, message: `All copies of "${book.title}" are currently borrowed. Please place a reservation instead.` };
    }

    const loans = this.getAllLoans();
    const activeStudentLoans = loans.filter(
      (l) => l.studentId === student.id && (l.status === 'ACTIVE' || l.status === 'OVERDUE')
    );

    if (activeStudentLoans.length >= student.maxBorrowLimit) {
      return {
        success: false,
        message: `Maximum borrow limit of ${student.maxBorrowLimit} books reached. Please return a book first.`,
      };
    }

    const alreadyBorrowed = activeStudentLoans.some((l) => l.bookId === bookId);
    if (alreadyBorrowed) {
      return { success: false, message: 'You already have an active loan for this book.' };
    }

    // Decrement available copies
    books[bookIndex].availableCopies -= 1;
    this.set(KEYS.BOOKS, books);

    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 14);

    const newLoan: Loan = {
      id: `loan_${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      bookAuthor: book.author,
      bookIsbn: book.isbn,
      studentId: student.id,
      studentName: student.name,
      studentUsn: student.usn,
      studentLibraryId: student.libraryId,
      issueDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      status: 'ACTIVE',
      daysRemaining: 14,
      fineAmount: 0,
      finePaid: false,
    };

    loans.unshift(newLoan);
    this.set(KEYS.LOANS, loans);

    // Fulfill reservation if this student had one
    const reservations = this.getAllReservations();
    const resIdx = reservations.findIndex((r) => r.bookId === bookId && r.studentId === student.id);
    if (resIdx !== -1) {
      reservations[resIdx].status = 'FULFILLED';
      this.set(KEYS.RESERVATIONS, reservations);
    }

    // Notification
    this.addNotification({
      studentId: student.id,
      title: 'Book Issued',
      message: `You checked out "${book.title}". Due date: ${newLoan.dueDate}.`,
      type: 'info',
      date: newLoan.issueDate,
      read: false,
    });

    return {
      success: true,
      message: `Successfully issued "${book.title}"! Due date: ${newLoan.dueDate}.`,
      loan: newLoan,
    };
  }

  public returnBook(loanId: string): { success: boolean; message: string; fineAmount: number } {
    const loans = this.getAllLoans();
    const loanIndex = loans.findIndex((l) => l.id === loanId);

    if (loanIndex === -1) {
      return { success: false, message: 'Loan record not found.', fineAmount: 0 };
    }

    const loan = loans[loanIndex];
    if (loan.status === 'RETURNED') {
      return { success: false, message: 'Book is already recorded as returned.', fineAmount: 0 };
    }

    const books = this.getBooks();
    const bookIndex = books.findIndex((b) => b.id === loan.bookId);

    if (bookIndex !== -1) {
      books[bookIndex].availableCopies = Math.min(
        books[bookIndex].totalCopies,
        books[bookIndex].availableCopies + 1
      );
      this.set(KEYS.BOOKS, books);
    }

    loan.status = 'RETURNED';
    loan.returnDate = new Date().toISOString().split('T')[0];
    this.set(KEYS.LOANS, loans);

    // Promote waitlist reservation if any
    const allRes = this.getAllReservations();
    const waitingRes = allRes.filter((r) => r.bookId === loan.bookId && r.status === 'WAITING');
    if (waitingRes.length > 0) {
      waitingRes.sort((a, b) => a.queuePosition - b.queuePosition);
      const nextInLine = waitingRes[0];
      nextInLine.status = 'READY_FOR_PICKUP';
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 3);
      nextInLine.pickupDeadline = deadline.toISOString().split('T')[0];
      this.set(KEYS.RESERVATIONS, allRes.map((r) => (r.id === nextInLine.id ? nextInLine : r)));

      // Notify that student
      this.addNotification({
        studentId: nextInLine.studentId,
        title: 'Held Book Ready for Pickup',
        message: `Your reservation for "${nextInLine.bookTitle}" is now held at the circulation desk until ${nextInLine.pickupDeadline}.`,
        type: 'success',
        date: new Date().toISOString().split('T')[0],
        read: false,
      });
    }

    const fineMsg = loan.fineAmount > 0 && !loan.finePaid ? ` Note: ₹${loan.fineAmount} overdue fine pending.` : '';

    return {
      success: true,
      message: `"${loan.bookTitle}" successfully returned to circulation.${fineMsg}`,
      fineAmount: loan.finePaid ? 0 : loan.fineAmount,
    };
  }

  public payFine(loanId: string): { success: boolean; message: string } {
    const loans = this.getAllLoans();
    const loan = loans.find((l) => l.id === loanId);
    if (!loan) return { success: false, message: 'Loan not found.' };

    loan.finePaid = true;
    this.set(KEYS.LOANS, loans);

    this.addNotification({
      studentId: loan.studentId,
      title: 'Fine Settled',
      message: `Receipt generated: Overdue fine of ₹${loan.fineAmount} for "${loan.bookTitle}" marked as paid.`,
      type: 'success',
      date: new Date().toISOString().split('T')[0],
      read: false,
    });

    return { success: true, message: `Receipt generated! ₹${loan.fineAmount} marked as paid.` };
  }

  public waiveFine(loanId: string, reason = 'Librarian Discretion'): { success: boolean; message: string } {
    const loans = this.getAllLoans();
    const loan = loans.find((l) => l.id === loanId);
    if (!loan) return { success: false, message: 'Loan not found.' };

    loan.fineAmount = 0;
    loan.finePaid = true;
    this.set(KEYS.LOANS, loans);

    this.addNotification({
      studentId: loan.studentId,
      title: 'Fine Waived',
      message: `Your overdue fine for "${loan.bookTitle}" was waived by library administration (${reason}).`,
      type: 'info',
      date: new Date().toISOString().split('T')[0],
      read: false,
    });

    return { success: true, message: `Fine waived successfully.` };
  }

  // --- RESERVATIONS ---
  public getAllReservations(): Reservation[] {
    return this.get<Reservation[]>(KEYS.RESERVATIONS, INITIAL_RESERVATIONS);
  }

  public getStudentReservations(studentId: string): Reservation[] {
    return this.getAllReservations().filter((r) => r.studentId === studentId);
  }

  public reserveBook(bookId: string, student: StudentUser): { success: boolean; message: string; reservation?: Reservation } {
    const book = this.getBookById(bookId);
    if (!book) return { success: false, message: 'Book not found.' };

    const reservations = this.getAllReservations();
    const existing = reservations.find(
      (r) => r.bookId === bookId && r.studentId === student.id && (r.status === 'WAITING' || r.status === 'READY_FOR_PICKUP')
    );

    if (existing) {
      return { success: false, message: 'You already have an active hold on this book.' };
    }

    const bookWaitlist = reservations.filter(
      (r) => r.bookId === bookId && (r.status === 'WAITING' || r.status === 'READY_FOR_PICKUP')
    );

    const isAvailableNow = book.availableCopies > 0;
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 3);

    const newRes: Reservation = {
      id: `res_${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      bookAuthor: book.author,
      studentId: student.id,
      studentName: student.name,
      studentUsn: student.usn,
      reservedAt: new Date().toISOString().split('T')[0],
      status: isAvailableNow ? 'READY_FOR_PICKUP' : 'WAITING',
      queuePosition: isAvailableNow ? 1 : bookWaitlist.length + 1,
      pickupDeadline: isAvailableNow ? deadline.toISOString().split('T')[0] : undefined,
    };

    reservations.unshift(newRes);
    this.set(KEYS.RESERVATIONS, reservations);

    this.addNotification({
      studentId: student.id,
      title: isAvailableNow ? 'Reservation Held for Pickup' : 'Waitlist Joined',
      message: isAvailableNow
        ? `"${book.title}" is held at the desk until ${newRes.pickupDeadline}.`
        : `You are queued at position #${newRes.queuePosition} for "${book.title}".`,
      type: isAvailableNow ? 'success' : 'info',
      date: newRes.reservedAt,
      read: false,
    });

    const msg = isAvailableNow
      ? `A copy is currently on shelf! Reserved for 3 days until ${newRes.pickupDeadline}.`
      : `Reserved! You are position #${newRes.queuePosition} in the waitlist.`;

    return { success: true, message: msg, reservation: newRes };
  }

  public cancelReservation(resId: string): { success: boolean; message: string } {
    const list = this.getAllReservations().filter((r) => r.id !== resId);
    this.set(KEYS.RESERVATIONS, list);
    return { success: true, message: 'Reservation cancelled successfully.' };
  }

  // --- RECOMMENDATIONS ---
  public getRecommendations(student: StudentUser): Book[] {
    const books = this.getBooks();
    const myLoans = this.getStudentLoans(student.id);
    const borrowedBookIds = new Set(myLoans.map((l) => l.bookId));

    // Recommend books not yet borrowed matching student department keywords or general high ratings
    const deptKeywords = student.department.toLowerCase().split(' ');
    const recommended = books.filter((b) => {
      if (borrowedBookIds.has(b.id)) return false;
      const titleLower = b.title.toLowerCase();
      const catLower = b.category.toLowerCase();
      const matchesDept = deptKeywords.some((kw) => kw.length > 2 && (catLower.includes(kw) || titleLower.includes(kw)));
      return matchesDept;
    });

    if (recommended.length >= 3) return recommended.slice(0, 4);

    // Fallback: popular available books
    const available = books.filter((b) => !borrowedBookIds.has(b.id) && b.availableCopies > 0);
    return [...recommended, ...available].slice(0, 4);
  }

  // --- STATS FOR ADMIN & LIBRARIAN ---
  public getStats() {
    const books = this.getBooks();
    const loans = this.getAllLoans();
    const reservations = this.getAllReservations();
    const students = this.getStudents();
    const librarians = this.getLibrarians();

    const totalTitles = books.length;
    const totalCopies = books.reduce((acc, b) => acc + b.totalCopies, 0);
    const availableCopies = books.reduce((acc, b) => acc + b.availableCopies, 0);
    const activeLoans = loans.filter((l) => l.status === 'ACTIVE' || l.status === 'OVERDUE');
    const overdueLoans = loans.filter((l) => l.status === 'OVERDUE');
    const totalFines = loans.reduce((acc, l) => acc + (l.fineAmount || 0), 0);
    const unpaidFines = loans.filter((l) => !l.finePaid).reduce((acc, l) => acc + (l.fineAmount || 0), 0);
    const collectedFines = totalFines - unpaidFines;

    return {
      totalTitles,
      totalCopies,
      availableCopies,
      issuedCopies: totalCopies - availableCopies,
      activeLoansCount: activeLoans.length,
      overdueLoansCount: overdueLoans.length,
      totalStudents: students.length,
      totalLibrarians: librarians.length,
      totalFines,
      unpaidFines,
      collectedFines,
      activeReservationsCount: reservations.filter((r) => r.status === 'WAITING' || r.status === 'READY_FOR_PICKUP').length,
    };
  }
}

export const storageService = new StorageService();
storageService.init();
