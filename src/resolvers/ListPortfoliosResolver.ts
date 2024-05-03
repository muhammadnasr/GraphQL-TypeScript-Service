import { Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { getRepository } from 'typeorm';

import PortfolioEntity from '../entities/PortfolioEntity';

@Resolver()
@Service()
/**
 * Resolver class for listing portfolios.
 */
export default class ListPortfoliosResolver {
  /**
   * Retrieves a list of all portfolios (pages are sorted by id ASC always).
   * @returns A promise that resolves to an array of PortfolioEntity objects.
   */
  @Query(() => [PortfolioEntity],{ description: 'List all portfolios' })
  async listPortfolios(): Promise<PortfolioEntity[]> {
    const portfolioRepository = getRepository(PortfolioEntity);

    return portfolioRepository
      .createQueryBuilder('portfolio')
      .leftJoinAndSelect('portfolio.pages', 'pages')
      .orderBy('pages.id', 'ASC')
      .getMany();
  }
}
