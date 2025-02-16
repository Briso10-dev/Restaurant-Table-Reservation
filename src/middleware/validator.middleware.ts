import {body} from 'express-validator'

//verifying non empty users fields
export const userValidator = [
  body('name', 'Invalid should not be Empty').not().isEmpty(),
  body('name', 'Invalid should be in capital letters').toUpperCase(),
  body('email','Inavalid should not be Empty').not().isEmpty(),
  body('email', 'Invalid email').isEmail(),
  body('password', 'password does not Empty').not().isEmpty(),
  body('password', 'The minimum password length is 6 characters').isLength({min: 6}),
]
//verifying non empty table fields
export const tableValidator = [
  body('number','Inavalid should not be Empty').not().isEmpty(),
  body('number','Inavalid should be an integer').isInt(),
  body('number','Must be at least 10 characters').isLength({max:10}),
  body('capacity','Inavalid does not Empty').not().isEmpty(),
  body('capacity','Inavalid should be an integer').isInt(),
]
//verifying non empty  fields
export const reservationValidator = [
  body('user_id','should be a valid userid').not().isEmpty().isMongoId(),
  body('table_id','should be a valid table_id').not().isEmpty().isMongoId(),
  body('dateReservation','Inavalid should not be Empty').not().isEmpty(),
  body('hourReservation','Inavalid should not be Empty').not().isEmpty(),
  
]
