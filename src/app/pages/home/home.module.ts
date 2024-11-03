import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { CreateBoardModalComponent } from './components/create-board-modal/create-board-modal.component';
import { BoardComponent } from './components/board/board.component';
import { BoardHeaderComponent } from './components/board-header/board-header.component';
import { BoardMainComponent } from './components/board-main/board-main.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ListComponent } from './components/list/list.component';
import { CardComponent } from './components/card/card.component';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: ':boardId',
        component: BoardComponent,
        children: [
          {
            path: ':cardId',
            component: CardComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    CreateBoardModalComponent,
    BoardComponent,
    BoardHeaderComponent,
    BoardMainComponent,
    SidebarComponent,
    ListComponent,
    CardComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DragDropModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
})
export class HomeModule {}
