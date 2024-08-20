import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Dstate } from "./dstate.entity";
import { Xdoctype } from "./xdoctype.entity";
import { Period } from "./period.entity";
import { Bkarta } from "./bkarta.entity";
import { Xdocpoints } from "./xdocpoints.entity";
import { Account } from "./account.entity";
import { Xdocline } from "./xdocline.entity";

@Index("i4_xdoc", ["cfrom"], {})
@Index("i1_xdoc", ["created"], {})
@Index("i5_xdoc", ["cto"], {})
@Index("i2_xdoc", ["dates"], {})
@Index("i6_xdoc", ["owner"], {})
@Index("pk_xdoc", ["xdoc"], { unique: true })
@Index("i3_xdoc", ["xdoctype"], {})
@Entity("xdoc", { schema: "nlife" })
export class Xdoc {
  @Column("uuid", { primary: true, name: "xdoc" })
  xdoc: string;

  @Column("integer", { name: "xdoctype" })
  xdoctype: number;

  @Column("date", { name: "dates" })
  dates: string;

  @Column("character varying", { name: "numdoc", nullable: true, length: 12 })
  numdoc: string | null;

  @Column("numeric", { name: "cost", nullable: true, precision: 14, scale: 2 })
  cost: string | null;

  @Column("character varying", { name: "comment", nullable: true, length: 255 })
  comment: string | null;

  @Column("date", { name: "rdates", nullable: true })
  rdates: string | null;

  @Column("character varying", { name: "cfrom", nullable: true, length: 64 })
  cfrom: string | null;

  @Column("character varying", { name: "cto", nullable: true, length: 64 })
  cto: string | null;

  @Column("character varying", { name: "owner", nullable: true, length: 64 })
  owner: string | null;

  @Column("timestamp without time zone", {
    name: "created",
    nullable: true,
    default: () => "now()",
  })
  created: Date | null;

  @Column("text", { name: "notes", nullable: true })
  notes: string | null;

  @ManyToOne(() => Dstate, (dstate) => dstate.xdocs)
  @JoinColumn([{ name: "dstate", referencedColumnName: "dstate" }])
  dstate: Dstate;

  @ManyToOne(() => Xdoctype, (xdoctype) => xdoctype.xdocs)
  @JoinColumn([{ name: "xdoctype", referencedColumnName: "xdoctype" }])
  xdoctype2: Xdoctype;

  @ManyToOne(() => Period, (period) => period.xdocs, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "period", referencedColumnName: "period" }])
  period: Period;

  @OneToMany(() => Bkarta, (bkarta) => bkarta.xdoc2)
  bkartas: Bkarta[];

  @OneToMany(() => Xdocpoints, (xdocpoints) => xdocpoints.xdoc)
  xdocpoints: Xdocpoints[];

  @ManyToOne(() => Account, (account) => account.xdocs, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "owner", referencedColumnName: "account" }])
  owner2: Account;

  @OneToMany(() => Xdocline, (xdocline) => xdocline.xdoc2)
  xdoclines: Xdocline[];
}
