class InputCustom extends HTMLElement {
  shadow = this.attachShadow({ mode: "open" });
  label: String;
  type: String;
  placeholder: String;
  constructor() {
    super();
  }

  connectedCallback() {
    this.setOptions();
    this.render();
  }

  setOptions() {
    this.label = this.getAttribute("label") || "label";
    this.type = this.getAttribute("type") || "type";
    this.placeholder = this.getAttribute("placeholder") || " ";
  }
  render() {
    const style = document.createElement("style");

    this.shadow.innerHTML = `
    <div class="container">
    <label>${this.label}</label>
    <input class="input" type=${this.type} placeholder=${this.placeholder}>
    </div>
    `;

    style.textContent = `
    .container{
      width: 100%;
    }

    label {
        font-size: var(--text-body);
    }
    
    .input{
        width: 100%;
        box-sizing: border-box;
        height: 50px;
        font-size: var(--text-body);
        border-style: double;
        text-indent: 10px;
        border-radius: 4px;
        background: #FFF;
        box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);
    }

    `;

    this.shadow.appendChild(style);
  }
}

customElements.define("input-custom", InputCustom);
