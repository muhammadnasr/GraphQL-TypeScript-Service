import { getRepository } from 'typeorm';
import { PortfolioVersionEntity, VersionType } from '../../src/entities/PortfolioVersionEntity';
import createApolloServer from '../test_helpers/createApolloServer';
import createPortfolioEntity from '../test_helpers/createPortfolioHelper';
import PortfolioEntity from '../../src/entities/PortfolioEntity';

describe('PortfolioVersionResolver', () => {

  let portfolio1: PortfolioEntity;
  beforeAll(async () => {
    portfolio1 = await createPortfolioEntity();
    portfolio1.pages.sort((a, b) => a.id - b.id);
  });

  // tests/resolvers/PortfolioVersionResolver.test.ts
  test('creates a snapshot version from a draft version', async () => {
    const server = createApolloServer();

    const response = await server.executeOperation({
      query: `
        mutation createSnapshotFromPortfolio($portfolioId: Float!) {
          createSnapshotFromPortfolio(portfolioId: $portfolioId) {
            type
            portfolio {
              id
            }
            pageVersions {
              name
              url
            }
          }
        }
      `,
      variables: {
        portfolioId: portfolio1.id,
      },
    });

    // Assert
    expect(response).toGraphQLResponseData({
      createSnapshotFromPortfolio: {
        type: VersionType.SNAPSHOT,
        portfolio: {
          "id": portfolio1.id,
        },
        pageVersions: portfolio1.pages.map(page => ({
          "name": page.name,
          "url": page.url
        })),
      },
    });

    // Fetch the snapshot version from the database (in this test we assume we only have one snapshot version)
    const snapshotPortfolioVersion = await getRepository(PortfolioVersionEntity).findOne({
      where: {
        portfolio: portfolio1,
        type: VersionType.SNAPSHOT
      },
      relations: ["pageVersions", "pageVersions.originalPage"]
    });


    // Assert that the snapshot version has the same number of pages as the draft version
    expect(snapshotPortfolioVersion?.pageVersions.length).toEqual(portfolio1.pages.length);

    // Assert that each page in the snapshot version is linked to the original page in the draft version
    snapshotPortfolioVersion?.pageVersions.forEach((snapshotPage) => {
      const matchingDraftPage = portfolio1.pages.find(originalPage => originalPage.id === snapshotPage.originalPage.id);
      expect(matchingDraftPage).toBeDefined();
    });
  });
});
