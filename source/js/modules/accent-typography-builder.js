export default class AccentTypographyBuild {
  constructor(
      elementSelector,
      timer,
      classForActivate,
      property,
      wordDelay = 0,
      delay = 0,
      timeOffsetDelta = 20
  ) {
    this.TIME_SPACE = 100;

    this.elementSelector = elementSelector;
    this.timer = timer;
    this.classForActivate = classForActivate;
    this.property = property;

    if (typeof this.elementSelector === `string`) {
      this.element = document.querySelector(this.elementSelector);
    } else {
      this.element = this.elementSelector;
    }

    this.timeOffset = 0;
    this.timeOffsetDelta = timeOffsetDelta;
    this.wordDelay = wordDelay;
    this.delay = delay;
    this.delayLetterGroup = [200, 150, 0, 100]; 

    this.prepareText(timeOffsetDelta);
  }


  createElement(letter, wordIndex, letterIndex) {
    const span = document.createElement(`span`);

    span.textContent = letter;
    span.style.transition = this.getTransition(wordIndex, letterIndex);

    return span;
  }

  getTransition(wordIndex, letterIndex) {
    const transitionDelay = wordIndex * this.wordDelay + this.delayLetterGroup[letterIndex % this.delayLetterGroup.length];

    return `${this.property} ${this.timer}ms ease ${this.delay + transitionDelay}ms`;
  }

  prepareText(delta) {
    if (!this.element) {
      return;
    }

    const text = this.element.textContent.trim().split(/[\s]+/);

    const {length} = text;
    
    const content = text.reduce((fragmentParent, word, index) => {
      let letterIndex = 0;
      const wordElement = Array.from(word).reduce((fragment, letter) => {
        fragment.appendChild(this.createElement(letter, index, letterIndex));
        letterIndex++;
        return fragment;
      }, document.createDocumentFragment());

      const wordContainer = document.createElement(`span`);

      wordContainer.classList.add(`accent-typography__word`);
      wordContainer.appendChild(wordElement);
      fragmentParent.appendChild(wordContainer);

      // Add Space text node:
      if (index < length - 1) fragmentParent.appendChild(document.createTextNode(` `));

      return fragmentParent;
    }, document.createDocumentFragment());

    this.element.innerHTML = ``;
    this.element.appendChild(content);
  }

  runAnimation() {
    if (!this.element) {
      return;
    }

    this.element.classList.add(this.classForActivate);
  }

  destroyAnimation() {
    this.element.classList.remove(this.classForActivate);
  }
}
