import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Echat } from "./echat.entity";
import { Account } from "./account.entity";

@Index("pk_echataccount", ["account", "echat"], { unique: true })
@Index("i2_echat", ["account"], {})
@Index("i1_echat", ["times"], {})
@Entity("echataccount", { schema: "nlife" })
export class Echataccount {
  @Column("uuid", { primary: true, name: "echat" })
  echat: string;

  @Column("character varying", { primary: true, name: "account", length: 255 })
  account: string;

  @Column("timestamp without time zone", { name: "times", nullable: true })
  times: Date | null;

  @ManyToOne(() => Echat, (echat) => echat.echataccounts, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "echat", referencedColumnName: "echat" }])
  echat2: Echat;

  @ManyToOne(() => Account, (account) => account.echataccounts, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "account", referencedColumnName: "account" }])
  account2: Account;
}
