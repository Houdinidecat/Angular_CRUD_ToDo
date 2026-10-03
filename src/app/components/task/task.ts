import { Component, input, output } from '@angular/core';
import { TaskItem } from '../../models/task';

@Component({
  imports: [],
  selector: 'app-task',
  styleUrl: './task.css',
  templateUrl: './task.html',
})
export class Task {
  readonly task = input.required<TaskItem>();
  readonly editing = input(false);
  readonly edit = output<TaskItem>();
  readonly remove = output<number>();
}
