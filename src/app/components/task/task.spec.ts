import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskItem } from '../../models/task';
import { Task } from './task';

describe('Task row', () => {
  let fixture: ComponentFixture<Task>;
  const task: TaskItem = { id: 7, title: 'Preparar presentación' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Task] }).compileComponents();
    fixture = TestBed.createComponent(Task);
    fixture.componentRef.setInput('task', task);
    await fixture.whenStable();
  });

  it('displays the task and identifies its action buttons accessibly', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain(task.title);
    expect(
      element.querySelector('[aria-label="Editar tarea: Preparar presentación"]'),
    ).not.toBeNull();
    expect(
      element.querySelector('[aria-label="Eliminar tarea: Preparar presentación"]'),
    ).not.toBeNull();
  });

  it('emits the selected task for editing and its ID for deletion', () => {
    const edited: TaskItem[] = [];
    const removed: number[] = [];
    fixture.componentInstance.edit.subscribe((value) => edited.push(value));
    fixture.componentInstance.remove.subscribe((value) => removed.push(value));
    const element = fixture.nativeElement as HTMLElement;

    element
      .querySelector<HTMLButtonElement>('[aria-label="Editar tarea: Preparar presentación"]')!
      .click();
    element
      .querySelector<HTMLButtonElement>('[aria-label="Eliminar tarea: Preparar presentación"]')!
      .click();

    expect(edited).toEqual([task]);
    expect(removed).toEqual([task.id]);
  });
});
