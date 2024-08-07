import {body} from 'express-validator'

//verifying non empty users fields
export const userValidator = [
  body('name', 'Invalid does not Empty').not().isEmpty(),
  body('email','Inavalid does not Empty').not().isEmpty(),
  body('email', 'Invalid email').isEmail(),
  body('password', 'password does not Empty').not().isEmpty(),
  body('password', 'The minimum password length is 6 characters').isLength({min: 6}),
]
//verifying non empty table fields
export const tableValidator = [
  body('number','Inavalid does not Empty').not().isEmpty(),
  body('capacity','Inavalid does not Empty').not().isEmpty(),
  body('number','Inavalid does not Empty').isLength({max:10})
]
//verifying non empty  fields
export const reservationValidator = [
  body('user_id','Inavalid does not Empty').not().isEmpty().isLength({min:24}),
  body('table_id','Inavalid does not Empty').not().isEmpty().isLength({min:24}),
  body('dateReservationID','Inavalid does not Empty').not().isEmpty().isDate(),
  body('hourReservation','Inavalid does not Empty').not().isEmpty().isDate(),
  
]
