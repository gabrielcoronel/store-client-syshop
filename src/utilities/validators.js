import validator from 'validator'

export const makeNotEmptyChecker = (errorMessage) => {
  const checker = (text) => {
    if (validator.isEmpty(text)) {
      return errorMessage
    }

    return null
  }

  return checker
}

export const checkEmail = (email) => {
  if (!validator.isEmail(email)) {
    return "Correo electrónico inválido"
  }

  return null
}

export const checkPhoneNumber = (phoneNumber) => {
  if (!validator.isMobilePhone(phoneNumber, "es-CR")) {
    return "Número telefónico inválido"
  }

  return null
}
