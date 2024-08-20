import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Account } from "./account.entity";
import { Xdoc } from "./xdoc.entity";

@Index("pk_xdocpoints", ["xdocpoints"], { unique: true })
@Entity("xdocpoints", { schema: "nlife" })
export class Xdocpoints {
  @Column("uuid", { primary: true, name: "xdocpoints" })
  xdocpoints: string;

  @Column("numeric", { name: "points", precision: 14, scale: 2 })
  points: string;

  @Column("character varying", { name: "comment", nullable: true, length: 255 })
  comment: string | null;

  @ManyToOne(() => Account, (account) => account.xdocpoints, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "account", referencedColumnName: "account" }])
  account: Account;

  @ManyToOne(() => Xdoc, (xdoc) => xdoc.xdocpoints, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "xdoc", referencedColumnName: "xdoc" }])
  xdoc: Xdoc;
}
