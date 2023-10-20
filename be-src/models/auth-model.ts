import { Model, DataTypes } from "sequelize";
import { sequelize } from "./connection";

class Auth extends Model {}

Auth.init(
  {
    // Model attributes are defined here
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "Auth", // We need to choose the model name
  }
);

// Auth.sync({ force: true }).then((res) => {
//   console.log(res);
// });
export { Auth };
