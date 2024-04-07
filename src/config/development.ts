import ConfigInterface from './ConfigInterface';
import { ENTITIES_PATH, RESOLVERS_PATH } from './constants';

const config: ConfigInterface = {
  env: 'development',
  database: {
    type: 'sqlite' as const,
    cache: false,
    database: ':memory:',
    dropSchema: true,
    entities: [ENTITIES_PATH],
    logger: 'advanced-console' as const,
    synchronize: true,
  },
  graphQLPath: '/graphql',
  resolvers: [RESOLVERS_PATH],
};

export default config;
