import { Router } from "@vaadin/router";
import { state } from "../state";

const logo = require("url:./img/logo.jpg");
const burguer = require("url:./img/menu.svg");
const cruz = require("url:./img/Vector.svg");

class Header extends HTMLElement {
  shadow = this.attachShadow({ mode: "open" });
  emailUser: string = "TEST@TEST.COM";
  constructor() {
    super();
  }

  connectedCallback() {
    if (!state.sessionToken()) {
      this.emailUser = "";
    } else {
      const cs = state.getState();
      this.emailUser = cs.user.email ? cs.user.email : "";
    }
    this.render();
    this.activeMenu();
    this.logOut();
    this.router();
  }

  activeMenu() {
    const burguer = this.shadow.querySelector(".menu-burguer") as any;
    const cruz = this.shadow.querySelector(".cruz") as any;
    const containerNav = this.shadow.querySelector(
      ".header__container-nav"
    ) as any;

    burguer?.addEventListener("click", (e) => {
      containerNav.style.display = "grid";
      burguer.style.display = "none";
    });
    cruz?.addEventListener("click", (e) => {
      containerNav.style.display = "none";
      burguer.style.display = "inherit";
    });
  }

  router() {
    const logo = this.shadow.querySelector(".header__container-logo");
    logo?.addEventListener("click", (e) => {
      Router.go("/");
    });
    const links = this.shadow.querySelectorAll(".link-page");
    links.forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        let path = el.getAttribute("href") || "/";
        Router.go(path);
      });
    });
  }

  logOut() {
    const close = this.shadow.querySelector(".cerrar-sesion") as any;
    if (!this.emailUser) {
      close.textContent = "Iniciar sesión";
    }

    close?.addEventListener("click", (e) => {
      if (this.emailUser) {
        state.signOut();
        this.emailUser = "";
        Router.go("/");
      } else {
        Router.go("/authorization");
      }
    });
  }

  render() {
    const style = document.createElement("style");

    this.shadow.innerHTML = `
    <header class="header">
      <div class="header__container-logo">
        <img src=${logo} alt="logo" class="logo" />
      </div>
      <div class="menu-burguer">
        <img src=${burguer} alt="menu" class="menu" />
      </div>
      <div class="header__container-nav">
        <nav class="header__nav">
          <ul class="header__nav-list">
            <li class="header__nav-list-item"><a class="link-page" href="/profile">Mis datos</a></li>
            <li class="header__nav-list-item"><a class="link-page" href="/report/me">Mis mascotas reportadas</a></li>
            <li class="header__nav-list-item"><a class="link-page" href="/report">Reportar mascotas</a></li>
          </ul>
        </nav>
        <div class="indoSession__container">
          <p class="email-user">${this.emailUser}</p>
          <a class="cerrar-sesion" href=#>Cerrar sesión</a>
        </div>   
        <div class="cruz">
          <img src=${cruz} />
        </div>

      </div>
    </header>
    `;

    style.textContent = `
    img { 
      width: 100%;
    }

    .header {
        height: max-content;
        border-radius: 0px 0px 10px 10px;
        background: var(--color-black);
        display: flex;
        padding: 10px 20px;
        align-items: center;
        justify-content: space-between;
    }
    
    .header__container-nav{
      display: none;
      background: var(--color-black);
      position: absolute;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
      grid-template-rows: 80% auto;
      padding: 0 30px;
    }
    
    .header__container-logo {
      cursor: pointer;
    }

    .header__nav{
      place-self: center;
    }
    
    .header__nav-list{
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 80px;
      justify-content: center;
      align-items: center;
      margin: 0;
      padding: 0;

    }
    .header__nav-list-item{
      text-align: center;
    }

    .cruz{
      width: 40px;
      position: absolute;
      right: 20px;
      top: 20px;
    }

    .link-page{
      text-decoration: none;
      font-size: var(--text-secondary);
      color: #ffff;
      font-weight: 700;
    }

    .indoSession__container{
      place-self: center;
    }

    .cerrar-sesion{
      display: block;
      text-align-last: center;
    }
    
    .menu-burguer{
      height: 40px;
    }
    `;
    this.shadow.appendChild(style);
  }
}

customElements.define("header-component", Header);
