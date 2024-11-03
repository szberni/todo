import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BoardsFacadeService } from 'src/app/shared';

@Component({
  selector: 'app-create-board-modal',
  templateUrl: './create-board-modal.component.html',
  styleUrls: ['./create-board-modal.component.scss'],
})
export class CreateBoardModalComponent {
  createBoardForm = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });

  constructor(public bsModalRef: BsModalRef, private boardsFacade: BoardsFacadeService) {}

  get titleControl(): AbstractControl<string> {
    return this.createBoardForm.controls.title;
  }

  get isTitleControlRequired(): boolean {
    return this.titleControl.hasValidator(Validators.required);
  }

  onSubmit(): void {
    this.boardsFacade.create({ title: this.titleControl.value });
    this.bsModalRef.hide();
  }
}
