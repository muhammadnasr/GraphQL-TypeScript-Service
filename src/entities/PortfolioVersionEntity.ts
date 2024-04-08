import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinTable, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Field, ObjectType, registerEnumType } from 'type-graphql';
import PortfolioEntity from './PortfolioEntity';
import PageVersionEntity from './PageVersionEntity';

export enum VersionType {
  // we don't have type for draft, but we can assume that the current PortfolioEntity is the draft
  // user can have as many published versions as they want but the latest one is the currently published one
  PUBLISHED = 'published',
  // user can have as many snapshots as they want
  SNAPSHOT = 'snapshot',
}

registerEnumType(VersionType, {
  name: "VersionType",
  description: "The types of versions for a portfolio"
});

@ObjectType('PortfolioVersion')
@Entity()
export class PortfolioVersionEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({
    type: 'varchar',
    enum: VersionType,
  })
  type: VersionType;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => PortfolioEntity)
  @ManyToOne(() => PortfolioEntity, (portfolio) => portfolio.versions)
  portfolio: PortfolioEntity;

  @Field(() => [PageVersionEntity])
  @OneToMany(() => PageVersionEntity, (pageVersion) => pageVersion.portfolioVersion)
  @JoinTable()
  pageVersions: PageVersionEntity[];
}
