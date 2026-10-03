import { TestBed } from '@angular/core/testing';
import { Task } from './task';

describe('Task service', () => {
  let service: Task;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Task);
  });

  it('creates, reads, updates, and deletes a task while preserving its identity', () => {
    expect(service.tasks()).toEqual([]);

    const created = service.add('  Preparar presentación de Angular  ');
    expect(created).not.toBeNull();
    expect(created?.title).toBe('Preparar presentación de Angular');
    expect(service.tasks()).toEqual([created]);

    expect(service.update(created!.id, '  Preparar presentación de Angular CRUD  ')).toBe(true);
    expect(service.tasks()).toEqual([
      { id: created!.id, title: 'Preparar presentación de Angular CRUD' },
    ]);

    expect(service.remove(created!.id)).toBe(true);
    expect(service.tasks()).toEqual([]);
  });

  it('rejects empty, whitespace-only, and overly long titles without changing existing tasks', () => {
    const created = service.add('Tarea válida')!;

    for (const title of ['', '   ', 'a'.repeat(121)]) {
      expect(service.add(title)).toBeNull();
      expect(service.update(created.id, title)).toBe(false);
      expect(service.tasks()).toEqual([created]);
    }

    expect(service.add('a'.repeat(120))?.title).toHaveLength(120);
  });

  it('uses unique increasing IDs even after deleting a task', () => {
    const first = service.add('Primera')!;
    const second = service.add('Segunda')!;
    service.remove(second.id);
    const third = service.add('Tercera')!;

    expect(second.id).toBeGreaterThan(first.id);
    expect(third.id).toBeGreaterThan(second.id);
    expect(service.tasks().map((task) => task.id)).toEqual([first.id, third.id]);
  });

  it('leaves other tasks intact when an ID does not exist', () => {
    const created = service.add('Conservar tarea')!;

    expect(service.update(created.id + 100, 'No existe')).toBe(false);
    expect(service.remove(created.id + 100)).toBe(false);
    expect(service.tasks()).toEqual([created]);
  });
});
