import { state } from "../state";
import { Router } from "@vaadin/router";
import Dropzone from "dropzone";
import { mapBox } from "../lib/mapbox";

class ReportPage extends HTMLElement {
  constructor() {
    super();
  }
  pet: any = {};
  connectedCallback() {
    if (!state.sessionToken()) {
      Router.go("/authorization");
    }
    this.render();
    this.addListener();
    this.dropzone();
    const containerMap = this.querySelector(".map-container") as any;
    mapBox(containerMap);
    this.submitData();
  }

  dropzone() {
    const el = this.querySelector(".button-upload") as any;
    const preview = this.querySelector(".preview") as any;
    const elementTemplate = `
    <div class="dz-preview dz-file-preview">
        <div class="dz-details">
            <img data-dz-thumbnail />
            <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
            <div class="dz-error-message"><span data-dz-errormessage></span></div>
        </div>
    </div>`;

    el.addEventListener("click", () => {
      const element = preview.querySelector(".dz-preview") as any;

      if (element) {
        element.remove();
      }
    });

    let myDropzone = new Dropzone(el, {
      url: "/",
      autoProcessQueue: false,
      previewTemplate: elementTemplate,
      previewsContainer: preview,
      maxfiles: 1,
      acceptedFiles: "image/*",
    });

    myDropzone.on("thumbnail", (file) => {
      const dataURL = file.dataURL;
      this.pet.image = dataURL;
    });
  }
  submitData() {
    const containerMap = this.querySelector(".map-container") as any;
    containerMap.addEventListener("location", (e) => {
      this.pet.location = e.detail;
    });

    const submit = this.querySelector(".button-report") as HTMLElement;

    const inputName = this.querySelector(
      ".input-name"
    )?.shadowRoot?.querySelector(".input") as any;

    submit?.addEventListener("click", async (e) => {
      const name = inputName.value;
      this.pet.name = name;
      if (this.camposCompletos()) {
        // Todos los campos están completos
        const pet = await state.createPet(this.pet);

        if (pet) {
          this.message(submit, "Mascota Reportada!!", "green");
        } else {
          this.message(submit, "Error al gurdar, intente nuevamente", "red");
        }
      } else {
        // Faltan campos requeridos, muestra un mensaje de error
        this.message(submit, "Todos los campos son requeridos", "red");
        console.error("Faltan campos requeridos");
      }
    });
  }
  camposCompletos() {
    return (
      this.pet.name &&
      this.pet.location &&
      this.pet.location.geoData.lat !== undefined &&
      this.pet.location.geoData.lng !== undefined &&
      this.pet.image
    );
  }
  message(el: HTMLElement, text: string, color: string) {
    const message = this.querySelector(".message") as any;

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
      message.style.color = color;
    }
  }
  addListener() {
    const cancelEl = this.querySelector(".button-cancel") as HTMLElement;

    cancelEl.addEventListener("click", () => {
      Router.go("/");
    });
  }
  render() {
    const style = document.createElement("style");

    this.innerHTML = `
   <div class="page">
      <header-component></header-component>
      <div class="home">
        <title-subtitle class="text" title="Reportar mascota" subtitle="Ingresá la siguiente información para realizar el reporte de la mascota"></title-subtitle>
        <form class="container-form">
          <input-custom class="input-name" type="text" label="NOMBRE"></input-custom>
          <div class="preview"></div>
          <button-custom class="button-upload" background="--color-blue">Agregar foto</button-custom>
          <p class="text-map">Buscá un punto de referencia para reportar la mascota. Por ejemplo, la ubicación donde lo viste por última vez.</p>
          <div class="map-container" id='map'></div>
          <button-custom class="button-report" background="--color-green">Reportar mascota</button-custom>
          <button-custom class="button-cancel" background="--color-black">Cancelar</button-custom>        
        </form>
      </div>
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
      }
      
      .text{
        margin: 50px 0;
      }
  
      .container-form{
        flex: 1;
        overflow: hidden;
        display: grid;
        gap: 25px;
        margin-bottom: 40px;
      } 
      
      .preview {
        width: 100%;
        min-height: 200px;
        border: 2px dashed #ccc;
        background-color: #f7f7f7;
        font-size: 16px;
        color: #333;
        overflow: hidden
      }

      .dz-preview img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .text-map{
        margin: 0;
        font-size: var(--text-body);
        text-align: center;
        font-weight: 400;
      }

      .map-container{
        width: 100%;
        min-height: 350px;
      }

  `;

    this.appendChild(style);
  }
}

customElements.define("report-page", ReportPage);
