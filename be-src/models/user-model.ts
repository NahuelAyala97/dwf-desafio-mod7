import { Model, DataTypes } from "sequelize";
import { sequelize } from "./connection";

class User extends Model {}

User.init(
  {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    placeName: {
      type: DataTypes.STRING,
    },
    lat: {
      type: DataTypes.FLOAT,
    },
    lng: {
      type: DataTypes.FLOAT,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "User", // We need to choose the model name
  }
);
// User.sync({ force: true }).then((res) => {
//   console.log(res);
// });
export { User };
