import test from "node:test";
import { state } from "../state";
import { Router } from "@vaadin/router";

class Home extends HTMLElement {
  shadow = this.attachShadow({ mode: "open" });
  constructor() {
    super();
  }
  pets;
  currentPet;

  async connectedCallback() {
    if (!state.sessionToken()) {
      const pets = await state.getAllPets();
      this.pets = pets;
    } else {
      const pets = await state.getAroundPets();
      this.pets = pets;
    }
    const cs = state.getState();
    state.subscribe(() => {
      const cs = state.getState();
      this.currentPet = cs.currentPet;
    });
    this.render();
    this.renderCards();
    this.addListener();
    this.sendForm();
  }
  renderCards() {
    const container = this.shadow.querySelector(
      ".container-pets"
    ) as HTMLElement;
    let cardsHTML = "";
    if (this.pets.pets) {
      this.pets.pets.forEach((pet) => {
        const location = pet.placeName ? pet.placeName : "CABA";
        const card = `<pet-card class="petCard" action="report" idPet="${pet.objectID}" image-src=${pet.image} name="${pet.name}" location="${location}"></pet-card>`;
        cardsHTML += card;

        container.innerHTML = cardsHTML;
      });
    }
  }
  addListener() {
    const petCards = this.shadow.querySelectorAll(".petCard");
    const containerForm = this.shadow.querySelector(
      ".container-form"
    ) as HTMLDivElement;
    const closeButton = containerForm.querySelector(".cerrar-button");
    const spanText = containerForm.querySelector(".span") as any;

    petCards.forEach((card: any) => {
      const button = card.shadow.querySelector(".button");
      button.addEventListener("click", async (e) => {
        if (state.sessionToken()) {
          const idPet = parseInt(card.idPet);
          const pet = await state.getPetById(idPet);
          const nameCapitalize =
            this.currentPet.name.charAt(0).toUpperCase() +
            this.currentPet.name.slice(1).toLowerCase();
          spanText.textContent = nameCapitalize;

          containerForm.style.display = "flex";
        } else {
          Router.go("/authorization");
        }
      });
    });

    closeButton?.addEventListener("click", () => {
      containerForm.style.display = "none";
    });
  }

  sendForm() {
    const buttonReport = this.shadow.querySelector(".button-report");
    const inputName = this.shadow
      .querySelector(".input-name")
      ?.shadowRoot?.querySelector(".input") as any;
    const inputTelephone = this.shadow
      .querySelector(".input-telephone")
      ?.shadowRoot?.querySelector(".input") as any;
    const inputLocation = this.shadow
      .querySelector(".input-location")
      ?.shadowRoot?.querySelector(".input") as any;
    buttonReport?.addEventListener("click", async () => {
      const name = inputName.value;
      const telephone = inputTelephone?.value;
      const location = inputLocation?.value;
      if (name && telephone && location) {
        const response = await state.sendEmail(
          name,
          telephone,
          location,
          this.currentPet
        );
        if (response) {
          const title = this.shadow.querySelector(".title-form") as any;
          title.style.color = "#17d244";
          title.textContent = "Su reporte a sido enviado!";
        }
      } else {
        const title = this.shadow.querySelector(".title-form") as any;
        title.style.color = "#d20020";
        title.textContent = "Error al enviar, intente de nuevo!";
      }
    });
  }
  render() {
    const style = document.createElement("style");

    this.shadow.innerHTML = `
      <div class="page">
          <header-component class="header"></header-component>
          <h1>Mascotas perdidas cerca</h1>
          <div class="container-pets"></div>
          <div class="container-form">
            <div class="form">
            <button class="cerrar-button">x</button>
              <h1 class='title-form'>Reportar info de <span class="span"></span></h1>
              <input-custom class="input-name" type="text" label="NOMBRE"></input-custom>
              <input-custom class="input-telephone" type="text" label="TELEFONO"></input-custom>
              <input-custom class="input-location" type="text" label="DONDE LO VISTE?"></input-custom>
              <button-custom class="button-report" background="--color-green">Enviar información</button-custom>
            </div>
          </div>
          </div>`;

    style.textContent = `
    *{
      box-sizing: border-box;
    }

    .page{
      min-height: 100vh;
      padding-bottom: 20px;
      display: flex; 
      flex-direction: column;
    }
    
    .home{
      flex: 1;
      display: flex; 
      flex-direction: column;
      padding: 0 20px;
      margin-bottom: 25px;
    }

    .container-form {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: none;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(5px);
      z-index: 1;
    }

    .form {
      position: relative;
      background: #26302E;
      width: 80%;
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      gap: 20px;
      z-index: 2; 
    }

    .cerrar-button {
      position: absolute;
      top: 3px;
      right: 15px;
      font-size: 30px;
      color: #fff;
      background: transparent;
      border: none;
      cursor: pointer;
      outline: none;
      padding: 0;
      z-index: 2; 
    }
    
    .cerrar-button:hover {
      color: #ffffff; 
    }
    
    .title-form{
        margin: 30px 0;
        text-align: center;
        font-size: var(--text-primary);
        color: #FFFFFF
    }

    h1 {
        margin: 50px 0;
        text-align: center;
        font-size: var(--text-primary);
      }
    
      .container-pets {
        display: grid;
        grid-template-columns: 1fr; 
        gap: 20px; 
        justify-content: center; 
        max-width: calc(100% - 40px); 
        margin: 0 auto; 
      }
      
      @media (min-width: 700px) {
        .container-pets {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      @media (min-width: 900px) {
        .container-pets {
          grid-template-columns: repeat(3, 1fr);
        }
      }`;

    this.shadow.appendChild(style);
  }
}
customElements.define("home-page", Home);
