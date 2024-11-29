import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Book } from '../../models/book';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './book-form.component.html',
})
export class BookFormComponent {
  bookForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<BookFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Book
  ) {
    this.bookForm = this.fb.group({
      id: [data.id],
      title: [data.title || '', Validators.required],
      author: [data.author || '', Validators.required],
      price: [data.price || '', [Validators.required, Validators.min(0)]],
    });
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      const result = this.dialogRef.close(this.bookForm.value);
      const isSuccess = result !== undefined;
      if (isSuccess) {
        this.snackBar.open('Book saved successfully!', 'Close', {
          duration: 3000,
        });
        this.dialogRef.close(this.bookForm.value); // Pass form data back to parent
      } else {
        this.snackBar.open(
          'Failed to save the book. Please try again.',
          'Close',
          {
            duration: 3000,
          }
        );
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
