import { state } from "../state";
import { Router } from "@vaadin/router";

class DataUser extends HTMLElement {
  shadow = this.attachShadow({ mode: "open" });
  name: string;
  location: string;
  constructor() {
    super();
  }

  connectedCallback() {
    if (!state.sessionToken()) {
      Router.go("/authorization");
    }
    const cs = state.getState();
    state.subscribe(() => {
      const cs = state.getState();
      this.name = cs.user.name;
      this.location = cs.user.placeName;
    });
    this.name = cs.user.name;
    this.location = cs.user.placeName;
    this.render();
    this.addListener();
  }
  message(el: HTMLElement, text: string, color: string) {
    const message = this.shadow
      .querySelector(".input-password")
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

  addListener() {
    const inputName = this.shadow
      .querySelector(".input-name")
      ?.shadowRoot?.querySelector(".input") as any;

    const inputLocation = this.shadow
      .querySelector(".input-location")
      ?.shadowRoot?.querySelector(".input") as any;

    inputName.value = this.name;
    inputLocation.value = this.location;

    const button = this.shadow.querySelector(".button");
    button?.addEventListener("click", async (e) => {
      const response = await state.updateProfile(
        inputName.value,
        inputLocation.value
      );
      if (response) {
        this.message(inputLocation, "Guardado con éxito!", "green");
      } else {
        this.message(
          inputLocation,
          "Error al guardar, intentalo de nuevo.",
          "red"
        );
      }
    });
  }
  render() {
    const style = document.createElement("style");

    this.shadow.innerHTML = `
        <div class="page">
            <header-component class="header"></header-component>
            <div class="home">
                <h1 class="title">Datos personales</h1>
                <div class="container-input">                
                      <input-custom class="input-name" type="text" label="NOMBRE"></input-custom> 
                      <input-custom class="input-location" type="text" label="LOCALIDAD"></input-custom>
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
          
          .input-name {
              margin-bottom: 25px;
              display: block;
          }
          .search{
            height: 40px;
          }
          `;

    this.shadow.appendChild(style);
  }
}

customElements.define("data-user-page", DataUser);
