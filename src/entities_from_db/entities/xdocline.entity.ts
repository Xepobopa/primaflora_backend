import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Xitem } from "./xitem.entity";
import { Account } from "./account.entity";
import { Nkarta } from "./nkarta.entity";
import { Xdoc } from "./xdoc.entity";

@Index("i2_xdocline", ["xdoc"], {})
@Index("pk_xdocline", ["xdocline"], { unique: true })
@Index("i1_xdocline", ["xitem"], {})
@Entity("xdocline", { schema: "nlife" })
export class Xdocline {
  @Column("uuid", { primary: true, name: "xdocline" })
  xdocline: string;

  @Column("uuid", { name: "xdoc" })
  xdoc: string;

  @Column("uuid", { name: "xitem", nullable: true })
  xitem: string | null;

  @Column("numeric", { name: "price", precision: 14, scale: 2 })
  price: string;

  @Column("numeric", { name: "rquantity", precision: 14, scale: 2 })
  rquantity: string;

  @Column("numeric", {
    name: "quantity",
    nullable: true,
    precision: 14,
    scale: 2,
  })
  quantity: string | null;

  @Column("numeric", { name: "pprice", precision: 14, scale: 2 })
  pprice: string;

  @Column("numeric", {
    name: "oprice20",
    nullable: true,
    precision: 14,
    scale: 2,
  })
  oprice20: string | null;

  @Column("numeric", {
    name: "oprice30",
    nullable: true,
    precision: 14,
    scale: 2,
  })
  oprice30: string | null;

  @Column("numeric", {
    name: "oprice40",
    nullable: true,
    precision: 14,
    scale: 2,
  })
  oprice40: string | null;

  @Column("numeric", {
    name: "oprice100",
    nullable: true,
    precision: 14,
    scale: 2,
  })
  oprice100: string | null;

  @Column("numeric", {
    name: "opprice",
    nullable: true,
    precision: 14,
    scale: 2,
  })
  opprice: string | null;

  @Column("numeric", {
    name: "nprice20",
    nullable: true,
    precision: 14,
    scale: 2,
  })
  nprice20: string | null;

  @Column("numeric", {
    name: "nprice30",
    nullable: true,
    precision: 14,
    scale: 2,
  })
  nprice30: string | null;

  @Column("numeric", {
    name: "nprice40",
    nullable: true,
    precision: 14,
    scale: 2,
  })
  nprice40: string | null;

  @Column("numeric", {
    name: "nprice100",
    nullable: true,
    precision: 14,
    scale: 2,
  })
  nprice100: string | null;

  @Column("numeric", {
    name: "npprice",
    nullable: true,
    precision: 14,
    scale: 2,
  })
  npprice: string | null;

  @Column("numeric", {
    name: "oprice10",
    nullable: true,
    precision: 14,
    scale: 2,
  })
  oprice10: string | null;

  @Column("numeric", {
    name: "nprice10",
    nullable: true,
    precision: 14,
    scale: 2,
  })
  nprice10: string | null;

  @ManyToOne(() => Xitem, (xitem) => xitem.xdoclines, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([
    { name: "xitem", referencedColumnName: "xitem" },
    { name: "xitem", referencedColumnName: "xitem" },
  ])
  xitem2: Xitem;

  @ManyToOne(() => Account, (account) => account.xdoclines, {
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "account", referencedColumnName: "account" }])
  account: Account;

  @OneToMany(() => Nkarta, (nkarta) => nkarta.xdocline)
  nkartas: Nkarta[];

  @ManyToOne(() => Xdoc, (xdoc) => xdoc.xdoclines, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "xdoc", referencedColumnName: "xdoc" }])
  xdoc2: Xdoc;
}
