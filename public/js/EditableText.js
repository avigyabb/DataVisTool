/* A DOM component that displays text and allows the user to edit it, turning into an input.
  The current text value is exposed through .value, and it can be set directly with .setValue(). */
  export default class EditableText {
    /* id is the name and id for the input element, needed to associate a label with it. */
    constructor(id) {
      this.id = id;
      this.value = "";
      this.element = null;
      this._switchToInput = this._switchToInput.bind(this);
      this._switchToDisplay = this._switchToDisplay.bind(this);
      this._createDisplay = this._createDisplay.bind(this);
      this._createInput = this._createInput.bind(this);
      this._callback = null;
    }
    
    /* Add the component (in display state) to the DOM tree under parent. When the value changes, onChange is called
       with a reference to this object as argument. */
    addToDOM(parent, onChange) {
      let newDisplay = this._createDisplay();
      parent.append(newDisplay);
      this.element = newDisplay;
      this._callback = onChange;
    }
    
    /* Set the value of the component and switch to display state if necessary. Does not call onChange. */
    setValue(value) {
      this.value = value;
      let display = this._createDisplay();
      this.element.replaceWith(display);
      this.element = display;
    }
    
    /* Create and return a DOM element representing this component in display state. */
    _createDisplay() {
      let container = document.createElement("div");
      container.classList.add("editableText");
      let text = document.createElement("span");
      text.textContent = this.value;
      container.append(text);
      let button = this._createImageButton("edit");
      button.type = "button";
      container.append(button);
      button.addEventListener("click", this._switchToInput);
      return container;
    }
    
    /* Create and return a DOM element representing this component in input state. */
    _createInput() {
      let form = document.createElement("form");
      form.classList.add("editableText");
      let input = document.createElement("input");
      input.type = "text";
      input.name = this.id;
      input.id = this.id;
      input.value = this.value;
      form.append(input);
      let button = this._createImageButton("save");
      button.type = "submit";
      form.append(button);
      button.addEventListener("click", this._switchToDisplay);
      return form;
    }
    
    /* Helper to create a button containing an image. name is the name of the image, without directory or extension. */
    _createImageButton(name) {
      let button = document.createElement("button");
      let img = document.createElement("img");
      img.src = `images/${name}.svg`;
      img.alt = name;
      button.append(img);
      return button;
    }
    
    _switchToInput(event) {
      event.preventDefault();
      let input = this._createInput();
      this.element.replaceWith(input);
      this.element = input;
    }
    
    _switchToDisplay(event) {
      event.preventDefault();
      this.value = this.element.querySelector("input").value;
      let display = this._createDisplay();
      this._callback(this.element.querySelector("input"));
      this.element.replaceWith(display);
      this.element = display;
    }
   }
   