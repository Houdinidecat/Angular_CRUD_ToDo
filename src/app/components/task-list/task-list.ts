import { Component, input, output } from '@angular/core';
import { TaskItem } from '../../models/task';
import { Task } from '../task/task';

@Component({
  imports: [Task],
  selector: 'app-task-list',
  styleUrl: './task-list.css',
  templateUrl: './task-list.html',
})
export class TaskList {
  readonly tasks = input<TaskItem[]>([]);
  readonly editingId = input<number | null>(null);
  readonly edit = output<TaskItem>();
  readonly remove = output<number>();
}
