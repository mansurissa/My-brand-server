/* eslint-disable consistent-return */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import passport from 'passport';
import errorRes from '../helpers/errorHandler.js';
import successHandler from '../helpers/success.js';
import User from '../models/usersModel.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const validEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  try {
    if (!email.match(validEmail)) {
      return errorRes(res, 400, 'your email is not valid');
    }
    if (name.length < 1) {
      return errorRes(res, 400, 'name is too short');
    }
    if (password.length < 6) {
      return errorRes(res, 400, 'password is too short');
    }

    await bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        throw new Error();
      }

      const user = await User.create({
        name,
        email,
        password: hash,
      });
      return successHandler(res, 201, 'Created Successfully', user);
    });
  } catch (error) {
    console.log(error);
    return errorRes(res, 500, 'There was problem Registering');
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const foundUser = await User.find({ email });
  if (foundUser) {
    try {
      await bcrypt.compare(password, foundUser[0].password, (err, result) => {
        if (result) {
          const token = jwt.sign(
            { email: foundUser[0].email, id: foundUser[0]._id },
            process.env.JWT_KEY,
            {
              expiresIn: '1h',
            },
          );
          return successHandler(res, 200, 'succesfull loged in', {
            user: foundUser,
            token,
          });
        }
      });
    } catch (error) {
      return errorRes(res, 500, 'Failed to login');
    }
  } else {
    return errorRes(res, 404, 'Email or password is invalid');
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    successHandler(res, 200, 'all users fetched successfully', {
      totalUsers: users.length,
      users,
    });
  } catch (error) {
    return errorRes(res, 500, 'failed to get users');
  }
};
export const getOneUSer = async (req, res) => {
  try {
    const foundUser = await User.findById(req.params.id);
    if (!foundUser) return errorRes(res, 404, 'User not found');
    return successHandler(res, 200, 'Successfully got one user', foundUser);
  } catch (error) {
    return errorRes(res, 500, 'there was problem getting user ');
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params._id;
  try {
    const foundUser = await User.findOne(id);
    if (!foundUser) {
      return errorRes(res, 404, 'cant find that User');
    }
    await foundUser.deleteOne();
    return successHandler(res, 200, 'Deleted post successfully');
  } catch (error) {
    return errorRes(res, 500, 'There was error deleting post');
  }
};
