import Joi from 'joi';

export const projectSchema = Joi.object().keys({
  title: Joi.string().min(3).max(40).required(),
  description: Joi.string().min(3).max(600).required()
});