const formatMoney = (amount = 0, divide) => {
  const withoutFraction = new Intl.NumberFormat("ms-my", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  const withFraction = new Intl.NumberFormat("ms-my", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  })
  if (divide) amount = amount / 100

  if (amount % 1 === 0) {
    // no cents
    // console.log(
    //   `${amount} % 1 is ${amount % 1} it is ${
    //     amount % 1 == 0
    //   } so use withoutFraction`
    // );
    // console.log(withoutFraction.format(amount));
    return withoutFraction.format(amount)
  } else {
    // with cents
    // console.log(
    //   `${amount} % 1 is ${amount % 1} it is ${
    //     amount % 1 == 0
    //   } so use withFraction`
    // );
    // console.log(withFraction.format(amount));
    return withFraction.format(amount)
  }
}

export default formatMoney
