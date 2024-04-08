import { getCustomRepository, getConnection } from 'typeorm';
import { PortfolioVersionRepository } from '../../src/repositories/PortfolioVersionRepository';
import PageVersionEntity from '../../src/entities/PageVersionEntity';
import { PortfolioVersionEntity } from '../../src/entities/PortfolioVersionEntity';

export async function createSnapshotVersionFromPortfolio(portfolioId: number) {
  const portfolioVersionRepository = getCustomRepository(PortfolioVersionRepository);
  return portfolioVersionRepository.createSnapshotFromPortfolio(portfolioId);
}

export async function deletePortfolioVersion(portfolioVersionId: number) {
  await getConnection().transaction(async transactionalEntityManager => {
    // First delete all PageVersionEntity records associated with the PortfolioVersionEntity
    await transactionalEntityManager.getRepository(PageVersionEntity).delete({ portfolioVersion: { id: portfolioVersionId } });

    // Then delete the PortfolioVersionEntity
    await transactionalEntityManager.getRepository(PortfolioVersionEntity).delete(portfolioVersionId);
  });
}

