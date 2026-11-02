export interface ShelfLocation {
  floor: number;
  wing: string;
  rack: string;
  shelfNumber: string;
  callNumber: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publishedYear: number;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: ShelfLocation;
  coverGradient: string;
  description: string;
  publisher: string;
  tags: string[];
}

export type LoanStatus = 'ACTIVE' | 'DUE_SOON' | 'OVERDUE' | 'RETURNED';

export interface Loan {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookIsbn: string;
  studentId: string;
  studentName: string;
  studentUsn: string;
  studentLibraryId: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string;   // YYYY-MM-DD
  returnDate?: string;
  status: LoanStatus;
  daysRemaining: number;
  fineAmount: number;
  finePaid: boolean;
}

export type ReservationStatus = 'WAITING' | 'READY_FOR_PICKUP' | 'EXPIRED' | 'FULFILLED';

export interface Reservation {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  studentId: string;
  studentName: string;
  studentUsn: string;
  reservedAt: string;
  status: ReservationStatus;
  queuePosition: number;
  pickupDeadline?: string;
}

export interface StudentUser {
  id: string;
  name: string;
  usn: string;
  libraryId: string;
  email: string;
  department: string;
  semester: number;
  maxBorrowLimit: number;
  avatarColor: string;
}

export interface LibrarianUser {
  id: string;
  name: string;
  staffId: string;
  email: string;
  desk: string;
  shift: string;
}

export interface AdminUser {
  id: string;
  name: string;
  adminId: string;
  email: string;
  roleTitle: string;
}

export type UserRole = 'STUDENT' | 'LIBRARIAN' | 'ADMIN';

export interface AuthSession {
  role: UserRole;
  user: StudentUser | LibrarianUser | AdminUser;
}

export interface LibraryNotification {
  id: string;
  studentId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  date: string;
  read: boolean;
}

export interface LibraryFloorLocation {
  id: string;
  floor: number;
  wing: string;
  rackPrefix: string;
  totalRacks: number;
  capacityBooks: number;
  categoryFocus: string;
}
