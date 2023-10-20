import { cloudinary } from "../cloudinary/cloudinary";
import { petsIndex } from "../algolia-db/index";
import { Pet } from "../models/index";
import { User } from "../models";
import { Resend } from "resend";

const resend = new Resend("re_hZRVupSz_EXPZTsYStYBrBXSff9AWoY4b");

export class PetController {
  static async createPet(
    name: string,
    url: string,
    lat: number,
    lng: number,
    placeName: string,
    userId: number
  ) {
    if (!name || !url || !lat || !lng || !userId || !placeName) {
      throw new Error("Incomplete data");
    }

    const pet = await Pet.create({
      name,
      image: url,
      lat,
      lng,
      placeName,
      UserId: userId,
    });

    if (pet) {
      const petAlgolia = await petsIndex
        .saveObject({
          objectID: pet.dataValues.id,
          name: pet.dataValues.name,
          image: pet.dataValues.image,
          placeName: pet.dataValues.placeName,
          _geoloc: {
            lng: pet.dataValues.lng,
            lat: pet.dataValues.lat,
          },
        })
        .wait();
      return petAlgolia;
    }
  }
  static async updatePet(petData, idPet) {
    if (!idPet) {
      throw new Error("idPet required");
    }
    let updateData = { ...petData };

    if (petData.hasOwnProperty("image")) {
      const urlImage = (await this.cloudinaryUpload(petData.image)).urlSecure;
      updateData.image = urlImage;
    }

    try {
      const [affectedRows] = await Pet.update(updateData, {
        where: { id: idPet },
      });

      if (affectedRows === 0) {
        throw new Error(`Pet with id ${idPet} not found`);
      }

      return affectedRows;
    } catch (error) {
      throw error;
    }
  }
  static async cloudinaryUpload(
    urlImage: string
  ): Promise<{ urlSecure: string; publicId: string }> {
    if (!urlImage) {
      throw new Error("Email and password required");
    }

    try {
      const responseCloudinary = await cloudinary.uploader.upload(urlImage, {
        folder: "pets",
      });

      return {
        urlSecure: responseCloudinary.secure_url,
        publicId: responseCloudinary.public_id,
      };
    } catch (error) {
      console.error("Error al subir la imagen a Cloudinary:", error);

      ///continuar aca, fijate el manejo de errores, lee los comentarios de la carpeta cloudinary,
      // funciona bien, ahora este es el controler, falta el end point,
      // que maneje el registro de reportes de mascotas
    }
  }

  static async getMyReports(userId: number): Promise<Pet[]> {
    if (!userId) {
      throw new Error("userId required");
    }
    const myPets = await User.findByPk(userId, { include: "Pets" });

    return myPets.dataValues.Pets;
  }

  static async getAllPets(): Promise<Pet[]> {
    try {
      const pet = await Pet.findAll();

      return pet;
    } catch (error) {
      throw new Error("Pet not exists or id incorrect");
    }
  }
  static async getAroundPets(lat, lng) {
    try {
      const hits = await petsIndex.search("", {
        aroundLatLng: [lat, lng].join(","),
        aroundRadius: 10000,
      });

      return hits.hits;
    } catch (error) {
      throw new Error("no pets around");
    }
  }
  static async getPetById(petId: number): Promise<Pet> {
    if (!petId) {
      throw new Error("petId required");
    }

    try {
      const pet = await Pet.findByPk(petId);

      return pet;
    } catch (error) {
      throw new Error("Pet not exists or id incorrect");
    }
  }

  static async deletePet(petId: number) {
    if (!petId) {
      throw new Error("petId required");
    }

    const response = await Pet.destroy({
      where: {
        id: petId,
      },
    });

    if (response) {
      const petAlgolia = await petsIndex.deleteObject(petId.toString());
      return petAlgolia;
    } else {
      throw new Error("Pet not exists or id incorrect");
    }
  }

  static async sendReport(name, telephone, location, currentPet) {
    if (!name || !telephone || !location || !currentPet) {
      throw new Error("All data required");
    }
    try {
      const user = await User.findByPk(currentPet.UserId);
      const data = await resend.emails.send({
        from: "Pet Finder <onboarding@resend.dev>",
        to: [user.dataValues.email],
        subject: "Nuevo reporte para tu mascota!",
        html: `<h2>Hola ${user.dataValues.name}!,</h2>
            <p>${name} ha visto a ${currentPet.name} y ha dejado sus datos para que te contactes:<br><br>
            Teléfono: <strong>${telephone}</strong><br>
            Visto por última vez: <strong>${location}</strong></p>
            <p>Esperamos que esta información te sea útil. Agradecemos la colaboración de ${name} en la búsqueda de tu mascota.</p>
            <p>¡Saludos cordiales!</p>
        `,
      });

      return data;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }
}
