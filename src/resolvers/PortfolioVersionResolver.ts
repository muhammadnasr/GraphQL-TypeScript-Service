import { Resolver, Mutation, Arg, Query } from 'type-graphql';
import { Service } from 'typedi';
import { getCustomRepository, getRepository } from 'typeorm';
import { PortfolioVersionEntity } from '../entities/PortfolioVersionEntity';
import { PortfolioVersionRepository } from '../repositories/PortfolioVersionRepository';
import PageVersionEntity from '../entities/PageVersionEntity';

@Resolver()
@Service()
export default class PortfolioVersionResolver {
  @Mutation(() => PortfolioVersionEntity, { description: 'Create a snapshot version from current portfolio' })
  async createSnapshotFromPortfolio(@Arg('portfolioId') portfolioId: number): Promise<PortfolioVersionEntity> {
    const portfolioVersionRepository = getCustomRepository(PortfolioVersionRepository);
    return portfolioVersionRepository.createSnapshotFromPortfolio(portfolioId);

  }

  // TODO: Add a mutation to publish a portfolio version
  // it should be the same as the createSnapshotFromPortfolio but with "published" type
  // most probably we can extract the common logic to a helper function

  @Query(() => [PortfolioVersionEntity], { description: 'Get all versions for a specific portfolio' })
  async geVersionsOfPortfolio(
    @Arg('portfolioId') portfolioId: number,
    @Arg('orderByCreatedAt', { nullable: true, defaultValue: 'ASC' }) orderBy: 'ASC' | 'DESC'
  ): Promise<PortfolioVersionEntity[]> {
    const portfolioVersionRepository = getCustomRepository(PortfolioVersionRepository);
    return portfolioVersionRepository.find({
      where: { portfolio: { id: portfolioId } },
      order: { createdAt: orderBy },
    });
  }

  @Query(() => [PageVersionEntity], { description: 'Get all pages for a specific portfolio version' })
  async getPagesOfPortfolioVersion(@Arg('portfolioVersionId') portfolioVersionId: number): Promise<PageVersionEntity[]> {
    const pageVersionRepository = getRepository(PageVersionEntity);
    return pageVersionRepository.find({
      where: { portfolioVersion: {id: portfolioVersionId } },
      order: { id: 'ASC' },
    });
  }

}
