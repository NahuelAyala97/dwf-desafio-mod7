import * as path from "path";
import { UserController } from "./controllers/user-controller";
import { AuthController } from "./controllers/auth-controller";
import { PetController } from "./controllers/pets-controller";

const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(cors());
const port = 3000;

app.post("/auth", async (req, res) => {
  if (!req.body) {
    res.sendStatus(400);
  }
  const { name, email, password } = req.body;
  const user = await UserController.createUser(name, email);

  if (user[1] === false) {
    res.status(401).json({ userCreated: false });
  } else {
    const user_id = user[0].dataValues.id;
    const auth = await AuthController.createAuth(email, password, user_id);

    res.status(200).json({ userCreated: auth[1] });
  }
});

app.post("/auth/token", async (req, res) => {
  if (!req.body) {
    res.sendStatus(400);
  }
  const { email, password } = req.body;

  try {
    const token = await AuthController.sessionToken(email, password);
    res.json(token);
  } catch (error) {
    console.log(error);
    res.sendStatus(401);
  }
});

app.patch("/auth/edit", AuthController.authMiddleware, async (req, res) => {
  const userId = req._user.userId;
  const data = req.body;

  try {
    const auth = await AuthController.updatedAuth(userId, data);
    res.json(auth);
  } catch {
    res.sendStatus(401);
  }
});

app.get("/me", AuthController.authMiddleware, async (req, res) => {
  const userId = req._user.userId;

  try {
    const user = await UserController.getUserbyId(userId);
    res.json(user);
  } catch {
    res.sendStatus(401);
  }
});

app.patch("/me/edit", AuthController.authMiddleware, async (req, res) => {
  const userId = req._user.userId;
  const data = req.body;

  try {
    const user = await UserController.updateUser(userId, data);
    res.json(user);
  } catch {
    res.sendStatus(400);
  }
});

app.post("/pet/create", AuthController.authMiddleware, async (req, res) => {
  const userId = req._user.userId;
  const data = req.body;

  try {
    const responseCloudinary = await PetController.cloudinaryUpload(data.image);
    const pet = await PetController.createPet(
      data.name,
      responseCloudinary.urlSecure,
      data.location.geoData.lat,
      data.location.geoData.lng,
      data.location.placeName,
      userId
    );
    return res.status(200).json({ pet });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

app.get("/pet/report/me", AuthController.authMiddleware, async (req, res) => {
  const userId = req._user.userId;

  try {
    const mypets = await PetController.getMyReports(userId);
    return res.status(200).json({ mypets });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

app.get("/pets", async (req, res) => {
  try {
    const pets = await PetController.getAllPets();
    return res.status(200).json({ pets });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

//GET /pets/around?lat&lng
app.get("/pets/around", async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const pets = await PetController.getAroundPets(lat, lng);
    return res.status(200).json({ pets });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

app.get("/pet/:petId", AuthController.authMiddleware, async (req, res) => {
  const petId = req.params.petId;

  try {
    const pet = await PetController.getPetById(petId);
    return res.status(200).json(pet);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

app.patch("/pet/edit/:id", AuthController.authMiddleware, async (req, res) => {
  const petId = req.params.id;
  const data = req.body.dataPet;
  try {
    const pet = await PetController.updatePet(data, petId);
    return res.status(200).json(pet);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

app.delete("/pet/delete", AuthController.authMiddleware, async (req, res) => {
  const petId = req.body.petId;
  try {
    const pet = await PetController.deletePet(petId);
    res.status(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

app.post("/sendReport", AuthController.authMiddleware, async (req, res) => {
  const { name, telephone, location, currentPet } = req.body;
  try {
    const response = await PetController.sendReport(
      name,
      telephone,
      location,
      currentPet
    );
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

app.get("*", (req, res) => {
  const ruta = path.resolve(__dirname, "../dist/index.html");
  // res.sendfile();
  res.sendFile(ruta);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
