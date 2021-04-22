import { Component, Input, OnInit } from '@angular/core';

import { Variable, VariableType } from '../variable';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { VariableService } from '../variable.service';

@Component({
  selector: 'app-variables',
  templateUrl: './variables.component.html',
  styleUrls: ['./variables.component.css']
})
export class VariablesComponent implements OnInit {
  @Input() advancedInterface;
  variableType = VariableType;
  variableSubscription;
  variables: Variable[];
  levels = [{
      level: 0,
      name: 'Top Level Scope'
    }
  ];

  constructor(private variableService: VariableService) {}

  /**
   * Angular lifecycle hook called when the component is initialized
   */
  ngOnInit(): void {
    this.variables = this.variableService.variables;
    this.variableSubscription = this.variableService.variablesChange.subscribe((variables) => {
      this.variables = variables;
    });
  }

  /**
   * Angular lifecycle hook called before the component is destroyed
   */
  ngDestroy(): void {
    this.variableSubscription.unsubscribe();
  }

  /**
   * Called when adding a new variable
   */
  onAdd(): void {
    this.variableService.addVariable();
  }

  /**
   * Remove a variable at an index
   * @param i - index to remove
   */
  onRemove(i: number): void {
    this.variableService.remove(i);
  }

  /**
   * Drag and drop rearrange of variable order
   * @param event - drag and drop event
   */
  drop(event: CdkDragDrop<Variable[]>): void {
    moveItemInArray(this.variables, event.previousIndex, event.currentIndex);
  }

  /**
   * Get the labels of available variables at the current index
   * @param index - Index of variable we're editing
   */
  getAvailableVariables(index: number): Array<string> {
    const uneditableVariables = this.variableService.uneditableVariables.map((e) => e.name);
    // Only return variables up to but not including index
    const editableVariables = this.variables.map((e) => e.label).slice(0, index);

    return uneditableVariables.concat(editableVariables);
  }
}