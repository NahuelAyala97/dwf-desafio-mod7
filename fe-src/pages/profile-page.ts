import { state } from "../state";
import { Router } from "@vaadin/router";
class ProfilePage extends HTMLElement {
  shadow = this.attachShadow({ mode: "open" });
  email: string;
  constructor() {
    super();
  }

  connectedCallback() {
    if (!state.sessionToken()) {
      Router.go("/authorization");
    }
    this.render();
    this.addListener();
  }
  addListener() {
    const buttonData = this.shadow.querySelector(".buttonData");
    const buttonPassword = this.shadow.querySelector(".buttonPassword");
    const close = this.shadow.querySelector(".cerrar-sesion");

    buttonData?.addEventListener("click", (e) => {
      Router.go("/profile/me");
    });
    buttonPassword?.addEventListener("click", (e) => {
      Router.go("/profile/password");
    });

    close?.addEventListener("click", (e) => {
      state.signOut();
      Router.go("/");
    });
  }
  render() {
    this.email = state.getState().user.email;
    const style = document.createElement("style");

    this.shadow.innerHTML = `
      <div class="page">
          <header-component class="header"></header-component>
          <div class="home">
              <h1 class="title">Mis Datos</h1>
              <div class="container-button">
                    <button-custom background="--color-blue" class="buttonData uno">MODIFICAR DATOS PERSONALES</button-custom>
                    <button-custom background="--color-blue" class="buttonPassword dos">MODIFICAR CONTRASEÑA</button-custom>
              </div>
              <div class="session__container">
              <p class="email-user">${this.email}</p>
              <a class="cerrar-sesion" href=#>Cerrar sesión</a>
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
          justify-content: space-around;
          padding: 0 20px;
        }
        
        .title {
            margin: 50px 0;
            text-align: center;
            font-size: var(--text-primary);
        }
        
        .uno {
            margin-bottom: 25px;
            display: block;
        }
        
        .session__container{
            text-align: center;
        }
        `;

    this.shadow.appendChild(style);
  }
}

customElements.define("profile-page", ProfilePage);
