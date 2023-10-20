import { Sequelize } from "sequelize";

// Option 1: Passing a connection URI
export const sequelize = new Sequelize(process.env.SEQUELIZE_URI);

(async function main() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
