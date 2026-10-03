import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { Task } from './services/task';

describe('App CRUD flow', () => {
  let fixture: ComponentFixture<App>;
  let element: HTMLElement;
  let service: Task;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();
    fixture = TestBed.createComponent(App);
    element = fixture.nativeElement as HTMLElement;
    service = TestBed.inject(Task);
    await fixture.whenStable();
  });

  async function enterTitle(title: string): Promise<void> {
    const input = element.querySelector<HTMLInputElement>('form input')!;
    input.value = title;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
  }

  async function submitForm(): Promise<void> {
    element
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
  }

  async function clickButton(text: string): Promise<void> {
    const button = Array.from(element.querySelectorAll<HTMLButtonElement>('button')).find(
      (candidate) => candidate.textContent?.trim() === text,
    );
    expect(button, `Expected a button labeled ${text}`).toBeDefined();
    button!.click();
    await fixture.whenStable();
  }

  it('shows a Spanish heading, labeled form, and empty state', () => {
    expect(element.querySelector('h1')?.textContent).toContain('Gestor de tareas');
    expect(element.querySelector('label')?.textContent).toContain('Nombre de la tarea');
    expect(element.querySelector('h3')?.textContent).toContain('Tu lista está vacía');
  });

  it('creates, displays, edits, and deletes a task through the UI', async () => {
    await enterTitle('Preparar presentación de Angular');
    await submitForm();
    const originalId = service.tasks()[0].id;

    expect(element.querySelectorAll('app-task')).toHaveLength(1);
    expect(element.querySelector('app-task')?.textContent).toContain(
      'Preparar presentación de Angular',
    );
    expect(element.textContent).not.toContain('Tu lista está vacía');

    await clickButton('Editar');
    expect(element.querySelector<HTMLInputElement>('form input')?.value).toBe(
      'Preparar presentación de Angular',
    );
    await enterTitle('Preparar presentación de Angular CRUD');
    await clickButton('Guardar cambios');

    expect(service.tasks()).toEqual([
      { id: originalId, title: 'Preparar presentación de Angular CRUD' },
    ]);
    expect(element.querySelectorAll('app-task')).toHaveLength(1);
    expect(element.querySelector('app-task')?.textContent).toContain(
      'Preparar presentación de Angular CRUD',
    );

    await clickButton('Eliminar');
    expect(service.tasks()).toEqual([]);
    expect(element.querySelectorAll('app-task')).toHaveLength(0);
    expect(element.querySelector('h3')?.textContent).toContain('Tu lista está vacía');
  });

  it('cancels editing without changing the existing title', async () => {
    await enterTitle('Conservar título');
    await submitForm();
    await clickButton('Editar');
    await enterTitle('Cambio sin guardar');
    await clickButton('Cancelar');

    expect(service.tasks()[0].title).toBe('Conservar título');
    expect(element.querySelector('app-task')?.textContent).toContain('Conservar título');
    expect(element.querySelector<HTMLInputElement>('form input')?.value).toBe('');
    expect(element.textContent).toContain('Agregar tarea');
  });

  it('does not create a task with an invalid title', async () => {
    for (const title of ['   ', 'a'.repeat(121)]) {
      await enterTitle(title);
      await submitForm();
      expect(service.tasks()).toEqual([]);
      expect(element.querySelectorAll('app-task')).toHaveLength(0);
    }
  });
});
