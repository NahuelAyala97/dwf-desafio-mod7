import { geoCoding } from "./lib/mapbox";

let URL_API_BASE;
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV == "production") {
  URL_API_BASE = "https://pet-finder-14nm.onrender.com";
} else {
  URL_API_BASE = "http://localhost:3000";
}

export const state = {
  data: {
    user: {},
    currentPet: {},
  },
  listeners: [],
  setEmail(email: string) {
    const cs = this.getState();
    cs.user.email = email;
    this.setState(cs);
  },
  sessionToken(): string {
    const savedToken = sessionStorage.getItem("token");
    if (savedToken) {
      return `bearer ${savedToken}`;
    } else {
      return "";
    }
  },
  sessionData() {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      return JSON.parse(userData);
    } else {
      return "";
    }
  },
  async signUp(
    name: string,
    email: string,
    password: string
  ): Promise<Boolean> {
    try {
      const response = await fetch(URL_API_BASE + "/auth", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      if (!response.ok) {
        console.log(
          `Error en la solicitud: ${response.status} ${response.statusText}`
        );
        return false;
      }

      const data = await response.json();
      if (data.userCreated == true) {
        await this.signIn(email, password);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  async signIn(email: string, password: string) {
    const cs = this.getState();
    try {
      const response = await fetch(URL_API_BASE + "/auth/token", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        console.log(
          `Error en la solicitud: ${response.status} ${response.statusText}`
        );
        return false;
      }
      const data = await response.json();
      sessionStorage.setItem("token", JSON.stringify(data));
      this.setState(cs);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  signOut() {
    const cs = this.getState();
    sessionStorage.clear();
    this.setState(cs);
  },
  async getProfile(): Promise<Boolean> {
    const cs = this.getState();
    const token = this.sessionToken();
    try {
      const response = await fetch(URL_API_BASE + "/me", {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });

      const data = await response.json();
      cs.user = data;
      this.setState(cs);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  async updateProfile(name?: string, placeName?: string) {
    const cs = this.getState();
    const location = placeName ? await geoCoding(placeName) : null;
    try {
      const response = await fetch(URL_API_BASE + "/me/edit", {
        method: "PATCH",
        headers: {
          Authorization: this.sessionToken(),
          "content-type": "application/json",
        },
        body: JSON.stringify({ name, location }),
      });
      const data = await response.json();
      await this.getProfile();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  async updatePassword(password: string) {
    try {
      const response = await fetch(URL_API_BASE + "/auth/edit", {
        method: "PATCH",
        headers: {
          Authorization: this.sessionToken(),
          "content-type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      console.log(data);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  async createPet(pet: {}) {
    try {
      const response = await fetch(URL_API_BASE + "/pet/create", {
        method: "POST",
        headers: {
          Authorization: this.sessionToken(),
          "content-type": "application/json",
        },
        body: JSON.stringify(pet),
      });
      const data = await response.json();
      console.log(data);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  async getAllPets() {
    try {
      const response = await fetch(URL_API_BASE + "/pets", {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  async getAroundPets() {
    const cs = this.getState();
    const lat = cs.user.lat;
    const lng = cs.user.lng;
    try {
      const response = await fetch(
        URL_API_BASE + `/pets/around?lat=${lat}&lng=${lng}`,
        {
          method: "GET",
          headers: {
            Authorization: this.sessionToken(),
            "content-type": "application/json",
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  async getMyReports() {
    try {
      const response = await fetch(URL_API_BASE + "/pet/report/me", {
        method: "GET",
        headers: {
          Authorization: this.sessionToken(),
          "content-type": "application/json",
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  async getPetById(petId) {
    const cs = this.getState();
    try {
      const response = await fetch(URL_API_BASE + `/pet/${petId}`, {
        method: "GET",
        headers: {
          Authorization: this.sessionToken(),
        },
      });
      const pet = await response.json();
      cs.currentPet = pet;
      this.setState(cs);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  async updatePet(dataPet: {}, petId) {
    const cs = this.getState();
    try {
      const response = await fetch(URL_API_BASE + `/pet/edit/${petId}`, {
        method: "PATCH",
        headers: {
          Authorization: this.sessionToken(),
          "content-type": "application/json",
        },
        body: JSON.stringify({ dataPet }),
      });
      const pet = await response.json();
      cs.currentPet = pet;
      this.setState(cs);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  async reportAsFound(petId) {
    const cs = this.getState();

    try {
      const response = await fetch(URL_API_BASE + `/pet/delete`, {
        method: "DELETE",
        headers: {
          Authorization: this.sessionToken(),
          "content-type": "application/json",
        },
        body: JSON.stringify({ petId }),
      });
      const pet = await response.json();
      return pet;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  async sendEmail(name, telephone, location, currentPet) {
    try {
      const response = await fetch(URL_API_BASE + `/sendReport`, {
        method: "POST",
        headers: {
          Authorization: this.sessionToken(),
          "content-type": "application/json",
        },
        body: JSON.stringify({ name, telephone, location, currentPet }),
      });

      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  getState() {
    return this.data;
  },
  setState(newState) {
    // modifica this.data (el state) e invoca los callbacks
    this.data = newState;
    sessionStorage.setItem("user", JSON.stringify(newState));
    //console.log("soy el nuevo state", newState);
    for (const cb of this.listeners) {
      cb(newState);
    }
  },
  subscribe(callback: (any) => any) {
    // recibe callbacks para ser avisados posteriormente
    this.listeners.push(callback);
  },
};
