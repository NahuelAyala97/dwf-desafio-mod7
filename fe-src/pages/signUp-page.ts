import { Router } from "@vaadin/router";
import { state } from "../state";

class SignUp extends HTMLElement {
  shadow = this.attachShadow({ mode: "open" });
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.addListener();
  }
  message(el: HTMLElement, text: string) {
    const message = this.shadow?.querySelector(".message") as any;

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
    const inputName = this.shadow
      .querySelector(".input-name")
      ?.shadowRoot?.querySelector(".input") as any;

    const inputEmail = this.shadow
      .querySelector(".input-email")
      ?.shadowRoot?.querySelector(".input") as any;

    const inputPassword = this.shadow.querySelector(".input-password") as any;
    const inputPasswordIn = inputPassword?.shadowRoot?.querySelector(
      ".input"
    ) as any;

    const button = this.shadow.querySelector(".button") as HTMLElement;

    button.addEventListener("click", async (e) => {
      let name = inputName.value;
      let email = inputEmail.value;
      let password = inputPasswordIn.value;
      if (name && email && password) {
        const auth = await state.signUp(name, email, password);
        if (auth) {
          await state.getProfile();
          Router.go("/");
        } else {
          this.message(
            inputPassword,
            "El email ya esta registrado, por favor inicie sesión."
          );
        }
      } else {
        this.message(inputPassword, "Todos los campos son obligatorios");
      }
    });
  }

  render() {
    const style = document.createElement("style");

    this.shadow.innerHTML = `
    <div class="page">
        <header-component class="header"></header-component>
        <div class="home">
            <title-subtitle class="text" title="Registrarse" subtitle="Ingresá los siguientes datos para realizar el registro"></title-subtitle>
            <div class="container-form">
            <input-custom class="input-name" type="text" label="NOMBRE"></input-custom>
            <input-custom class="input-email" type="email" label="EMAIL"></input-custom>
            <input-custom class="input-password" type="password" label="CONTRASEÑA"></input-custom>
            <p class="text-link">Ya tenes una cuenta?<a class="link" href="/authorization">Iniciar sesión.<a/></p>
            <button-custom background="--color-blue" class="button">SIGUIENTE</button-custom>

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
        margin: 40px 0;
      }
      .text-link{
        margin: 0;
        align-self: center;
      }
  
      .container-form{
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-bottom: 15px;
      } `;

    this.shadow.appendChild(style);
  }
}

customElements.define("signup-page", SignUp);
