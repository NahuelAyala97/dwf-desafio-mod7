class TitleSubtitle extends HTMLElement {
  shadow = this.attachShadow({ mode: "open" });
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }
  render() {
    const style = document.createElement("style");
    const title = this.getAttribute("title") || "";
    const subtitle = this.getAttribute("subtitle") || "";

    this.shadow.innerHTML = `
      <h1>${title}</h1>
      <p>${subtitle}</p>
    `;

    style.textContent = `
    h1 {
      margin: 0;
      margin-bottom: 25px;
      text-align: center;
      font-size: var(--text-primary);
    }

    p {
      margin: 0;
      font-size: var(--text-body);
      text-align: center;
      font-weight: 400;
    }
    
    `;

    this.shadow.appendChild(style);
  }
}

customElements.define("title-subtitle", TitleSubtitle);
