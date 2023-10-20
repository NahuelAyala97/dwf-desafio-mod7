import { stat } from "fs";
import { state } from "../state";

class PasswordUser extends HTMLElement {
  shadow = this.attachShadow({ mode: "open" });
  constructor() {
    super();
  }

  user;

  connectedCallback() {
    const cs = state.getState();
    this.user = cs.user;
    this.render();
    this.addListener();
  }

  addListener() {
    const button = this.shadow.querySelector(".button");
    const password = this.shadow
      .querySelector(".input-password")
      ?.shadowRoot?.querySelector(".input") as any;
    const passwordConfirm = this.shadow
      .querySelector(".input-confirm")
      ?.shadowRoot?.querySelector(".input") as any;

    button?.addEventListener("click", async () => {
      if (password.value == passwordConfirm.value) {
        const response = await state.updatePassword(password.value);
        if (response) {
          await state.signIn(this.user.email, password.value);
          this.message(passwordConfirm, "Guardado con éxito!", "green");
        } else {
          this.message(
            passwordConfirm,
            "Error al guardar, intente de nuevo!",
            "red"
          );
        }
      } else {
        this.message(
          passwordConfirm,
          "Las dos contraseñas deben ser iguales",
          "red"
        );
      }
    });
  }

  message(el: HTMLElement, text: string, color: string) {
    const message = this.shadow
      .querySelector(".input-confirm")
      ?.shadowRoot?.querySelector(".message") as any;

    if (!message) {
      const elMessage = document.createElement("p");
      elMessage.className = "message";
      elMessage.textContent = text;
      elMessage.style.textAlign = "center";
      elMessage.style.color = color;
      elMessage.style.margin = "0";

      el.after(elMessage);
    } else if (message) {
      message.textContent = text;
    }
  }

  render() {
    const style = document.createElement("style");

    this.shadow.innerHTML = `
          <div class="page">
              <header-component class="header"></header-component>
              <div class="home">
                  <h1 class="title">Contraseña</h1>
                  <div class="container-input">                
                        <input-custom class="input-password" type="password" label="CONTRASEÑA"></input-custom> 
                        <input-custom class="input-confirm" type="password" label="CONFIRMAR CONTRASEÑA"></input-custom> 
                  </div> 
                  <button-custom background="--color-blue" class="button">GUARDAR</button-custom>
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
              justify-content: space-around;
              padding: 0 20px;
            }
            
            .title {
                margin: 40px 0;
                text-align: center;
                font-size: var(--text-primary);
            }
            
            .input-password {
                margin-bottom: 25px;
                display: block;
            }
            `;

    this.shadow.appendChild(style);
  }
}

customElements.define("password-user-page", PasswordUser);
