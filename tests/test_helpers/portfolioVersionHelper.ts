/**
 * This file contains helper functions for creating and deleting portfolio versions.
 * These functions utilize the PortfolioVersionRepository to interact with the database.
 * Keeping the test files clean from interacting with the database directly.
 */
import { getCustomRepository } from 'typeorm';
import { PortfolioVersionRepository } from '../../src/repositories/PortfolioVersionRepository';

/**
 * Creates a snapshot version from a portfolio.
 * 
 * @param {number} portfolioId - The ID of the portfolio.
 * @returns {Promise<void>} - A promise that resolves to the created snapshot version.
 */
export async function createSnapshotVersionFromPortfolio(portfolioId: number) {
  const portfolioVersionRepository = getCustomRepository(PortfolioVersionRepository);
  return portfolioVersionRepository.createSnapshotFromPortfolio(portfolioId);
}

/**
 * Deletes a portfolio version with the specified ID.
 * 
 * @param {number} portfolioVersionId - The ID of the portfolio version to delete.
 * @returns {Promise<void>} - A promise that resolves when the portfolio version is deleted.
 */
export async function deletePortfolioVersion(portfolioVersionId: number) {
  const portfolioVersionRepository = getCustomRepository(PortfolioVersionRepository);
  return portfolioVersionRepository.deletePortfolioVersion(portfolioVersionId);
}

