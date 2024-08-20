import { Column, Entity, Index } from "typeorm";

@Index("pk_astate_limits", ["astate", "period"], { unique: true })
@Entity("astate_limits", { schema: "nlife" })
export class AstateLimits {
  @Column("uuid", { primary: true, name: "period" })
  period: string;

  @Column("uuid", { primary: true, name: "astate" })
  astate: string;

  @Column("numeric", {
    name: "limit3min",
    nullable: true,
    precision: 14,
    scale: 2,
  })
  limit3min: string | null;
}
