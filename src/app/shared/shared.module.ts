import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppendMarkPipe } from './pipes';
import { AutoFocusDirective, ResizableTextareaDirective } from './directives';

@NgModule({
  declarations: [AppendMarkPipe, ResizableTextareaDirective, AutoFocusDirective],
  imports: [CommonModule],
  exports: [AppendMarkPipe, ResizableTextareaDirective, AutoFocusDirective],
})
export class SharedModule {}
