import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Xdoc } from "./xdoc.entity";
import { Bkartar } from "./bkartar.entity";

@Index("pk_bkarta", ["bkarta"], { unique: true })
@Index("i2_bkarta", ["bkartar", "dates"], {})
@Index("i1_bkarta", ["xdoc"], {})
@Entity("bkarta", { schema: "nlife" })
export class Bkarta {
  @Column("uuid", { primary: true, name: "bkarta" })
  bkarta: string;

  @Column("uuid", { name: "bkartar" })
  bkartar: string;

  @Column("uuid", { name: "xdoc" })
  xdoc: string;

  @Column("numeric", {
    name: "points",
    precision: 14,
    scale: 2,
    default: () => "0",
  })
  points: string;

  @Column("character varying", { name: "comment", nullable: true, length: 255 })
  comment: string | null;

  @Column("date", { name: "dates", default: () => "('now')::date" })
  dates: string;

  @Column("numeric", {
    name: "ppoints",
    precision: 14,
    scale: 2,
    default: () => "0",
  })
  ppoints: string;

  @ManyToOne(() => Xdoc, (xdoc) => xdoc.bkartas, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "xdoc", referencedColumnName: "xdoc" }])
  xdoc2: Xdoc;

  @ManyToOne(() => Bkartar, (bkartar) => bkartar.bkartas, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "bkartar", referencedColumnName: "bkartar" }])
  bkartar2: Bkartar;
}
