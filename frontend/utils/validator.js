export default function validate(values) {
  // input: values = {field: value, field2: value, ...nFields} example {email: SUKD1600666@segi4u.my, phone: 012 345 6789}
  // output: {field: valid} example {email: true, phone: true}
  // console.log(values)

  const validators = {
    email: value =>
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
        value
      ),
    phone: value => /^\+?6?(?:01[0-46-9]\d{7,8}|0\d{8})$/.test(value),
    postcode: value => /\d{5}/.test(value),
    street: value =>
      /^(\d+) ?([A-Za-z](?= ))? (.*?) ([^ ]+?) ?((?<= )APT)? ?((?<= )\d*)?$/.test(
        value
      ),
    password: value =>
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,100}$/.test(
        value
      ),
    confirmation: value =>
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,100}$/.test(
        value
      ),
    promo: value => true,
    name: value => value.length > 2,
    message: value => value.length > 10,
    city: value => value.length !== 0,
    state: value => value.length !== 0,
  }

  const valid = {}

  // example ['email', 'password'] << map through this array
  Object.keys(values).map(field => {
    // this will be an object with a key of 'email' for example and a true/false. { email: true}
    valid[field] = validators[field](values[field])
  })

  return valid
}
