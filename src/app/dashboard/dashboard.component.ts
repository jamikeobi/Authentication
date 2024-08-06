import { Component, inject, OnInit } from '@angular/core';
import { Task } from '../Model/task';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TaskService } from '../Services/task.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  showCreateTaskForm: boolean = false;
  showTaskDetails: boolean = false;
  http: HttpClient = inject(HttpClient)
  allTasks: Task[] = [];
  taskService: TaskService = inject(TaskService);
  currentTaskId: string | undefined;
  isLoading: boolean = false;

  currentTask: Task | null = null;

  errorInfo: string | null = null;

  editMode: boolean = false;
  selectedTask!: Task;

  errorSub!: Subscription

  ngOnInit(){
    this.fetchAllTasks();
    this.errorSub = this.taskService.errorSubject.subscribe({next: (httpError) => {
      this.setErrorMessage(httpError);
    }})
  }

  ngOnDestroy(){
    this.errorSub.unsubscribe();
  }

  OpenCreateTaskForm(){
    this.showCreateTaskForm = true;
    this.editMode = false;
    this.selectedTask = {title: '', desc: '', assignedTo: '', createdAt: '', priority: '', status: ''}
  }

   // Show Current Task Details
   showCurrentTaskDetails(id: string | undefined){
    this.showTaskDetails = true;
    this.taskService.getTaskDetails(id).subscribe({
      next: (data: Task) => {
        this.currentTask = data;
      }});
  }

  CloseTaskDetails(){
    this.showTaskDetails = false;
  }

  CloseCreateTaskForm(){
    this.showCreateTaskForm = false;
  }

  CreateOrUpdateTask(data: Task){
    if(!this.editMode)
      this.taskService.CreateTask(data);
    else
      this.taskService.UpdateTask(this.currentTaskId, data);
  }

  /*{
    key1: {},
    key2: {}
  }*/

  FetchAllTaskClicked(){
    this.fetchAllTasks()
  }

  private fetchAllTasks(){
    this.isLoading = true;
    this.taskService.GetAlltasks().subscribe({next: (tasks) => {
      this.allTasks = tasks;
      this.isLoading = false;
    }, error: (error) => {
      this.setErrorMessage(error);
      this.isLoading = false;
    }})
  }

  private setErrorMessage(err: HttpErrorResponse){
    if(err.error.error === 'Permission denied'){
      this.errorInfo = 'You do not have permisssion to perform this action';
    }
    else{
      this.errorInfo = err.message;
    }

    setTimeout(() => {
      this.errorInfo = null;
    }, 3000);
  }

  DeleteTask(id: string | undefined){
    this.taskService.DeleteTask(id);
  }

  DeleteAllTask(){
    this.taskService.DeleteAllTasks();
  }

  onEditTaskClicked(id: string | undefined) {
    this.currentTaskId = id;
    this.showCreateTaskForm = true;
    this.editMode = true;

    const task = this.allTasks.find((task) => task.id === id);
    if (task) {
      this.selectedTask = task;
    } else {
      // Handle the case where the task is not found
      // For example, you can set this.selectedTask to a default value or show an error message
      this.selectedTask = {
        title: '',
        desc: '',
        assignedTo: '',
        createdAt: '',
        priority: '',
        status: '',
        id: ''
      }; // or handle appropriately
    }
 
  }
}
