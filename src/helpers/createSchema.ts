import { GraphQLSchema } from 'graphql';
import { BuildSchemaOptions, buildSchemaSync } from 'type-graphql';
import { Container } from 'typedi';
import { RESOLVERS_PATH } from '../config/constants';

export function createSchema(options?: Omit<BuildSchemaOptions, 'resolvers'>): GraphQLSchema {
  return buildSchemaSync({
    resolvers: [RESOLVERS_PATH],
    emitSchemaFile: true,
    container: Container,
    validate: true,
    ...options,
  });
}
