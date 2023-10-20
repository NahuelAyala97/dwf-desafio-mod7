import { state } from "../state";
import { Router } from "@vaadin/router";

class MyReportPage extends HTMLElement {
  shadow = this.attachShadow({ mode: "open" });
  constructor() {
    super();
  }
  pets;
  async connectedCallback() {
    if (!state.sessionToken()) {
      Router.go("/authorization");
    }
    this.pets = await state.getMyReports();
    this.render();
    this.renderCards();
    this.addListener();
  }
  renderCards() {
    const container = this.shadow.querySelector(
      ".container-card"
    ) as HTMLElement;
    const empty = this.shadow.querySelector(".empty") as HTMLElement;
    if (this.pets.mypets.length) {
      let cardsHTML = "";
      this.pets.mypets.forEach((pet) => {
        const id = pet.id.toString();
        const location = pet.placeName ? pet.placeName : "CABA";
        const card = `<pet-card class="petCard" action="edit" idPet="${id}" image-src=${pet.image} name="${pet.name}" location="${location}"></pet-card>`;
        cardsHTML += card;

        container.innerHTML = cardsHTML;
      });
    } else {
      empty.innerHTML = `
      <p class="text">Aún no reportaste mascotas perdidas</p>
      <button-custom class="button-report" background="--color-blue">Publicar reporte</button-custom>
      `;
    }
  }

  addListener() {
    const button = this.shadow.querySelector(".button-report");
    button?.addEventListener("click", (e) => {
      Router.go("/report");
    });

    const petCards = this.shadow.querySelectorAll(".petCard");
    petCards.forEach((card: any) => {
      const button = card.shadow.querySelector(".button");
      button.addEventListener("click", async (e) => {
        const idPet = parseInt(card.idPet);
        const pet = await state.getPetById(idPet);
        if (pet) {
          Router.go("/report/edit");
        }
      });
    });
  }
  render() {
    const style = document.createElement("style");

    this.shadow.innerHTML = `
     <div class="page">
        <header-component></header-component>
        <div class="home">
        <h1>Mascotas reportadas</h1>
        <div class="container-card"></div>
        <div class="empty"></div>
      </div>`;

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
          margin-bottom: 25px;
        }

        h1 {
            margin: 50px 0;
            text-align: center;
            font-size: var(--text-primary);
          }
        
          .text {
            text-align: center;
            font-size: 27px;
          }

          .container-card {
            display: grid;
            grid-template-columns: 1fr; 
            gap: 20px; 
            justify-content: center; 
            max-width: calc(100% - 40px); 
            margin: 0 auto; 
          }
          
          @media (min-width: 700px) {
            .container-card {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          @media (min-width: 900px) {
            .container-card {
              grid-template-columns: repeat(3, 1fr);
            }
          }
    `;

    this.shadow.appendChild(style);
  }
}

customElements.define("my-report-page", MyReportPage);
