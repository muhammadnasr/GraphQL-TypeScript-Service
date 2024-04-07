import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Field, ObjectType } from 'type-graphql';
import PortfolioEntity from './PortfolioEntity';

@ObjectType('Page')
@Entity()
export default class PageEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('varchar', { nullable: false })
  name: string;

  @Field()
  @Column('varchar', { nullable: false, unique: true })
  url: string;

  @ManyToOne(() => PortfolioEntity, { nullable: false })
  portfolio: PortfolioEntity;
}
