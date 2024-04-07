// tests/test_helpers/createPortfolioHelper.ts
import faker from 'faker';
import { DeepPartial, getRepository } from 'typeorm';
import PortfolioEntity from '../../src/entities/PortfolioEntity';
import PageEntity from '../../src/entities/PageEntity';

export async function buildPortfolioEntity(properties?: DeepPartial<PortfolioEntity>) {
  const repository = getRepository(PortfolioEntity);
  const pageRepository = getRepository(PageEntity);

  const portfolio = repository.create({
    name: faker.name.findName(),
    url: faker.internet.url(),
    ...properties,
  });

  await repository.save(portfolio);

  portfolio.pages = await Promise.all(
    Array.from({ length: 2 }, async () => {
      const page = pageRepository.create({
        name: faker.name.findName(),
        url: faker.internet.url(),
        portfolio,
      });
      return pageRepository.save(page);
    })
  );

  return portfolio;
}

async function createPortfolioEntity(properties?: DeepPartial<PortfolioEntity>) {
  const repository = getRepository(PortfolioEntity);
  return repository.save(await buildPortfolioEntity(properties));
}

export default createPortfolioEntity;
