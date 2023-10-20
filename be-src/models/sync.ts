import { sequelize } from "./connection";

sequelize.sync({ force: true }).then((res) => {
  console.log(res);
});
