import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  private fb = inject(FormBuilder);

  submitting = false;
  submitted = false;
  errorMsg = '';

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]],
    // Honeypot — real users won't fill this; bots often will.
    website: [''] // leave blank; hidden via CSS
  });

  async onSubmit() {
    this.errorMsg = '';
    this.submitted = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Honeypot trip: silently succeed but drop the payload
    if (this.form.value.website?.trim()) {
      this.submitted = true;
      this.form.reset();
      return;
    }

    this.submitting = true;
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: this.form.value.name,
          email: this.form.value.email,
          message: this.form.value.message
        })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.submitted = true;
      this.form.reset();
    } catch (err: any) {
      this.errorMsg = 'Sorry, something went wrong. Please try again.';
      console.error(err);
    } finally {
      this.submitting = false;
    }
  }

  get f() { return this.form.controls; }
}
