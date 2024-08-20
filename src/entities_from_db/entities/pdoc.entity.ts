import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Account } from "./account.entity";
import { Period } from "./period.entity";

@Index("pk_pdoc", ["pdoc"], { unique: true })
@Entity("pdoc", { schema: "nlife" })
export class Pdoc {
  @Column("uuid", { primary: true, name: "pdoc" })
  pdoc: string;

  @Column("character varying", { name: "comment", nullable: true, length: 255 })
  comment: string | null;

  @Column("timestamp without time zone", {
    name: "created",
    default: () => "now()",
  })
  created: Date;

  @Column("boolean", { name: "closed", default: () => "true" })
  closed: boolean;

  @ManyToOne(() => Account, (account) => account.pdocs, { onUpdate: "CASCADE" })
  @JoinColumn([{ name: "owner", referencedColumnName: "account" }])
  owner: Account;

  @ManyToOne(() => Period, (period) => period.pdocs, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "operiod", referencedColumnName: "period" }])
  operiod: Period;

  @ManyToOne(() => Period, (period) => period.pdocs2)
  @JoinColumn([{ name: "nperiod", referencedColumnName: "period" }])
  nperiod: Period;
}
