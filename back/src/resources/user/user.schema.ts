import Joi from 'joi';

export const userSchema = Joi.object().keys({
  name: Joi.string().min(3).max(40).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(3).max(40),
});

export const SearchUserSchema = Joi.object().keys({
  name: Joi.string().max(40),
  email: Joi.string(),
});