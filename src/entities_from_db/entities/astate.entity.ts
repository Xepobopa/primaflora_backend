import { Column, Entity, Index, OneToMany } from "typeorm";
import { Account } from "./account.entity";
import { Xstat } from "./xstat.entity";

@Index("pk_astate", ["astate"], { unique: true })
@Entity("astate", { schema: "nlife" })
export class Astate {
  @Column("uuid", { primary: true, name: "astate" })
  astate: string;

  @Column("character varying", { name: "name", length: 64 })
  name: string;

  @Column("boolean", { name: "manager" })
  manager: boolean;

  @Column("numeric", { name: "limit0", precision: 14, scale: 2 })
  limit0: string;

  @Column("numeric", { name: "limit3min", precision: 14, scale: 2 })
  limit3min: string;

  @Column("numeric", { name: "limit3max", precision: 14, scale: 2 })
  limit3max: string;

  @Column("numeric", { name: "ret_bonus", precision: 14, scale: 2 })
  retBonus: string;

  @Column("numeric", { name: "lead_bonus", precision: 14, scale: 2 })
  leadBonus: string;

  @Column("boolean", { name: "top4" })
  top4: boolean;

  @Column("boolean", { name: "top5" })
  top5: boolean;

  @OneToMany(() => Account, (account) => account.astate)
  accounts: Account[];

  @OneToMany(() => Xstat, (xstat) => xstat.astateCvalification2)
  xstats: Xstat[];

  @OneToMany(() => Xstat, (xstat) => xstat.astateConfirmed)
  xstats2: Xstat[];
}
