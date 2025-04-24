import Joi from "joi";

const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(5).max(15).required(),
  phone: Joi.string()
  .pattern(/^\d{10,15}$/) // 10 to 15 digits
  .required()
  .messages({
    "string.pattern.base": "Phone number must contain 10 to 15 digits.",
  }),

  email: Joi.string().max(99).required().messages({
    "string.email": "Email must be a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(8).max(15).required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({ "any.only": "Passwords do not match" }),
  role: Joi.string().valid("normal", "store").required().messages({
    "any.only": "Role must be either 'normal' or 'store'",
    "any.required": "Role is required",
  }),
});
const loginSchema = Joi.object({
  email: Joi.alternatives()
    .try(
      Joi.string().email().max(99).messages({
        "string.email": "Email must be a valid email",
      }),
      Joi.string().pattern(/^\+?[0-9]{10,15}$/).messages({
        "string.pattern.base": "Phone number must be valid",
      })
    )
    .required()
    .messages({
      "any.required": "Email or phone number is required",
    }),
  password: Joi.string().min(8).max(15).required(),
});

const updateSchema = Joi.object({
  username: Joi.string().alphanum().min(5).max(15),
  email: Joi.string().max(99).email().messages({
    "string.email": "Email must be a valid email",
  }),
  password: Joi.string().min(6).optional(),
  oldPassword: Joi.string().min(6).optional(),
  isAdmin: Joi.boolean().optional(),
});

export { registerSchema, loginSchema, updateSchema };
