import Joi from 'joi';

export const findingSchema = Joi.object().keys({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(3).max(600).required(),
  solution: Joi.string().min(3).max(600).required(),
  categoryId: Joi.string().uuid().required(),
  severityId: Joi.string().uuid().required(),
  statusId: Joi.string().uuid().required(),
  assignedId: Joi.string().uuid().required(),
  projectId: Joi.string().uuid().required(),
});

export const updateFindingSchema = Joi.object().keys({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(3).max(600).required(),
  solution: Joi.string().min(3).max(600).required(),
  categoryId: Joi.string().uuid().required(),
  severityId: Joi.string().uuid().required(),
  statusId: Joi.string().uuid().required(),
  assignedId: Joi.string().uuid().required(),
});