import { User } from "../models";

export class UserController {
  static async createUser(
    name: string,
    email: string
  ): Promise<[User, boolean]> {
    if (!name || !email) {
      throw new Error("incomplete data");
    }

    const [user, created] = await User.findOrCreate({
      where: { email },
      defaults: { name, email },
    });

    return [user, created];
  }

  static async getUserbyId(id: number): Promise<User> {
    if (!id) {
      throw new Error("incomplete data");
    }
    const user = User.findByPk(id);
    if (user === null) {
      throw new Error("User not exists!");
    } else {
      return user;
    }
  }

  static async updateUser(
    id: number,
    userData: {
      name: string;
      location: { placeName: string; geoloc: { lat: number; lng: number } };
    }
  ) {
    if (!id) {
      throw new Error("UserId required");
    }
    const user = await User.findByPk(id);
    let updatedUser;
    if (userData.name && userData.location) {
      updatedUser = await user.update({
        name: userData.name,
        placeName: userData.location.placeName,
        lat: userData.location.geoloc.lat,
        lng: userData.location.geoloc.lng,
      });
      return updatedUser;
    } else if (userData.name && !userData.location) {
      updatedUser = await user.update({ name: userData.name });
      return updatedUser;
    } else if (userData.location && !userData.name) {
      updatedUser = await user.update({
        placeName: userData.location.placeName,
        lat: userData.location.geoloc.lat,
        lng: userData.location.geoloc.lng,
      });
      return updatedUser;
    } else {
      throw new Error("Data not sent to update ");
    }
  }
}

//User.sync({ force: true }).then((e) => console.log(e));
