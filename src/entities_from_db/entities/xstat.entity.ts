import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Account } from "./account.entity";
import { Astate } from "./astate.entity";
// import { XstatXdoc } from "./xstatxdoc.entity";
import { Period } from "./period.entity";

@Index("pk_xstat", ["account", "period"], { unique: true })
@Index("i4_xstat", ["account", "astateCvalification", "period"], {})
@Index("i1_xstat", ["isponsor"], {})
@Index("i2_xstat", ["period"], {})
@Index("i3_xstat", ["rsponsor"], {})
@Entity("xstat", { schema: "nlife" })
export class Xstat {
  @Column("uuid", { primary: true, name: "period" })
  period: string;

  @Column("character varying", { primary: true, name: "account", length: 64 })
  account: string;

  @Column("integer", { name: "layer", nullable: true })
  layer: number | null;

  @Column("character varying", { name: "isponsor", nullable: true, length: 64 })
  isponsor: string | null;

  @Column("character varying", { name: "rsponsor", nullable: true, length: 64 })
  rsponsor: string | null;

  @Column("uuid", { name: "astate_cvalification" })
  astateCvalification: string;

  @Column("numeric", {
    name: "personal",
    nullable: true,
    precision: 14,
    scale: 2,
  })
  personal: string | null;

  @Column("numeric", {
    name: "volume0",
    nullable: true,
    precision: 14,
    scale: 2,
  })
  volume0: string | null;

  @Column("numeric", {
    name: "volume1",
    nullable: true,
    precision: 14,
    scale: 2,
  })
  volume1: string | null;

  @Column("numeric", {
    name: "volume2",
    nullable: true,
    precision: 14,
    scale: 2,
  })
  volume2: string | null;

  @Column("numeric", {
    name: "volume3",
    nullable: true,
    precision: 14,
    scale: 2,
  })
  volume3: string | null;

  @Column("numeric", {
    name: "volume4",
    nullable: true,
    precision: 14,
    scale: 2,
  })
  volume4: string | null;

  @Column("numeric", {
    name: "volume5",
    nullable: true,
    precision: 14,
    scale: 2,
  })
  volume5: string | null;

  @Column("numeric", {
    name: "opt_bonus",
    nullable: true,
    precision: 14,
    scale: 2,
  })
  optBonus: string | null;

  @Column("numeric", {
    name: "ret_bonus",
    nullable: true,
    precision: 14,
    scale: 2,
  })
  retBonus: string | null;

  @Column("numeric", {
    name: "lead_bonus",
    nullable: true,
    precision: 14,
    scale: 2,
  })
  leadBonus: string | null;

  @Column("numeric", {
    name: "top4bonus",
    nullable: true,
    precision: 14,
    scale: 2,
  })
  top4bonus: string | null;

  @Column("numeric", {
    name: "top5bonus",
    nullable: true,
    precision: 14,
    scale: 2,
  })
  top5bonus: string | null;

  @ManyToOne(() => Account, (account) => account.xstats, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "isponsor", referencedColumnName: "account" }])
  isponsor2: Account;

  @ManyToOne(() => Astate, (astate) => astate.xstats)
  @JoinColumn([
    { name: "astate_cvalification", referencedColumnName: "astate" },
  ])
  astateCvalification2: Astate;

  // @OneToMany(() => XstatXdoc, (xstatXdoc) => xstatXdoc.xstat)
  // xstatXdocs: XstatXdoc[];

  @ManyToOne(() => Astate, (astate) => astate.xstats2)
  @JoinColumn([{ name: "astate_confirmed", referencedColumnName: "astate" }])
  astateConfirmed: Astate;

  @ManyToOne(() => Account, (account) => account.xstats2, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "rsponsor", referencedColumnName: "account" }])
  rsponsor2: Account;

  @ManyToOne(() => Period, (period) => period.xstats)
  @JoinColumn([{ name: "period", referencedColumnName: "period" }])
  period2: Period;

  @ManyToOne(() => Account, (account) => account.xstats3, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "account", referencedColumnName: "account" }])
  account2: Account;
}
