export const alphabetic = (data, direction) =>
  data.sort((a, b) => {
    console.log(`what is data? ->`, data)
    console.log(`what is a? ->`, a)
    console.log(`what is b? ->`, b)

    const first = a.node.name.toLowerCase()
    const second = b.node.name.toLowerCase()
    console.log(`what is first? ->`, first)
    console.log(`what is second? ->`, second)

    const x = direction === "asc" ? first : second
    const y = direction === "asc" ? second : first
    console.log(`what is x? ->`, x)
    console.log(`what is y? ->`, y)

    //   so if direction === 'asc' then
    if (x < y) return -1
    if (x > y) return 1
    return 0
  })

export const timestamp = (data, direction) =>
  data.sort((a, b) => {
    console.log(`what is a? ->`, a)
    console.log(`what is b? ->`, b)

    const first = new Date(a.node.createdAt)
    const second = new Date(b.node.createdAt)
    console.log(`what is first? ->`, first)
    console.log(`what is second? ->`, second)

    const x = direction === "asc" ? second : first
    const y = direction === "asc" ? first : second
    console.log(`what is x? ->`, x)
    console.log(`what is y? ->`, y)

    // -1 means newer date
    // 1 means older date
    if (x < y) return -1
    if (x > y) return 1
    return 0
  })

export const price = (data, direction) =>
  data.sort((a, b) => {
    console.log(`what is a? ->`, a)
    console.log(`what is b? ->`, b)

    const first = a.node.product_variants[0].price
    const second = b.node.product_variants[0].price
    console.log(`what is first? ->`, first)
    console.log(`what is second? ->`, second)

    const x = direction === "asc" ? second : first
    const y = direction === "asc" ? first : second
    console.log(`what is x? ->`, x)
    console.log(`what is y? ->`, y)

    // if (direction === "asc") {
    //   return x - y
    // } else {
    //   return y - x
    // }

    // -1 means a is going to come first
    // 1 means b is going to come first
    if (x < y) return -1
    if (x > y) return 1
    return 0
  })
