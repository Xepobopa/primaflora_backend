import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Nkartar } from "./nkartar.entity";
import { Xdocline } from "./xdocline.entity";

@Index("i1_nkarta", ["dates", "nkartar"], {})
@Index("pk_nkarta", ["nkarta"], { unique: true })
@Entity("nkarta", { schema: "nlife" })
export class Nkarta {
  @Column("uuid", { primary: true, name: "nkarta" })
  nkarta: string;

  @Column("uuid", { name: "nkartar" })
  nkartar: string;

  @Column("date", { name: "dates", default: () => "('now')::date" })
  dates: string;

  @Column("numeric", {
    name: "quantity",
    precision: 14,
    scale: 2,
    default: () => "0",
  })
  quantity: string;

  @Column("numeric", {
    name: "points",
    precision: 14,
    scale: 2,
    default: () => "0",
  })
  points: string;

  @Column("character varying", { name: "comment", nullable: true, length: 255 })
  comment: string | null;

  @Column("numeric", {
    name: "ppoints",
    precision: 14,
    scale: 2,
    default: () => "0",
  })
  ppoints: string;

  @ManyToOne(() => Nkartar, (nkartar) => nkartar.nkartas, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "nkartar", referencedColumnName: "nkartar" }])
  nkartar2: Nkartar;

  @ManyToOne(() => Xdocline, (xdocline) => xdocline.nkartas, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "xdocline", referencedColumnName: "xdocline" }])
  xdocline: Xdocline;
}
