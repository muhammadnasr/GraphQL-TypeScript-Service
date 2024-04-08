import { Resolver, Mutation, Arg } from 'type-graphql';
import { Service } from 'typedi';
import { getCustomRepository } from 'typeorm';
import { PortfolioVersionEntity  } from '../entities/PortfolioVersionEntity';
import { PortfolioVersionRepository } from '../repositories/PortfolioVersionRepository';

@Resolver()
@Service()
export default class PortfolioVersionResolver {
  @Mutation(() => PortfolioVersionEntity)
  async createSnapshotFromPortfolio(@Arg('portfolioId') portfolioId: number): Promise<PortfolioVersionEntity> {
    const portfolioVersionRepository = getCustomRepository(PortfolioVersionRepository);
    return portfolioVersionRepository.createSnapshotFromPortfolio(portfolioId);

  }

  // TODO: Add a mutation to publish a portfolio version
  // it should be the same as the createSnapshotFromPortfolio but with "published" type
  // most probably we can extract the common logic to a helper function
}
