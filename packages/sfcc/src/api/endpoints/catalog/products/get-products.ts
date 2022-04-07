import { normalizeSearchProducts } from '../../../utils/normalise-product';
import { ProductsEndpoint } from '.'


const getProducts: ProductsEndpoint['handlers']['getProducts'] = async ({
  req,
  res,
  body: { search, categoryId, brandId, sort },
  config
}) => {
  const { sdk  } = config;

  let searchTerm = search;

  if (categoryId) {
    searchTerm = categoryId as string
  }

  const searchClient = await sdk.getSearchClient();
  // use SDK search API for initial products
  const searchResults = await searchClient.productSearch({
      parameters: {
          q: searchTerm,
          limit: 20
      }
  });
  let products = [];
  let found = false;
  if (searchResults.total) {
      found = true;
      products = normalizeSearchProducts(searchResults.hits) as any[];
  } else {
      // TODO: handle this better?
      console.log("No results for search");
  }


  res.status(200).json({ data: { products, found } })
}

export default getProducts
