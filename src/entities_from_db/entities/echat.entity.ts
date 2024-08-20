import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Echataccount } from "./echataccount.entity";
import { Account } from "./account.entity";

@Index("pk_echat", ["echat"], { unique: true })
@Entity("echat", { schema: "nlife" })
export class Echat {
  @Column("uuid", { primary: true, name: "echat", default: () => "_newid()" })
  echat: string;

  @Column("timestamp without time zone", {
    name: "times",
    default: () => "now()",
  })
  times: Date;

  @Column("text", { name: "notes", nullable: true })
  notes: string | null;

  @Column("uuid", { name: "echatroom", nullable: true })
  echatroom: string | null;

  @OneToMany(() => Echataccount, (echataccount) => echataccount.echat2)
  echataccounts: Echataccount[];

  @ManyToOne(() => Account, (account) => account.echats, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "account", referencedColumnName: "account" }])
  account: Account;
}
