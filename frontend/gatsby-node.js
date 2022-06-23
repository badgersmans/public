/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const results = await graphql(
    `
      {
        products: allStrapiProduct {
          edges {
            node {
              name
              strapiId
              description
              category {
                name
              }
              product_variants {
                id
                color
                size
                style
                price
                images {
                  url
                }
                quantity
              }
            }
          }
        }
        categories: allStrapiCategory {
          edges {
            node {
              strapiId
              name
              description
              filterOptions {
                Color {
                  label
                  checked
                }
                Size {
                  label
                  checked
                }
                Style {
                  label
                  checked
                }
              }
            }
          }
        }
      }
    `
  )

  if (results.errors) {
    throw results.errors
  }

  const products = results.data.products.edges
  console.log(products)
  const categories = results.data.categories.edges

  products.forEach(product => {
    createPage({
      path: `/${product.node.category.name.toLowerCase()}/${
        product.node.name.split(" ")[0]
      }`,
      component: require.resolve("./src/templates/ProductDetail"),
      context: {
        id: product.node.strapiId,
        name: product.node.name,
        description: product.node.description,
        productVariants: product.node.product_variants,
        category: product.node.category.name,
        product,
      },
    })
  })

  categories.forEach(category => {
    createPage({
      path: `/${category.node.name.toLowerCase()}`,
      component: require.resolve("./src/templates/ProductList"),
      context: {
        name: category.node.name,
        description: category.node.description,
        id: category.node.strapiId,
        filterOptions: category.node.filterOptions,
      },
    })
  })
}
