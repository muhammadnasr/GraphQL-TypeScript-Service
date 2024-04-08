import { getRepository } from 'typeorm';
import { PortfolioVersionEntity, VersionType } from '../../src/entities/PortfolioVersionEntity';
import createApolloServer from '../test_helpers/createApolloServer';
import createPortfolioEntity from '../test_helpers/createPortfolioHelper';
import PortfolioEntity from '../../src/entities/PortfolioEntity';
import { createSnapshotVersionFromPortfolio, deletePortfolioVersion } from '../test_helpers/portfolioVersionHelper';

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

    //clean up
    if (snapshotPortfolioVersion) {
      deletePortfolioVersion(snapshotPortfolioVersion.id);
    }
  });


  test('get all available portfolio versions', async () => {
    let portfolioVersion1 = await createSnapshotVersionFromPortfolio(portfolio1.id);
    let portfolioVersion2 = await createSnapshotVersionFromPortfolio(portfolio1.id);
    let portfolioVersion3 = await createSnapshotVersionFromPortfolio(portfolio1.id);

    const server = createApolloServer();
    const response = await server.executeOperation({
      query: `query getPortfolioVersions($portfolioId: Float!, $orderBy: String!) {
                getPortfolioVersions(portfolioId: $portfolioId, orderBy: $orderBy) {
                  id
                  type
                  createdAt
                }
              }`,
      variables: {
        portfolioId: portfolio1.id,
        orderBy: "ASC"
      },
    });
    expect(response).toGraphQLResponseData({
      getPortfolioVersions: [
        {
          id: portfolioVersion1.id,
          type: VersionType.SNAPSHOT,
          createdAt: portfolioVersion1.createdAt.toISOString(),
        },
        {
          id: portfolioVersion2.id,
          type: VersionType.SNAPSHOT,
          createdAt: portfolioVersion2.createdAt.toISOString(),
        },
        {
          id: portfolioVersion3.id,
          type: VersionType.SNAPSHOT,
          createdAt: portfolioVersion3.createdAt.toISOString(),
        },
      ],
    });

    await deletePortfolioVersion(portfolioVersion1.id);
    await deletePortfolioVersion(portfolioVersion2.id);
    await deletePortfolioVersion(portfolioVersion3.id);

  });
});


