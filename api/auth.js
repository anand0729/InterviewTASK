const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const db = require("./../config/database");
const User = db.user;
const Joi = require("@hapi/joi");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
class authAPIs {
  login(data) {
    const schema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().min(5).max(30).required(),
    });

    const errorCheck = schema.validate(data);
    if (errorCheck.error) {
      let response = {
        status: 422,
        data: errorCheck.error.details,
      };
      return Promise.reject(response);
    }

    return User.findOne({
      where: {
        [Op.or]: [{ email: data.username }, { mobile: data.username }],
      },
      attributes: ["id", "name", "email", "mobile", "password"],
    }).then((result) => {
      if (result) {
        return this.checkPassword(result, data.password);
      } else {
        let response = {
          status: 200,
          data: "Invalid Credentials",
        };
        return Promise.reject(response);
      }
    });
  }

  checkPassword(userDetails, password) {
    if (bcrypt.compareSync(password, userDetails.password)) {
      delete userDetails.password;
      const token = jwt.sign(
        {
          userDetails,
        },
        process.env.TokenSecret,
        { expiresIn: "1h" }
      );
      var response = {
        status: 200,
        token: token,
      };
      return Promise.resolve(response);
    } else {
      var response = {
        status: 401,
        msg: "Invalid Credentials",
      };
      return Promise.resolve(response);
    }
  }

  register(data) {
    const schema = Joi.object({
      name: Joi.string().required(),
      mobile: Joi.string().min(10).max(10).required(),
      email: Joi.string().email().min(5).max(50).required(),
      password: Joi.string().min(5).max(30).required(),
    });

    const errorCheck = schema.validate(data);
    if (errorCheck.error) {
      let response = {
        status: 422,
        data: errorCheck.error.details,
      };
      return Promise.reject(response);
    }

    return User.findOne({
      where: {
        [Op.or]: [{ email: data.email }, { mobile: data.mobile }],
      },
      attributes: ["id"],
    }).then((result) => {
      if (result) {
        let response = {
          status: 200,
          data: "User Already Registered!",
        };
        return Promise.resolve(response);
      } else {
        return User.create({
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          password: bcrypt.hashSync(data.password, saltRounds),
        }).then((result) => {
          if (result) {
            var response = {
              status: 200,
              msg: "User Created!",
            };
            return Promise.resolve(response);
          } else {
            var response = {
              status: 400,
              msg: "Error Occured while Creating User",
              error: error,
            };
            return Promise.reject(response);
          }
        });
      }
    });
  }

  tokenRegenerate(dataCame) {
    try {
      let userInfo = jwt.verify(
        dataCame.authorization.split(" ")[1],
        process.env.TokenSecret,
        { ignoreExpiration: true }
      ); //, {ignoreExpiration: true}
      /* console.log(userInfo.userDetails.id); */
      return User.findOne({
        where: {
          id: userInfo.userDetails.id,
          status: "a",
        },
        attributes: [
          "id",
          "name",
          "mobile",
          "email",
          "status",
        ],
      }).then((userDetails) => {
        if (userDetails != null) {
          const token = jwt.sign({ userDetails }, process.env.TokenSecret, {
            expiresIn: "1h",
          });
          var response = {
            status: 200,
            token: token,
          };
        } else {
          var response = {
            status: 401,
            msg: "Invalid User !",
          };
        }
        
        return Promise.resolve(response);
      });
    } catch (error) {
      let response = {
        status: 401,
        error: error,
      };
      return Promise.reject(response);
    }
  }
}

module.exports = authAPIs;
