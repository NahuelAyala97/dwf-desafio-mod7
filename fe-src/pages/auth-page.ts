import { Router } from "@vaadin/router";
import { state } from "../state";
const imgAuth = require("../components/img/auth.svg");

class AuthPage extends HTMLElement {
  shadow = this.attachShadow({ mode: "open" });
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
    this.addListener();
  }

  message(el: HTMLElement) {
    const message = this.shadowRoot?.querySelector(".message");

    if (!message) {
      const elMessage = document.createElement("p");
      elMessage.className = "message";
      elMessage.textContent = "Ingrese un email para continuar";
      elMessage.style.textAlign = "center";
      elMessage.style.color = "red";
      elMessage.style.margin = "0";

      el.after(elMessage);
    }
  }

  addListener() {
    const button = this.shadow.querySelector(".form-button");
    const input = this.shadow.querySelector(".form-input") as any;
    const inputIn = input?.shadowRoot?.querySelector(".input") as any;

    button?.addEventListener("click", async (e) => {
      let email = inputIn.value;
      if (email) {
        await state.setEmail(email);
        Router.go("/authorization/signIn");
      } else {
        this.message(input);
      }
    });
  }

  render() {
    const style = document.createElement("style");

    this.shadow.innerHTML = `
    <div class="home">
    <header-component class="header"></header-component>
    <div class="auth">
      <div class="auth__container-img">
        <img src="${imgAuth}" alt="auth" />
      </div>
      <div class="container-title">
      <title-subtitle title="Ingresar" subtitle="Ingresá tu email para continuar."></title-subtitle>
      </div>
      <div class="container-form">
        <form class="form">
          <input-custom
            class="form-input"
            type="email"
            placeholder="Ingrese su email"
            label="EMAIL"
          ></input-custom>
          <button-custom class="form-button" background="--color-green"
            >SIGUIENTE</button-custom
          >
        </form>
        <p class="text">
          Aún no tenes cuenta? <a class="link-auth" href="/authorization/signup">Registrate acá</a>
        </p>
      </div>
    </div>
  </div>
    `;

    style.textContent = `
    *{
      box-sizing: border-box;
    }

    .home {
      min-height: 100vh;
      display: flex; 
      flex-direction: column;
    }

    .header{
      max-height: 10vh;
    }

    .auth{
      flex: 1;
      display: flex; 
      flex-direction: column;
      justify-content: space-around;
      align-items: center
    }

    .auth__container-img{
      align-self: center;
      margin-top: 20px;
    }
    

    .container-title{
     margin-bottom: 30px;
    }

    .form { 
      overflow: hidden;
    }

    .form-input{
      display: inherit;
      margin-bottom: 15px;
    }
    
    .text{
      font-size: var(--text-body);
      text-align: center;
      font-weight: 400;
    }
    `;

    this.shadow.appendChild(style);
  }
}

customElements.define("auth-page", AuthPage);
