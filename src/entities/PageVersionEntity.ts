import { Field, ObjectType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { PortfolioVersionEntity } from './PortfolioVersionEntity';
import PageEntity from './PageEntity';

@ObjectType()
@Entity()
@Unique(["url", "portfolioVersion"])
export default class PageVersionEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('varchar', { nullable: false })
  name: string;

  @Field()
  @Column('varchar', { nullable: false })
  url: string;

  @Field(() => PortfolioVersionEntity)
  @ManyToOne(() => PortfolioVersionEntity, { nullable: false })
  portfolioVersion: PortfolioVersionEntity;

  @Field(() => PageEntity)
  @ManyToOne(() => PageEntity, { nullable: false })
  originalPage: PageEntity;
}
