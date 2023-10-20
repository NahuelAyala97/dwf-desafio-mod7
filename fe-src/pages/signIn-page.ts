import { state } from "../state";
import { Router } from "@vaadin/router";

class SignIn extends HTMLElement {
  shadow = this.attachShadow({ mode: "open" });
  email: string;
  constructor() {
    super();
  }

  connectedCallback() {
    const cs = state.getState();
    this.email = cs.user.email;
    this.render();
    this.addListener();
  }

  message(el: HTMLElement, text: string) {
    const message = this.shadowRoot?.querySelector(".message") as any;

    if (!message) {
      const elMessage = document.createElement("p");
      elMessage.className = "message";
      elMessage.textContent = text;
      elMessage.style.textAlign = "center";
      elMessage.style.color = "red";
      elMessage.style.margin = "0";

      el.after(elMessage);
    } else if (message) {
      message.textContent = text;
    }
  }

  addListener() {
    const inputEmail = this.shadow
      .querySelector(".input-email")
      ?.shadowRoot?.querySelector(".input") as any;
    inputEmail.value = this.email;

    const inputPassword = this.shadow.querySelector(".input-password") as any;

    const inputPasswordIn = inputPassword?.shadowRoot?.querySelector(
      ".input"
    ) as any;
    const button = this.shadow.querySelector(".button") as HTMLElement;

    button.addEventListener("click", async (e) => {
      let password = inputPasswordIn.value;
      if (password) {
        const auth = await state.signIn(this.email, password);
        if (auth) {
          await state.getProfile();
          Router.go("/");
        } else {
          this.message(inputPassword, "Email o contraseña incorrectos.");
        }
      } else {
        this.message(inputPassword, "Ingrese su contraseña para continuar");
      }
    });
  }

  render() {
    const style = document.createElement("style");

    this.shadow.innerHTML = `
     <div class="page">
        <header-component></header-component>
        <div class="home">
          <title-subtitle class="text" title="Iniciar Sesión" subtitle="Ingresá los siguientes datos para iniciar sesión"></title-subtitle>
          <div class="containter-form">
            <input-custom class="input-email" type="email" label="EMAIL"></input-custom>
            <input-custom class="input-password" type="password" label="CONTRASEÑA"></input-custom>
            <a class="link" href="/">Olvidé mi contraseña</a>
            <button-custom class="button" background="--color-blue">ACCEDER<button-custom>
          </div>
        </div>
     </div>
     `;

    style.textContent = `
    *{
      box-sizing: border-box;
    }

    .page{
      min-height: 100vh;
      display: flex; 
      flex-direction: column;
    }
    
    .home{
      flex: 1;
      display: flex; 
      flex-direction: column;
      padding: 0 20px;
    }
    
    .text{
      margin: 50px 0;
    }

    .containter-form{
      flex: 1;
      overflow: hidden;
      display: grid;
      grid-template-rows: max-content max-content max-content 1fr;
      gap: 20px;
      margin-bottom: 20px;
    } 
    
    .link{
      justify-self: center;
    }

    .button{
      align-self: end;
    }
    `;

    this.shadow.appendChild(style);
  }
}

customElements.define("signin-page", SignIn);
