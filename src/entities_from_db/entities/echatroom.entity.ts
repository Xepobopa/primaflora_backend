import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Account } from "./account.entity";

@Index("pk_echatroom", ["account", "echatroom"], { unique: true })
@Index("i1_echatroom", ["account"], {})
@Entity("echatroom", { schema: "nlife" })
export class Echatroom {
  @Column("uuid", { primary: true, name: "echatroom" })
  echatroom: string;

  @Column("character varying", { primary: true, name: "account", length: 255 })
  account: string;

  @ManyToOne(() => Account, (account) => account.echatrooms, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "account", referencedColumnName: "account" }])
  account2: Account;
}
