import { TestBed } from '@angular/core/testing';

import { TodosService } from './todos.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { FilterEnum } from '../types/filter.enum';
import { TodoInterface } from '../types/todo.interface';

describe('TodosService', () => {
  let todosService: TodosService;
  let httpTestingController: HttpTestingController;
  const baseUrl = 'http://localhost:3004/todos';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodosService],
    });
    todosService = TestBed.inject(TodosService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(todosService).toBeTruthy();
  });

  it('sets initial data', () => {
    expect(todosService.apiBaseUrl).toEqual(baseUrl);
    expect(todosService.todosSig()).toEqual([]);
    expect(todosService.filterSig()).toEqual(FilterEnum.all);
  });

  describe('changeFilter', () => {
    it('changes the filter', () => {
      todosService.changeFilter(FilterEnum.active);
      expect(todosService.filterSig()).toEqual(FilterEnum.active);
    });
  });

  describe('getTodos', () => {
    it('should return a list of todos', () => {
      todosService.getTodos();
      const req = httpTestingController.expectOne(baseUrl);
      req.flush([{ text: 'foo', isCompleted: true, id: '1' }]);
      expect(todosService.todosSig()).toEqual([
        { text: 'foo', isCompleted: true, id: '1' },
      ]);
      expect(req.request.method).toEqual('GET');
    });
  });

  describe('addTodo', () => {
    it('add an element to a todos list', () => {
      todosService.addTodo('foo');
      const req = httpTestingController.expectOne(baseUrl);
      req.flush({ text: 'foo', isCompleted: true, id: '1' });
      expect(todosService.todosSig()).toEqual([
        { text: 'foo', isCompleted: true, id: '1' },
      ]);
      expect(req.request.method).toEqual('POST');
    });
  });

  describe('changeTodo', () => {
    it('modify an element of todos list', () => {
      todosService.todosSig.set([{ text: 'foo', isCompleted: true, id: '1' }]);
      todosService.changeTodo('1', 'bar');
      const req = httpTestingController.expectOne(`${baseUrl}/1`);
      req.flush({ text: 'bar', isCompleted: true, id: '1' });
      expect(todosService.todosSig()).toEqual([
        { text: 'bar', isCompleted: true, id: '1' },
      ]);
      expect(req.request.method).toEqual('PATCH');
    });
  });

  describe('removeTodo', () => {
    it('remove an element of todos list', () => {
      todosService.todosSig.set([{ text: 'foo', isCompleted: true, id: '1' }]);
      todosService.removeTodo('1');
      const req = httpTestingController.expectOne(`${baseUrl}/1`);
      req.flush({});
      expect(todosService.todosSig()).toEqual([]);
      expect(req.request.method).toEqual('DELETE');
    });
  });

  describe('toggleTodo', () => {
    it('toggle an element of todos list', () => {
      todosService.todosSig.set([{ text: 'foo', isCompleted: false, id: '1' }]);
      todosService.toggleTodo('1');
      const req = httpTestingController.expectOne(`${baseUrl}/1`);
      req.flush({ text: 'foo', isCompleted: true, id: '1' });
      expect(todosService.todosSig()).toEqual([
        { text: 'foo', isCompleted: true, id: '1' },
      ]);
      expect(req.request.method).toEqual('PATCH');
    });
  });

  describe('toggleAll', () => {
    it('toggle all elements of todos list', () => {
      todosService.todosSig.set([
        { text: 'foo', isCompleted: false, id: '1' },
        { text: 'bar', isCompleted: false, id: '2' },
      ]);
      todosService.toggleAll(true);
      // const req = httpTestingController.expectOne(`${baseUrl}`);
      const reqs = httpTestingController.match((request) => {
        return request.url.includes(baseUrl);
      });
      reqs[0].flush([{ text: 'foo', isCompleted: true, id: '1' }]);
      reqs[1].flush([{ text: 'bar', isCompleted: true, id: '2' }]);

      expect(todosService.todosSig()).toEqual([
        { text: 'foo', isCompleted: true, id: '1' },
        { text: 'bar', isCompleted: true, id: '2' },
      ]);
      expect(reqs[0].request.method).toEqual('PATCH');
      expect(reqs[1].request.method).toEqual('PATCH');
    });
  });
});
