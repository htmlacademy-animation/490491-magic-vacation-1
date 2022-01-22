import throttle from 'lodash/throttle';
import AccentTypographyBuild from './accent-typography-builder';

export default class FullPageScroll {
  constructor() {
    this.THROTTLE_TIMEOUT = 1000;
    this.scrollFlag = true;
    this.timeout = null;

    this.bodyEl = document.body;
    this.previousTheme = ``;
    this.isPrizes = false;
    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);

    this.activeScreen = 0;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
    this.introTitle = new AccentTypographyBuild(`.intro__title`, 500, `accent-typography--active`, `transform`, 300);
    this.storyTitle = new AccentTypographyBuild(`.slider__item-title`, 500, `accent-typography--active`, `transform`, 300);
    this.prizesTitle = new AccentTypographyBuild(`.prizes__title`, 500, `accent-typography--active`, `transform`, 300);
    this.rulesTitle = new AccentTypographyBuild(`.rules__title`, 500, `accent-typography--active`, `transform`, 300);
    this.gameTitle = new AccentTypographyBuild(`.game__title`, 500, `accent-typography--active`, `transform`, 300);  
    this.introDate = new AccentTypographyBuild(`.intro__date`, 500, `accent-typography--active`, `transform`);      
  }

  init() {
    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, {trailing: true}));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);

    this.onUrlHashChanged();
  }

  onScroll(evt) {
    if (this.scrollFlag) {
      this.reCalculateActiveScreenPosition(evt.deltaY);
      const currentPosition = this.activeScreen;
      if (currentPosition !== this.activeScreen) {
        this.changePageDisplay();
      }
    }
    this.scrollFlag = false;
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.timeout = null;
      this.scrollFlag = true;
    }, this.THROTTLE_TIMEOUT);
  }

  onUrlHashChanged() {
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    this.activeScreen = (newIndex < 0) ? 0 : newIndex;
    this.changePageDisplay();
  }

  changePageDisplay() {
    this.changeVisibilityDisplay();
    this.changeActiveMenuItem();
    this.emitChangeDisplayEvent();
  }

  destroyTextAnimations() {
    this.introTitle.destroyAnimation();
    this.introDate.destroyAnimation();
    this.storyTitle.destroyAnimation();
    this.prizesTitle.destroyAnimation();
    this.rulesTitle.destroyAnimation();
    this.gameTitle.destroyAnimation();
  }

  runTextAnimations() {
    switch(this.screenElements[this.activeScreen].id) {
      case 'top': 
        {
          this.introTitle.runAnimation();
          this.introDate.runAnimation();
        }
        break;     
        case 'story': 
          {
            this.storyTitle.runAnimation();
          }
          break;  
        case 'prizes': 
          {
            this.prizesTitle.runAnimation();
          }
          break; 
        case 'rules': 
          {
            this.rulesTitle.runAnimation();
          }
          break; 
        case 'game': 
          {
            this.gameTitle.runAnimation();
          }
          break;
      default:
        break;
    }
  }

  removeTheme() {
    if (this.bodyEl.classList.contains('page-load--purple')) {
      this.previousTheme = 'page-load--purple';
      this.bodyEl.classList.remove('page-load--purple');
    }
    if (this.bodyEl.classList.contains('page-load--blue')) {
      this.previousTheme = 'page-load--blue';
      this.bodyEl.classList.remove('page-load--blue');
    }
    if (this.bodyEl.classList.contains('page-load--light-blue')) {
      this.previousTheme = 'page-load--light-blue';
      this.bodyEl.classList.remove('page-load--light-blue');
    }
  }

  switchScreen() {
    this.screenElements.forEach((screen) => {
      screen.classList.add(`screen--hidden`);
      screen.classList.remove(`active`);
    });
    this.screenElements[this.activeScreen].classList.remove(`screen--hidden`);
    setTimeout(() => {
      this.screenElements[this.activeScreen].classList.add(`active`);
      this.destroyTextAnimations();
      this.runTextAnimations();
    }, 100);
  }

  changeVisibilityDisplay() {
    if (this.screenElements[this.activeScreen].id === `prizes`) {
      this.isPrizes = true;
      setTimeout(() => {
        this.removeTheme();
        this.screenElements.forEach((screen) => {
          screen.classList.add(`screen--hidden`);
          screen.classList.remove(`active`);
        });
        this.screenElements[this.activeScreen].classList.remove(`screen--hidden`);
        this.screenElements[this.activeScreen].classList.add(`active`);
        setTimeout(() => {
          this.destroyTextAnimations();
          this.runTextAnimations();
        }, 10);
      }, 1000);
    } else {

      if (this.screenElements[this.activeScreen].id === `story`) {
        if (this.previousTheme) {
          this.bodyEl.classList.add(this.previousTheme);        
        }
      } else {
        this.removeTheme();
      }

      

      if (this.isPrizes) {
        let screenPrizes = document.getElementById(`prizes`);
        screenPrizes.classList.add('screen--close');
        setTimeout(() => {
          screenPrizes.classList.remove('screen--close');
          this.switchScreen();
        }, 200);
      } else {
        this.switchScreen();
      }

      this.isPrizes = false;
    }
  }

  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find((item) => item.dataset.href === this.screenElements[this.activeScreen].id);
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.activeScreen,
        'screenName': this.screenElements[this.activeScreen].id,
        'screenElement': this.screenElements[this.activeScreen]
      }
    });

    document.body.dispatchEvent(event);
  }

  reCalculateActiveScreenPosition(delta) {
    if (delta > 0) {
      this.activeScreen = Math.min(this.screenElements.length - 1, ++this.activeScreen);
    } else {
      this.activeScreen = Math.max(0, --this.activeScreen);
    }
  }
}
