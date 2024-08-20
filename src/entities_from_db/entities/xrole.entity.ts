import { Column, Entity, Index, OneToMany } from "typeorm";
// import { Dacl } from "./dacl.entity";
import { Account } from "./account.entity";

@Index("pk_xrole", ["xrole"], { unique: true })
@Entity("xrole", { schema: "nlife" })
export class Xrole {
  @Column("character varying", { primary: true, name: "xrole", length: 12 })
  xrole: string;

  @Column("integer", { name: "acl" })
  acl: number;

  @Column("character varying", { name: "comment", nullable: true, length: 255 })
  comment: string | null;

  // @OneToMany(() => Dacl, (dacl) => dacl.xrole2)
  // dacls: Dacl[];

  @OneToMany(() => Account, (account) => account.xrole2)
  accounts: Account[];
}
