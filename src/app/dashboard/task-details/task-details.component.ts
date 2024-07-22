import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from 'src/app/Model/task';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent {
  @Input() currentTask: Task | null = null
  // Event Emitter to toggle the visibility of the Task Details Component
  @Output()
  CloseTask: EventEmitter<boolean> = new EventEmitter<boolean>();
  onCloseTask(){
    this.CloseTask.emit(false);
  }
}
