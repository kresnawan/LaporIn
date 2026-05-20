import "dotenv/config";
import query from "../db/query.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const refreshTokenKey = process.env.REFRESH_TOKEN_KEY;
const accessTokenKey = process.env.ACCESS_TOKEN_KEY;

export const handleLogin = (req, res) => {
  let email;
  let password;

  try {
    email = req.body.email;
    password = req.body.password;
  } catch (error) {
    return res.status(400).send("Request body tidak lengkap")
  }

  query(`
		SELECT 
			user_id, email, role_id, password
		FROM 
			user
		WHERE 
			email = ?
		`, [email])
    .then((resultQuery) => {
      const results = resultQuery.results;
      if (!results[0]) return res.status(404).send("Email tidak ditemukan");

      const data = results[0];
      bcrypt.compare(password, data.password, (err, hash) => {
        if (err) return res.send(err);
        if (!hash) return res.status(401).send("Password salah");

        var accessToken = jwt.sign(
          {
            userId: data.user_id,
            email: data.email,
            userRole: data.role_id,
          },
          accessTokenKey,
          {
            expiresIn: 15,
          }
        );

        var refreshToken = jwt.sign(
          {
            userId: data.user_id,
            email: data.email,
            userRole: data.role_id,
          },
          refreshTokenKey,
          {
            expiresIn: 60 * 60 * 24 * 30,
          }
        );

        var cookieExpires = new Date(Date.now() + 2592000000);

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          domain: "localhost",
          expires: cookieExpires,
        });
        return res.send({token: accessToken, user_id: data.user_id, user_role: data.role_id});
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

export const handleRegister = (req, res) => {
  const saltRounds = 12;
  var { email, first_name, last_name, password, is_admin } = req.body;

  if (is_admin) {
    if (!req.userId || req.userRole !== 1) {
      return res.status(403).send("Tidak dapat membuat akun admin");
    }
  }

  query(`
		SELECT 
			user_id
		FROM 
			user
		WHERE 
			email = ?
		`, [email])
    .then((resultQuery) => {
      const results = resultQuery.results;
      if (results[0]) {
        return res.status(400).send("Email telah dipakai");
      }

      bcrypt.hash(password, saltRounds, (err, hash) => {

        if (err) return res.status(500);

        query(
          `INSERT INTO 
            user 
            (email, first_name, last_name, password, role_id) 
          VALUES 
            (?, ?, ?, ?, ?)`
        , [email, first_name, last_name, hash, is_admin ? '2' : '3'])
          .then(() => {
            return res.send("Akun berhasil dibuat");
          })
          .catch((err) => {
            return res.status(500).send(err);
          });
      });
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
}

export const handleLogout = (req, res) => {
  const refreshTokenCookie = req.cookies.refreshToken;

  if (!refreshTokenCookie) return res.status(401).send("Anda belum login");

  res.clearCookie("refreshToken").send("Anda telah logout");
}

export const handleRenewToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return res
      .status(403)
      .send("Refresh token tidak ditemukan");

  jwt.verify(refreshToken, refreshTokenKey, (err, results) => {
    if (err)
      return res.status(403).send("Refresh token tidak valid");

    var accessToken = jwt.sign(
      {
        userId: results.userId,
        email: results.email,
        userRole: results.userRole,
      },
      accessTokenKey,
      {
        expiresIn: 10,
      }
    );

    return res.send({token: accessToken, user_id: results.userId, user_role: results.userRole});
  });
}