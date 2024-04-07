import PortfolioEntity from '../../src/entities/PortfolioEntity';
import createApolloServer from '../test_helpers/createApolloServer';
import createPortfolioEntity from '../test_helpers/createPortfolioHelper';

describe('ListPortfoliosResolver', () => {

  let portfolio1: PortfolioEntity;
  let portfolio2: PortfolioEntity;
  let portfolio3: PortfolioEntity;
  beforeAll(async () => {
    portfolio1 = await createPortfolioEntity();
    portfolio2 = await createPortfolioEntity();
    portfolio3 = await createPortfolioEntity();
    portfolio1.pages.sort((a, b) => a.id - b.id);
    portfolio2.pages.sort((a, b) => a.id - b.id);
    portfolio3.pages.sort((a, b) => a.id - b.id);
  });


  // tests/resolvers/ListPortfoliosResolver.test.ts
  test('return 3 items without pages', async () => {
    const server = createApolloServer();
    const response = await server.executeOperation({
      query: `query {
                listPortfolios {
                  id
                  name
                }
              }`,
      variables: {},
    });
    expect(response).toGraphQLResponseData({
      listPortfolios: [
        {
          id: portfolio1.id,
          name: portfolio1.name,
        },
        {
          id: portfolio2.id,
          name: portfolio2.name,
        },
        {
          id: portfolio3.id,
          name: portfolio3.name,
        },
      ],
    });
  });

  // tests/resolvers/ListPortfoliosResolver.test.ts
  test('return 3 items with pages', async () => {
    const server = createApolloServer();
    const response = await server.executeOperation({
      query: `query ListPortfolios {
                listPortfolios {
                  id
                  name
                  url
                  pages {
                    id
                    name
                    url
                  }
                }
              }`,
      variables: {},
    });
    expect(response).toGraphQLResponseData({
      listPortfolios: [
        {
          id: portfolio1.id,
          name: portfolio1.name,
          url: portfolio1.url,
          pages: portfolio1.pages.map(page => ({
            "id": page.id,
            "name": page.name,
            "url": page.url
          })),
        },
        {
          id: portfolio2.id,
          name: portfolio2.name,
          url: portfolio2.url,
          pages: portfolio2.pages.map(page => ({
            "id": page.id,
            "name": page.name,
            "url": page.url
          })),
        },
        {
          id: portfolio3.id,
          name: portfolio3.name,
          url: portfolio3.url,
          pages: portfolio3.pages.map(page => ({
            "id": page.id,
            "name": page.name,
            "url": page.url
          })),
        },
      ],
    });
  });
});
