import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';
import { BookFormComponent } from '../book-form/book-form.component';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './book-list.component.html',
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  isLoading = false;
  displayedColumns: string[] = ['title', 'author', 'price', 'actions'];
  totalBooks: number = 0;
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 25];
  currentPage: number = 1;

  constructor(
    private bookService: BookService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.isLoading = true;
    this.bookService.getBooks(this.currentPage, this.pageSize).subscribe(
      (response) => {
        this.books = response.books;
        this.totalBooks = response.totalCount;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching books:', error);
        this.dissplayMsg('Internal server error.');
        this.isLoading = false;
      }
    );
  }

  openBookForm(book?: Book): void {
    const dialogRef = this.dialog.open(BookFormComponent, {
      width: '400px',
      data: book || {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.id) {
          this.isLoading = true;
          this.bookService.updateBook(result.id, result).subscribe(
            () => {
              this.dissplayMsg('Book updated successfully.');
              this.isLoading = false;
              this.loadBooks();
            },
            (error) => {
              console.error('Error updating book:', error);
              this.dissplayMsg('Error updating book.');
              this.isLoading = false;
            }
          );
        } else {
          this.bookService.addBook(result).subscribe(
            () => {
              this.isLoading = false;
              this.dissplayMsg('Book added successfully.');
              this.loadBooks();
            },
            (error) => {
              console.error('Error adding book:', error);
              this.dissplayMsg('Unable to add the book.');
              this.isLoading = false;
            }
          );
        }
      }
    });
  }

  deleteBook(id: string): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(id).subscribe(
        () => {
          this.loadBooks();
          this.dissplayMsg('Book deleted successfully.');
        },
        (error) => {
          console.error('Error deleting book:', error);
          this.dissplayMsg('Unable to delete the book.');
        }
      );
    }
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadBooks();
  }

  dissplayMsg(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
