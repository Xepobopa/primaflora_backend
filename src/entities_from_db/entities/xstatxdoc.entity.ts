// import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
// import { Xstat } from "./xstat.entity";

// @Index("ix_xstat_xdoc_01", ["account"], {})
// @Index("ix_xstat_xdoc_00", ["period"], {})
// @Entity("xstat_xdoc", { schema: "nlife" })
// export class XstatXdoc {
//   @Column("uuid", { name: "period", primary: true })
//   period: string;

//   @Column("character varying", { name: "account", length: 64 })
//   account: string;

//   @Column("date", { name: "dates" })
//   dates: string;

//   @Column("numeric", { name: "points", precision: 14, scale: 2 })
//   points: string;

//   @Column("character varying", { name: "comment", nullable: true, length: 255 })
//   comment: string | null;

//   @ManyToOne(() => Xstat, (xstat) => xstat.xstatXdocs, {
//     onDelete: "CASCADE",
//     onUpdate: "CASCADE",
//   })
//   @JoinColumn([
//     { name: "period", referencedColumnName: "period" },
//     { name: "account", referencedColumnName: "account" },
//   ])
//   xstat: Xstat;
// }
