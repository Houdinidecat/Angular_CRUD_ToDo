import { Component, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAX_TASK_TITLE_LENGTH, TaskItem } from '../../models/task';

@Component({
  imports: [FormsModule],
  selector: 'app-task-form',
  styleUrl: './task-form.css',
  templateUrl: './task-form.html',
})
export class TaskForm {
  readonly task = input<TaskItem | null>(null);
  readonly saved = output<string>();
  readonly cancelled = output<void>();
  readonly title = signal('');
  readonly error = signal('');
  readonly maxLength = MAX_TASK_TITLE_LENGTH;

  constructor() {
    effect(() => {
      this.title.set(this.task()?.title ?? '');
      this.error.set('');
    });
  }

  submit(): void {
    const normalized = this.title().trim();
    if (!normalized) {
      this.error.set('Escribe un nombre para la tarea.');
      return;
    }
    if (normalized.length > this.maxLength) {
      this.error.set(`Usa como máximo ${this.maxLength} caracteres.`);
      return;
    }
    this.saved.emit(normalized);
    this.title.set('');
    this.error.set('');
  }
}
