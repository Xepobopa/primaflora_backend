import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Account } from "./account.entity";
import { Xitem } from "./xitem.entity";

@Index("pk_xbasket", ["xbasket"], { unique: true })
@Entity("xbasket", { schema: "nlife" })
export class Xbasket {
  @Column("uuid", { primary: true, name: "xbasket" })
  xbasket: string;

  @Column("numeric", { name: "rquantity", precision: 14, scale: 2 })
  rquantity: string;

  @ManyToOne(() => Account, (account) => account.xbaskets, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "account", referencedColumnName: "account" }])
  account: Account;

  @ManyToOne(() => Xitem, (xitem) => xitem.xbaskets)
  @JoinColumn([
    { name: "xitem", referencedColumnName: "xitem" },
    { name: "xitem", referencedColumnName: "xitem" },
  ])
  xitem: Xitem;
}
