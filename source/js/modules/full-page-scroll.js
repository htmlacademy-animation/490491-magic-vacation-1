import throttle from 'lodash/throttle';
import AccentTypographyBuild from './accent-typography-builder';

export default class FullPageScroll {
  constructor() {
    this.THROTTLE_TIMEOUT = 1000;
    this.scrollFlag = true;
    this.timeout = null;

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

  changeVisibilityDisplay() {
    if (this.screenElements[this.activeScreen].id === `prizes`) {
      setTimeout(() => {
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
