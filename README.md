# Real-time To-Do List App with Angular and Custom WebSocket Server
This is a guide on how to build a real-time To-Do List application using Angular for the front-end and a custom WebSocket server for real-time communication. You can use this concept implement functionality accourding to your need, I'm using to-do app as an example. The application allows multiple users to collaborate and see updates to the to-do list in real-time.

## Prerequisites
To follow along with this guide, make sure you have the following:

+ Node.js installed on your machine
+ Angular CLI installed globally ( **npm install -g @angular/cli** )

## Step 1: Set up the Angular Project
1. Create a new Angular project by running the following command in your terminal:
```
ng new todo-list-app
```
2. Change into the project directory:
```
cd todo-list-app
```
Step 2: Create the To-Do List Component
1. Generate a new component called **TodoListComponent** by running the following command:
```
ng generate component todo-list
```
2. Open the **todo-list.component.ts** file and update it with the following code:
```
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
    this.webSocketService.socket$ = webSocket('ws://localhost:8080'); // Establish WebSocket connection

    // Subscribe to the incoming messages from the WebSocket server
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
      this.webSocketService.send(this.newTodo); // Send new to-do item to the server
      this.newTodo = '';
    }
  }

  resetList() {
    this.webSocketService.send('reset!*(@h9890138ch1908'); // Send a special message to reset the to-do list
  }

  connectWebSocket() {
    // Establish WebSocket connection
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
    this.webSocketService.disconnect(); // Close WebSocket connection
  }

  isWebSocketConnected(): boolean {
    return this.webSocketService.isConnected(); // Check if WebSocket connection is established
  }

  refresh() {
    this.todos = this.webSocketService.getTodoArr(); // Update the to-do list by retrieving it from the WebSocket service
  }
}
```
Here's a breakdown of the code:

* The **TodoListComponent** class represents the component responsible for displaying and managing the to-do list.
* The **todos** property holds the array of to-do items.
* The **newTodo** property stores the value of the new to-do item input field.
* The **isConnected** property indicates whether the WebSocket connection is established.
* The **constructor** injects an instance of the WebSocketService to communicate with the WebSocket server.
* The **ngOnInit** lifecycle hook is called when the component is initialized. It establishes a WebSocket connection and subscribes to incoming messages.
* The **addTodo** method is triggered when the user clicks the "Add" button. It sends the new to-do item to the server.
* The **resetList** method is triggered when the user clicks the "Reset" button. It sends a special message to the server to reset the to-do list.
* The **connectWebSocket** method is triggered when the user clicks the "Connect" button. It establishes a WebSocket connection.
* The **disconnectWebSocket** method is triggered when the user clicks the "Disconnect" button. It closes the WebSocket connection.
* The **isWebSocketConnected** method returns the status of the WebSocket connection.
* The **refresh** method updates the to-do list by retrieving it from the WebSocket service.

## Step 3: Create the WebSocket Service
1. Generate a new service called **WebSocketService** by running the following command:
```
ng generate service web-socket
```
2. Open the **web-socket.service.ts** file and update it with the following code:
```
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  public socket$!: WebSocketSubject<any>;
  private todoArr: string[] = [];

  constructor() {
  }

  connect() {
    this.socket$ = webSocket('ws://localhost:8080'); // Replace with your WebSocket server URL
  }

  disconnect() {
    this.socket$.complete();
  }

  isConnected(): boolean {
    return (this.socket$ === null ? false : !this.socket$.closed);
  }

  onMessage(): Observable<any> {
    return this.socket$!.asObservable().pipe(
      map(message => message)
    );
  }

  send(message: any) {
    this.socket$.next(message);
  }

  getTodoArr(): string[] {
    return this.todoArr;
  }
}
```

Here's a breakdown of the code:

* The **WebSocketService** class provides methods to establish, manage, and interact with the WebSocket connection.
* The **socket$** property represents the WebSocket subject.
* The **todoArr** property holds the array of to-do items received from the server.
* The **connect** method establishes a WebSocket connection to the specified URL.
* The **disconnect** method closes the WebSocket connection.
* The **isConnected** method checks if the WebSocket connection is established.
* The **onMessage** method returns an observable that emits incoming messages from the WebSocket server.
* The **send** method sends a message to the WebSocket server.
* The **getTodoArr** method returns the array of to-do items.

## Step 4: Create the HTML Template
1. Open the **todo-list.component.html** file and update it with the following code:
```
<h1>Real-time To-Do List</h1>

<ul>
  <li *ngFor="let todo of todos">{{ todo }}</li>
</ul>

<input [(ngModel)]="newTodo" placeholder="Add a new todo">
<button (click)="addTodo()">Add</button>

<button (click)="connectWebSocket()" [disabled]="isConnected">Connect</button>
<button (click)="disconnectWebSocket()" [disabled]="!isConnected">Disconnect</button>
<button (click)="resetList()">Reset</button>
```

## Step 5: Create the Custom WebSocket Server
1. Create a new file called **websocket-server.js** in the root directory of your project and update it with the following code:
```
const WebSocket = require('ws');

const port = 8080; // Set the desired port

const wss = new WebSocket.Server({ port });

// Shared state of the to-do list
let todos = [];

wss.on('listening', () => {
  console.log(`WebSocket server is listening on port ${port}`);
});

wss.on('connection', ws => {
  // Send the current to-do list to the newly connected client
  ws.send(JSON.stringify(todos));

  ws.on('message', message => {
    const receivedMessage = message.toString(); // Convert the message to a string
    console.log(receivedMessage);
    if (receivedMessage === '\"reset!*(@h9890138ch1908\"') {
      // Reset the to-do list
      todos = [];
    } else {
      // Add the new to-do item to the shared state
      todos.push(receivedMessage);
    }

    // Broadcast the updated to-do list to all connected clients
    wss.clients.forEach(client => {
      client.send(JSON.stringify(todos));
    });
  });
});
```
Here's a breakdown of the code:

* The **WebSocket** module is imported to create a WebSocket server.
* The **port** variable specifies the desired port number for the WebSocket server.
* The **wss** variable creates a WebSocket server instance on the specified port.
* The **todos** array represents the shared state of the to-do list.
* The **listening** event is triggered when the WebSocket server starts listening on the specified port.
* The **connection** event is triggered when a new client connects to the WebSocket server.
* When a client connects, the current to-do list is sent to the client.
* The **message** event is triggered when a message is received from a client.
* The received message is converted to a string.
* If the message is a special reset message, the to-do list is cleared.
* Otherwise, the new to-do item is added to the shared state.
* The updated to-do list is broadcasted to all connected clients.

## Step 6: Run the Application
1. Open a new terminal window and navigate to the root directory of your project.
2. Start the custom WebSocket server by running the following command:
```
node websocket-server.js
```
You should see the message "WebSocket server is listening on port 8080" in the console.

3. Open another terminal window and navigate to the root directory of your project.
4. Start the Angular development server by running the following command:
```
ng serve
```
5. Open your web browser and navigate to **http://localhost:4200** to see the real-time To-Do List application in action.

That's it! You have successfully built a real-time To-Do List application using Angular and a custom WebSocket server. Users can collaborate and see updates to the to-do list in real-time.

# Deployment

## Prerequisites

+ [GitHub](https://github.com/) account.
+ [Vercel](https://vercel.com/) account.
+ [Glitch](https://glitch.com/) account.

## First we will host a **WebSocket** server on [Glitch](https://glitch.com/).
  1. LogIn to your [Glitch](https://glitch.com/) account and navigate to dashboard.
  2. Click "New Project" and select "**glitch-hello-node**" template.
  3. In your Glitch project files open **server.js** file and replace all the code with **websocket-server.js** that we have created earlier.
  4. Glitch will build and deploy your code automatically.

## Next we will host our Angular application on [Vercel](https://vercel.com/) account.
  1. Replace "ws://localhost:8080" in your project with "wss://{your-glitch-project-name}.glitch.me/".
  2. Upload your entire project in your github repository.
  3. Navigate to [Vercel](https://vercel.com/) and use SignIn with GitHub option.
  4. On Vercel dashboard select "Add New Project" option and import the repository that you created for this project.
  5. After that in configuration window, keep everyhing as default and click on **Deploy** button. Vercel will automatically build and deploy your project with multiple environments.
