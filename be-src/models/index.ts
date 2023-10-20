import { Auth } from "./auth-model";
import { User } from "./user-model";
import { Pet } from "./pet-model";
import { sequelize } from "./connection";

User.hasMany(Pet);
Pet.belongsTo(User);

// sequelize.sync({ force: true }).then((res) => {
//   console.log(res);
// });

export { Auth, User, Pet };
