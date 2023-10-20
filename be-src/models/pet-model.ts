import { Model, DataTypes } from "sequelize";
import { sequelize } from "./connection";

class Pet extends Model {}

Pet.init(
  {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
    },
    lat: {
      type: DataTypes.FLOAT,
    },
    lng: {
      type: DataTypes.FLOAT,
    },
    placeName: {
      type: DataTypes.STRING,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "Pet", // We need to choose the model name
  }
);

// Pet.sync({ force: true }).then((res) => {
//   console.log(res);
// });

export { Pet };
