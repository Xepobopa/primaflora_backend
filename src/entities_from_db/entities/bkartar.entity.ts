import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Period } from "./period.entity";
import { Bkarta } from "./bkarta.entity";
import { Account } from "./account.entity";

@Index("i1_bkartar", ["account", "period"], { unique: true })
@Index("pk_bkartar", ["bkartar"], { unique: true })
@Entity("bkartar", { schema: "nlife" })
export class Bkartar {
  @Column("uuid", { primary: true, name: "bkartar" })
  bkartar: string;

  @Column("character varying", { name: "account", length: 64 })
  account: string;

  @Column("uuid", { name: "period" })
  period: string;

  @Column("numeric", {
    name: "points",
    precision: 14,
    scale: 2,
    default: () => "0",
  })
  points: string;

  @Column("numeric", {
    name: "ppoints",
    precision: 14,
    scale: 2,
    default: () => "0",
  })
  ppoints: string;

  @ManyToOne(() => Period, (period) => period.bkartars, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "period", referencedColumnName: "period" }])
  period2: Period;

  @OneToMany(() => Bkarta, (bkarta) => bkarta.bkartar2)
  bkartas: Bkarta[];

  @ManyToOne(() => Account, (account) => account.bkartars, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "account", referencedColumnName: "account" }])
  account2: Account;
}
