class PetCard extends HTMLElement {
  shadow = this.attachShadow({ mode: "open" });
  constructor() {
    super();
  }
  idPet;

  connectedCallback() {
    const id = this.getAttribute("idPet");
    this.idPet = id;
    this.render();
  }
  render() {
    const imageSrc = this.getAttribute("image-src");
    const name = this.getAttribute("name") as string;
    const nameCapitalized =
      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    const location = this.getAttribute("location");
    const action = this.getAttribute("action");
    let background;
    let textButton;

    if (action == "edit") {
      background = "--color-blue";
      textButton = "Editar";
    } else if (action == "report") {
      background = "--color-red";
      textButton = "Reportar";
    }

    const style = document.createElement("style");

    this.shadow.innerHTML = `
      <div class='container-card'>
        <div class='container-img'>
            <img class='img' src=${imageSrc}>
        </div>
        <div class='container-data'>
            <div class='container-text'>
                <h4 class="name">${nameCapitalized}</h4>
                <p class='location'>${location}</p>
            </div>
            <button-custom class="button" background=${background}>${textButton}<button-custom>
        </div>
      </div>
      `;

    style.innerText = `
      .container-card{
        max-width: 335px;
        min-height: 234px;
        border-radius: 10px;
        background: #26302E;
        padding: 10px;
        display: grid;
        justify-content: center;
        box-shadow: 0px 1px 4px 1px rgba(0, 0, 0, 0.50);
      }

      .container-data{
       display: flex;
       align-items: center;
       gap: 10px;
      }

      .container-img{
        height: 136px;
      }

      .img {
        width: 100%;
        height: 100%;
        border-radius: 3px;
        object-fit: cover;
      }
      
      .name{
        margin: 0;
        color: #FFF;
        font-size: 36px;
        font-weight: 700;
      }

      .location{
        margin: 0;
        color: #FFF;
        font-size: 16px;
        font-weight: 700;
      }

      .button{
        display: block;
        width: 100px;
        height: 40px;
        border-radius: 3px;
      }
    
      `;

    this.shadow.appendChild(style);
  }
}

customElements.define("pet-card", PetCard);
