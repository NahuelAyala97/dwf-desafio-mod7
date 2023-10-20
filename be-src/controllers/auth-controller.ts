import { Auth } from "../models";
import * as jwt from "jsonwebtoken";
import * as crypto from "crypto";

//process.env.JWT
const JWT = "PALABRASECRETA";

//funcion para hashear un string
function getHash256ofString(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export class AuthController {
  static async createAuth(
    email: string,
    password: string,
    user_id: number
  ): Promise<[Auth, Boolean]> {
    if (!email || !password || !user_id) {
      throw new Error("incomplete data");
    }
    const hash = getHash256ofString(password);

    const [auth, created] = await Auth.findOrCreate({
      where: { email, password: hash },
      defaults: { email, password: hash, user_id },
    });
    return [auth, created];
  }

  static async sessionToken(email: string, password: string): Promise<string> {
    if (!email || !password) {
      throw new Error("Email and password required");
    }

    const hash: string = getHash256ofString(password);
    const user = await Auth.findOne({ where: { email, password: hash } });
    //userId: user.dataValues.user_id
    if (user) {
      const token = jwt.sign({ userId: user.dataValues.user_id }, JWT);
      return token;
    } else {
      throw new Error("Email or password incorrect");
    }
  }

  static async authMiddleware(req, res, next) {
    const authHeader = req.get("Authorization").split(" ");
    const withoutQuote = authHeader[1].replace(/"/g, "");
    if (authHeader[0] == "bearer") {
      const data = jwt.verify(withoutQuote, JWT);
      req._user = data;
      next();
    } else {
      res.sendStatus(401);
    }
  }

  static async updatedAuth(
    id: number,
    userData: { email: string; password: string }
  ): Promise<Auth> {
    if (!id) {
      throw new Error("UserId required");
    }
    const auth = await Auth.findByPk(id);

    let updatedAuth;
    if (userData.password && userData.email) {
      updatedAuth = await auth.update({
        password: getHash256ofString(userData.password),
        email: userData.email,
      });
      return updatedAuth;
    } else if (userData.password && !userData.email) {
      updatedAuth = await auth.update({
        password: getHash256ofString(userData.password),
      });
      return updatedAuth;
    } else if (userData.email && !userData.password) {
      updatedAuth = await auth.update({
        email: userData.email,
      });

      return updatedAuth;
    } else {
      throw new Error("Data not sent to update ");
    }
  }
}
