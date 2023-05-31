import { Component, OnInit } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { WebSocketService } from 'src/app/web-socket.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  todos: string[] = [];
  newTodo: string = '';
  isConnected: boolean = false;

  constructor(private webSocketService: WebSocketService) {
    this.todos = this.webSocketService.getTodoArr();
  }

  ngOnInit() {
    this.webSocketService.socket$ = webSocket('ws://localhost:8080');
    this.webSocketService.socket$.subscribe(
      (message) => {
        this.isConnected = true;
        var arrTodo: string [] = [];
        message.forEach((element:any) => {
          arrTodo.push(element.replace("\"", "").replace("\"", ""))
        });
        console.log(arrTodo);
        this.todos = arrTodo;
      },
      (error) => console.error('WebSocket error:', error),
      () => {
        this.isConnected = false;
        console.log('WebSocket connection closed');
      }
    );
  }

  addTodo() {
    if (this.newTodo.trim() !== '') {
      this.webSocketService.send(this.newTodo);
      this.newTodo = '';
    }
  }

  deleteTodo(item: string){
    if (item.trim() !== '') {
      this.webSocketService.send('delete!*(@h9890138ch1908' + item);
    }
  }

  resetList(){
    this.webSocketService.send('reset!*(@h9890138ch1908');
  }

  connectWebSocket() {
    this.webSocketService.socket$ = webSocket('ws://localhost:8080');
    this.webSocketService.socket$.subscribe(
      (message) => {
        this.isConnected = true;
        var arrTodo: string [] = [];
        message.forEach((element:any) => {
          arrTodo.push(element.replace("\"", "").replace("\"", ""))
        });
        console.log(arrTodo);
        this.todos = arrTodo;
      },
      (error) => console.error('WebSocket error:', error),
      () => {
        this.isConnected = false;
        console.log('WebSocket connection closed');
      }
    );
  }

  disconnectWebSocket() {
    this.webSocketService.disconnect();
  }

  isWebSocketConnected(): boolean {
    return this.webSocketService.isConnected();
  }

  refresh(){
    this.todos = this.webSocketService.getTodoArr();
  }
}
