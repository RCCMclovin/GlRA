import Joi from 'joi';

export const mediaSchema = Joi.object().keys({
  name: Joi.string().min(2).max(100).required(),
  data: Joi.binary().required(),
});