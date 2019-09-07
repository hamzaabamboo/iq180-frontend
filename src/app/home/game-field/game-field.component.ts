import { Component, OnInit } from '@angular/core';
import {
  OperatorCard,
  DraggableCard,
  NumberCard,
  CardType
} from 'src/app/core/models/game/card.model';
import { BehaviorSubject, combineLatest } from 'rxjs';
import {
  transferArrayItem,
  moveItemInArray,
  CdkDragDrop
} from '@angular/cdk/drag-drop';
import { arraysEqual } from 'ng-zorro-antd';

@Component({
  selector: 'app-game-field',
  templateUrl: './game-field.component.html',
  styleUrls: ['./game-field.component.scss']
})
export class GameFieldComponent implements OnInit {
  numbers$ = new BehaviorSubject<NumberCard[]>(
    [
      { value: 1, display: '1', disabled: false },
      { value: 2, display: '2', disabled: false },
      { value: 3, display: '3', disabled: false },
      { value: 4, display: '4', disabled: false },
      { value: 5, display: '5', disabled: false }
    ].map(e => ({ ...e, type: CardType.number }))
  );
  answer$ = new BehaviorSubject<DraggableCard[]>([]);
  operators: OperatorCard[] = [
    { operator: '+', display: '+', disabled: false },
    { operator: '-', display: '-', disabled: false },
    { operator: 'x', display: 'x', disabled: false },
    { operator: '÷', display: '÷', disabled: false }
  ].map(e => ({ ...e, type: CardType.operator }));
  constructor() {}

  ngOnInit() {}

  dropAnswer(event: CdkDragDrop<DraggableCard[]>) {
    if (event.previousContainer === event.container) {
      const arr = this.answer$.getValue();
      moveItemInArray(arr, event.previousIndex, event.currentIndex);
      this.answer$.next(arr);
    } else {
      const card = event.previousContainer.data[event.previousIndex];
      if (card.type === CardType.number) {
        this.addNumber(card as any, event.previousIndex, event.currentIndex);
      } else if (card.type === CardType.operator) {
        this.addOperator(card as any, event.currentIndex);
      }
    }
  }

  dropNumber(event: CdkDragDrop<DraggableCard[]>) {
    if (event.previousContainer === event.container) {
      const arr = this.numbers$.getValue();
      moveItemInArray(arr, event.previousIndex, event.currentIndex);
      this.numbers$.next(arr);
    } else {
      const card = event.previousContainer.data[event.previousIndex];
      if (card.type === CardType.number) {
        this.removeNumber(event.previousIndex, event.currentIndex);
      }
    }
  }

  dropOperator(event: CdkDragDrop<DraggableCard[]>) {
    if (event.previousContainer === event.container) {
      const arr = this.operators;
      moveItemInArray(arr, event.previousIndex, event.currentIndex);
    } else {
      const card = event.previousContainer.data[event.previousIndex];
      if (card.type === CardType.operator) {
        const ansArr = this.answer$.getValue();
        ansArr.splice(event.previousIndex, 1);
        this.answer$.next(ansArr);
      }
    }
  }

  removeNumber(fromIdx: number, toIdx?: number) {
    const ans = this.answer$.getValue();
    const dst = this.numbers$.getValue();
    transferArrayItem(ans, dst, fromIdx, toIdx || dst.length);
    this.numbers$.next(dst);
    this.answer$.next(ans);
  }

  removeCard(card: DraggableCard, idx: number) {
    if (card.type === CardType.number) {
      this.removeNumber(idx);
    } else {
      const ansArr = this.answer$.getValue();
      ansArr.splice(idx, 1);
      this.answer$.next(ansArr);
    }
  }

  addNumber(card: NumberCard, numIdx: number, ansIdx?: number) {
    const ansArr = this.answer$.getValue();
    ansArr.splice(ansIdx || ansArr.length, 0, card);
    this.answer$.next(ansArr);
    const numArr = this.numbers$.getValue();
    numArr.splice(numIdx, 1);
    this.numbers$.next(numArr);
  }

  addOperator(card: OperatorCard, ansIdx?: number) {
    const ansArr = this.answer$.getValue();
    ansArr.splice(ansIdx || ansArr.length, 0, card);
    this.answer$.next(ansArr);
  }
}
