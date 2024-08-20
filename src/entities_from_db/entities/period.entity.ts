import { Column, Entity, Index, OneToMany } from "typeorm";
import { Bkartar } from "./bkartar.entity";
import { Xdoc } from "./xdoc.entity";
import { Pdoc } from "./pdoc.entity";
import { Xstat } from "./xstat.entity";

@Index("pk_period", ["period"], { unique: true })
@Entity("period", { schema: "nlife" })
export class Period {
  @Column("uuid", { primary: true, name: "period" })
  period: string;

  @Column("date", { name: "dfrom" })
  dfrom: string;

  @Column("date", { name: "dto" })
  dto: string;

  @Column("boolean", { name: "closed", default: () => "false" })
  closed: boolean;

  @OneToMany(() => Bkartar, (bkartar) => bkartar.period2)
  bkartars: Bkartar[];

  @OneToMany(() => Xdoc, (xdoc) => xdoc.period)
  xdocs: Xdoc[];

  @OneToMany(() => Pdoc, (pdoc) => pdoc.operiod)
  pdocs: Pdoc[];

  @OneToMany(() => Pdoc, (pdoc) => pdoc.nperiod)
  pdocs2: Pdoc[];

  @OneToMany(() => Xstat, (xstat) => xstat.period2)
  xstats: Xstat[];
}
