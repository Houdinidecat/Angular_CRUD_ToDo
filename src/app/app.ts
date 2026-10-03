import { Component, inject, signal } from '@angular/core';
import { Navigation } from './components/navigation/navigation';
import { TaskForm } from './components/task-form/task-form';
import { TaskList } from './components/task-list/task-list';
import { TaskItem } from './models/task';
import { Task as TaskService } from './services/task';

@Component({
  imports: [Navigation, TaskForm, TaskList],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  readonly taskService = inject(TaskService);
  readonly selectedTask = signal<TaskItem | null>(null);
  readonly message = signal('');

  saveTask(title: string): void {
    const selected = this.selectedTask();
    if (selected) {
      if (!this.taskService.update(selected.id, title)) return;
      this.message.set('Cambios guardados. La tarea se actualizó.');
    } else {
      if (!this.taskService.add(title)) return;
      this.message.set('Tarea creada. Ya aparece en tu lista.');
    }
    this.selectedTask.set(null);
  }

  editTask(task: TaskItem): void {
    this.selectedTask.set(task);
    this.message.set('Edita el nombre y guarda tus cambios.');
  }

  cancelEdit(): void {
    this.selectedTask.set(null);
    this.message.set('Edición cancelada. La tarea conserva su nombre.');
  }

  deleteTask(id: number): void {
    if (!this.taskService.remove(id)) return;
    if (this.selectedTask()?.id === id) this.selectedTask.set(null);
    this.message.set('Tarea eliminada de la lista.');
  }
}
