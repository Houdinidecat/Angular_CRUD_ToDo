import { Service, signal } from '@angular/core';
import { MAX_TASK_TITLE_LENGTH, TaskItem } from '../models/task';

@Service()
export class Task {
  private readonly items = signal<TaskItem[]>([]);
  private nextId = 1;
  readonly tasks = this.items.asReadonly();

  add(title: string): TaskItem | null {
    const normalized = title.trim();
    if (!normalized || normalized.length > MAX_TASK_TITLE_LENGTH) return null;
    const task = { id: this.nextId++, title: normalized };
    this.items.update((items) => [...items, task]);
    return task;
  }

  update(id: number, title: string): boolean {
    const normalized = title.trim();
    if (
      !normalized ||
      normalized.length > MAX_TASK_TITLE_LENGTH ||
      !this.items().some((task) => task.id === id)
    )
      return false;
    this.items.update((items) =>
      items.map((task) => (task.id === id ? { ...task, title: normalized } : task)),
    );
    return true;
  }

  remove(id: number): boolean {
    if (!this.items().some((task) => task.id === id)) return false;
    this.items.update((items) => items.filter((task) => task.id !== id));
    return true;
  }
}
