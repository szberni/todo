import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { By } from '@angular/platform-browser';
import { HomeComponent } from './home.component';
import { BoardsFacadeService } from 'src/app/shared';

@Component({selector: 'app-header', template: ''})
class HeaderMockComponent {}

@Component({selector: 'app-sidebar', template: ''})
class SidebarMockComponent {}

const boardsFacadeServiceMock: Partial<jest.Mocked<BoardsFacadeService>> = {
  fetchAll: jest.fn(),
};

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent, HeaderMockComponent, SidebarMockComponent],
      imports: [RouterOutlet],
      providers: [
        { provide: BoardsFacadeService, useValue: boardsFacadeServiceMock },
      ],
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('fetches boards', () => {
    expect(boardsFacadeServiceMock.fetchAll).toHaveBeenCalled();
  });

  it('contains router outlet', () => {
    const outlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(outlet).toBeTruthy();
  });
});
