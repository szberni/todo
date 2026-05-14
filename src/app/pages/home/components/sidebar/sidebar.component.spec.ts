import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterLink, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { SidebarComponent } from './sidebar.component';
import { SidebarTestIds } from './sidebar.test-ids';
import { BoardsFacadeService, LOCAL_STORAGE, RouteName } from 'src/app/shared';
import { GeneralBoardInfo } from 'src/app/store';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  const page = {
    getOpenButton: () => fixture.debugElement.query(By.css(`button[data-testid=${SidebarTestIds.openButton}]`)),
    getCloseButton: () => fixture.debugElement.query(By.css(`button[data-testid=${SidebarTestIds.closeButton}]`)),
    getBoardFavoriteButton: (id: number) => fixture.debugElement.query(By.css(`button[data-testid=${SidebarTestIds.boardFavoriteButton}-${id}]`)),
    getBoardLink: (id: number) => fixture.debugElement.query(By.css(`a[data-testid=${SidebarTestIds.boardLink}-${id}]`)),
  } as const;

  const localStorageMock: Partial<jest.Mocked<Storage>> = {
    getItem: jest.fn(),
    setItem: jest.fn()
  }

  const boardsFacadeServiceMock: Partial<jest.Mocked<BoardsFacadeService>> = {
    getGeneralBoardsInfo: jest.fn(),
    toggleFavorite: jest.fn(),
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      imports: [RouterLink],
      providers: [
        provideRouter([]),
        { provide: LOCAL_STORAGE, useValue: localStorageMock },
        { provide: BoardsFacadeService, useValue: boardsFacadeServiceMock },
      ]
    });

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.resetAllMocks();
  })

  describe('open state and localStorage', () => {
    it('has closed status initially', () => {
      component.ngOnInit();

      expect(component.isOpen).toBe(false);
    });

    it('gets open status from localStorage if provided', () => {
      localStorageMock.getItem.mockImplementation((key) => (key === SidebarComponent.LOCAL_STORAGE_KEY ? 'true' : null))

      component.ngOnInit();

      expect(component.isOpen).toBe(true);
    });

    it(`opens sidebar and sets 'isSidebarOpen' in localStorage to 'true' if open-button is clicked`, () => {
      component.isOpen = false;
      fixture.detectChanges();
      const openButton = page.getOpenButton();

      openButton.nativeElement.click();

      expect(component.isOpen).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(SidebarComponent.LOCAL_STORAGE_KEY, 'true');
    });

    it(`closes sidebar and sets 'isSidebarOpen' in localStorage to 'false' if close-button is clicked`, () => {
      component.isOpen = true;
      fixture.detectChanges();
      const closeButton = page.getCloseButton();
  
      closeButton.nativeElement.click();
  
      expect(component.isOpen).toBe(false);
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(SidebarComponent.LOCAL_STORAGE_KEY, 'false');
    });
  });

  describe('toggle favorite state of a board', () => {
    const mockBoards: GeneralBoardInfo[] = [{ id: 1, title: 'Title', isFavorite: false }, { id: 2, title: 'Title', isFavorite: true }];

    it.each(mockBoards)('boardsFacade.toggleFavorite with board id and isFavorite flag ($isFavorite) when toggle-favorite button is clicked', ({ id, isFavorite }) => {
      boardsFacadeServiceMock.getGeneralBoardsInfo.mockReturnValue(of(mockBoards));
      component.isOpen = true;

      component.ngOnInit();
      fixture.detectChanges();

      const toggleFavoriteButton = page.getBoardFavoriteButton(id);
      toggleFavoriteButton.nativeElement.click();

      expect(boardsFacadeServiceMock.toggleFavorite).toHaveBeenCalledWith(id, isFavorite);
    });
  });

  it('includes routerLink to the selected board', () => {
    boardsFacadeServiceMock.getGeneralBoardsInfo.mockReturnValue(of([{ id: 1, title: 'Title', isFavorite: false }]));
    component.isOpen = true;

    component.ngOnInit();
    fixture.detectChanges();

    const linkDebugEl = page.getBoardLink(1);
    const routerLink = linkDebugEl.injector.get(RouterLink);
    expect(routerLink.href).toBe(`/${RouteName.home}/1`)
  });
});
