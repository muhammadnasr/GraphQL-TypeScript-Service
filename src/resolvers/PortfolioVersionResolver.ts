import { Resolver, Mutation, Arg, Query } from 'type-graphql';
import { Service } from 'typedi';
import { getCustomRepository, getRepository } from 'typeorm';
import { PortfolioVersionEntity } from '../entities/PortfolioVersionEntity';
import { PortfolioVersionRepository } from '../repositories/PortfolioVersionRepository';
import PageVersionEntity from '../entities/PageVersionEntity';

@Resolver()
@Service()
/**
 * Resolver for PortfolioVersionEntity.
 */
export default class PortfolioVersionResolver {

  @Mutation(() => PortfolioVersionEntity, { description: 'Create a snapshot version from current portfolio' })
  /**
   * Creates a snapshot from a portfolio.
   * 
   * @param portfolioId - The ID of the portfolio.
   * @returns A promise that resolves to a PortfolioVersionEntity representing the created snapshot.
   */
  async createSnapshotFromPortfolio(@Arg('portfolioId') portfolioId: number): Promise<PortfolioVersionEntity> {
    const portfolioVersionRepository = getCustomRepository(PortfolioVersionRepository);
    return portfolioVersionRepository.createSnapshotFromPortfolio(portfolioId);

  }

  @Query(() => [PortfolioVersionEntity], { description: 'Get all versions for a specific portfolio' })
  /**
   * Retrieves the versions of a portfolio.
   * @param portfolioId - The ID of the portfolio.
   * @param orderBy - The order in which the versions should be sorted. Defaults to 'ASC'.
   * @returns A promise that resolves to an array of PortfolioVersionEntity objects.
   */
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
  /**
   * Retrieves the pages of a portfolio version based on the provided portfolioVersion ID.
   * @param portfolioVersionId - The ID of the portfolio version.
   * @returns A promise that resolves to an array of PageVersionEntity objects.
   */
  async getPagesOfPortfolioVersion(@Arg('portfolioVersionId') portfolioVersionId: number): Promise<PageVersionEntity[]> {
    const pageVersionRepository = getRepository(PageVersionEntity);
    return pageVersionRepository.find({
      where: { portfolioVersion: {id: portfolioVersionId } },
      order: { id: 'ASC' },
    });
  }

}
