import { Field, ObjectType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { PortfolioVersionEntity } from './PortfolioVersionEntity';
import PageEntity from './PageEntity';

@ObjectType()
@Entity()
@Unique(["url", "portfolioVersion"])
/**
 * Represents a page version entity. it is a snapshot of a page entity at a specific time. 
 * Note the url is unique but per portfolio version.
 * Also it contains reference for original page entity and of course the portfolio version entity.
 */
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
