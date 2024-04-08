import { EntityRepository, Repository, getConnection, getRepository } from 'typeorm';
import { PortfolioVersionEntity, VersionType } from '../entities/PortfolioVersionEntity';
import PageVersionEntity from '../entities/PageVersionEntity';
import PortfolioEntity from '../entities/PortfolioEntity';

@EntityRepository(PortfolioVersionEntity)
export class PortfolioVersionRepository extends Repository<PortfolioVersionEntity> {

  async deletePortfolioVersion(portfolioVersion: PortfolioVersionEntity) {
  
    await getConnection().transaction(async transactionalEntityManager => {
      // First delete all PageVersionEntity records associated with the PortfolioVersionEntity
      await transactionalEntityManager.getRepository(PageVersionEntity).delete({ portfolioVersion });
  
      // Then delete the PortfolioVersionEntity
      await transactionalEntityManager.getRepository(PortfolioVersionEntity).remove(portfolioVersion);
    });
  }

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
