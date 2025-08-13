import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  imports: [ReactiveFormsModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  submitting = signal(false);
  submitted = signal(false);
  errorMsg = signal('');

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
    message: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5000)]],
    website: [''] //honeypot
  });

  get controls() { return this.form.controls; }

  async onSubmit() {
    this.errorMsg.set('');
    this.submitted.set(false);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Honeypot trip: silently succeed but drop the payload
    if (this.form.value.website?.trim()) {
      this.submitted.set(true);
      this.form.reset();
      return;
    }

    this.submitting.set(true);

    const formData = new FormData();
    formData.append('Name', this.form.value.name ?? '');
    formData.append('Email', this.form.value.email ?? '');
    formData.append('Message', this.form.value.message ?? '');

    this.http
      .post('https://www.goodsheet.io/f/0a0c53f0-4305-4dd1-ade4-b9a3301f9ef8', formData, { responseType: 'text' })
      .pipe(
        finalize(() => this.submitting.set(false)) // runs after success or error
      )
      .subscribe({
        next: () => {
          this.submitted.set(true);
          this.form.reset();
        },
        error: (err) => {
          console.error(err);
          this.errorMsg.set('Sorry, something went wrong. Please try again.');
        }
      });
  }
}
