import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Astate } from "./astate.entity";
import { Xstat } from "./xstat.entity";
import { Xbasket } from "./xbasket.entity";
import { Pdoc } from "./pdoc.entity";
import { Echat } from "./echat.entity";
import { Echataccount } from "./echataccount.entity";
import { Xdocpoints } from "./xdocpoints.entity";
import { Xdocline } from "./xdocline.entity";
import { Echatroom } from "./echatroom.entity";
import { Xdoc } from "./xdoc.entity";
import { Xrole } from "./xrole.entity";
import { Bkartar } from "./bkartar.entity";

@Index("pk_account", ["account"], { unique: true })
@Index("i3_account", ["created"], {})
@Index("i4_account", ["created", "xrole"], {})
@Index("i1_account", ["isponsor"], {})
@Index("i2_account", ["sponsor"], {})
@Entity("account", { schema: "nlife" })
export class Account {
  @Column("character varying", { primary: true, name: "account", length: 64 })
  account: string;

  @Column("character varying", { name: "login", length: 64 })
  login: string;

  @Column("character varying", { name: "passwd", length: 64 })
  passwd: string;

  @Column("date", { name: "dates", nullable: true })
  dates: string | null;

  @Column("character varying", { name: "sponsor", nullable: true, length: 64 })
  sponsor: string | null;

  @Column("character varying", { name: "isponsor", nullable: true, length: 64 })
  isponsor: string | null;

  @Column("character varying", {
    name: "xrole",
    nullable: true,
    length: 12,
    default: () => "'member'",
  })
  xrole: string | null;

  @Column("character varying", { name: "login2", nullable: true, length: 64 })
  login2: string | null;

  @Column("character varying", { name: "passwd2", nullable: true, length: 64 })
  passwd2: string | null;

  @Column("date", { name: "dates2", nullable: true })
  dates2: string | null;

  @Column("uuid", { name: "xcenter", nullable: true })
  xcenter: string | null;

  @Column("uuid", { name: "infoxcenter", nullable: true })
  infoxcenter: string | null;

  @Column("date", { name: "created", default: () => "('now')::date" })
  created: string;

  @Column("character varying", { name: "passport", nullable: true, length: 12 })
  passport: string | null;

  @Column("character varying", {
    name: "passport2",
    nullable: true,
    length: 12,
  })
  passport2: string | null;

  @Column("character varying", { name: "address", nullable: true, length: 255 })
  address: string | null;

  @Column("character varying", { name: "phone", nullable: true, length: 64 })
  phone: string | null;

  @Column("character varying", { name: "email", nullable: true, length: 64 })
  email: string | null;

  @ManyToOne(() => Astate, (astate) => astate.accounts)
  @JoinColumn([{ name: "astate", referencedColumnName: "astate" }])
  astate: Astate;

  @OneToMany(() => Xstat, (xstat) => xstat.isponsor2)
  xstats: Xstat[];

  @OneToMany(() => Xbasket, (xbasket) => xbasket.account)
  xbaskets: Xbasket[];

  @OneToMany(() => Pdoc, (pdoc) => pdoc.owner)
  pdocs: Pdoc[];

  @OneToMany(() => Echat, (echat) => echat.account)
  echats: Echat[];

  @ManyToOne(() => Account, (account) => account.accounts, {
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "sponsor", referencedColumnName: "account" }])
  sponsor2: Account;

  @OneToMany(() => Account, (account) => account.sponsor2)
  accounts: Account[];

  @OneToMany(() => Echataccount, (echataccount) => echataccount.account2)
  echataccounts: Echataccount[];

  @OneToMany(() => Xdocpoints, (xdocpoints) => xdocpoints.account)
  xdocpoints: Xdocpoints[];

  @OneToMany(() => Xdocline, (xdocline) => xdocline.account)
  xdoclines: Xdocline[];

  @OneToMany(() => Echatroom, (echatroom) => echatroom.account2)
  echatrooms: Echatroom[];

  @ManyToOne(() => Account, (account) => account.accounts2, {
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "isponsor", referencedColumnName: "account" }])
  isponsor2: Account;

  @OneToMany(() => Account, (account) => account.isponsor2)
  accounts2: Account[];

  @OneToMany(() => Xstat, (xstat) => xstat.rsponsor2)
  xstats2: Xstat[];

  @OneToMany(() => Xdoc, (xdoc) => xdoc.owner2)
  xdocs: Xdoc[];

  @ManyToOne(() => Xrole, (xrole) => xrole.accounts)
  @JoinColumn([{ name: "xrole", referencedColumnName: "xrole" }])
  xrole2: Xrole;

  @OneToMany(() => Bkartar, (bkartar) => bkartar.account2)
  bkartars: Bkartar[];

  @OneToMany(() => Xstat, (xstat) => xstat.account2)
  xstats3: Xstat[];
}
