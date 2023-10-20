type Background =
  | "--color-blue"
  | "--color-green"
  | "--color-red"
  | "--color-black";

class ButtonCustom extends HTMLElement {
  shadow = this.attachShadow({ mode: "open" });
  background: Background = "--color-blue";
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }
  render() {
    const style = document.createElement("style");

    this.shadow.innerHTML = `
    <button>${this.textContent}</button>
    `;

    this.background = this.getAttribute("background") as Background;

    style.innerText = `
    button{
      background: var(${this.background});
      font-size: var(--text-body);
      font-family: "Poppins", sans-serif;
      box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);
      border-style: none;
      border-radius: 5px;
      color: #FFF;
      font-weight: 700;
      width: 100%;
      height: 50px;
      cursor: pointer;
    }
    `;

    this.shadow.appendChild(style);
  }
}

customElements.define("button-custom", ButtonCustom);
