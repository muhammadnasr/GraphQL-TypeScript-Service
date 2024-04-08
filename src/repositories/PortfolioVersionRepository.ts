import { EntityRepository, Repository, getConnection, getRepository } from 'typeorm';
import { PortfolioVersionEntity, VersionType } from '../entities/PortfolioVersionEntity';
import PageVersionEntity from '../entities/PageVersionEntity';
import PortfolioEntity from '../entities/PortfolioEntity';

@EntityRepository(PortfolioVersionEntity)
/**
 * Repository for managing PortfolioVersionEntity objects.
 */
export class PortfolioVersionRepository extends Repository<PortfolioVersionEntity> {

  /**
   * Deletes a portfolio version and its associated page versions.
   * @param portfolioVersion - The portfolio version to delete.
   */
  async deletePortfolioVersion(portfolioVersionId: number) {
  
    await getConnection().transaction(async transactionalEntityManager => {
      // First delete all PageVersionEntity records associated with the PortfolioVersionEntity
      await transactionalEntityManager.getRepository(PageVersionEntity).delete({ portfolioVersion: { id: portfolioVersionId } });
  
      // Then delete the PortfolioVersionEntity
      await transactionalEntityManager.getRepository(PortfolioVersionEntity).delete({ id: portfolioVersionId });
    });
  }

  /**
   * Creates a snapshot version of a portfolio.
   * @param portfolioId - The ID of the portfolio to create a snapshot from.
   * @returns The created snapshot portfolio version.
   * @throws Error if the portfolio is not found.
   */
  async createSnapshotFromPortfolio(portfolioId: number): Promise<PortfolioVersionEntity> {

    const portfolioRepository = getRepository(PortfolioEntity);
    const portfolioVersionRepository = getRepository(PortfolioVersionEntity);
    const pageVersionRepository = getRepository(PageVersionEntity);

    // Find the draft version for the given portfolio
    const portfolio = await portfolioRepository.findOne(portfolioId, { relations: ["pages"] });

    if (!portfolio) {
      throw new Error('Portfolio not found');
    }

    // Create a new snapshot version with the same pages as the current portfolio
    const snapshotPortfolioVersion = portfolioVersionRepository.create({
      type: VersionType.SNAPSHOT,
      portfolio,
    });

    await portfolioVersionRepository.save(snapshotPortfolioVersion);

    snapshotPortfolioVersion.pageVersions = await Promise.all(portfolio.pages.map(async (page) => {
      // clone the page and remove the id so a new page with the same content is created
      const pageVersion = pageVersionRepository.create({ ...page, id: undefined, originalPage: page, portfolioVersion: snapshotPortfolioVersion });
      return pageVersionRepository.save(pageVersion);
    }));

    return snapshotPortfolioVersion;
  }
}
