import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Xcenter } from "./xcenter.entity";
import { Nkarta } from "./nkarta.entity";
import { Xitem } from "./xitem.entity";

@Index("pk_nkartar", ["nkartar"], { unique: true })
@Index("i1_nkartar", ["xcenter", "xitem"], { unique: true })
@Entity("nkartar", { schema: "nlife" })
export class Nkartar {
  @Column("uuid", { primary: true, name: "nkartar" })
  nkartar: string;

  @Column("uuid", { name: "xitem" })
  xitem: string;

  @Column("uuid", { name: "xcenter" })
  xcenter: string;

  @Column("numeric", {
    name: "points",
    precision: 14,
    scale: 2,
    default: () => "0",
  })
  points: string;

  @Column("numeric", {
    name: "quantity",
    precision: 14,
    scale: 2,
    default: () => "0",
  })
  quantity: string;

  @Column("numeric", {
    name: "ppoints",
    precision: 14,
    scale: 2,
    default: () => "0",
  })
  ppoints: string;

  @ManyToOne(() => Xcenter, (xcenter) => xcenter.nkartars)
  @JoinColumn([{ name: "xcenter", referencedColumnName: "xcenter" }])
  xcenter2: Xcenter;

  @OneToMany(() => Nkarta, (nkarta) => nkarta.nkartar2)
  nkartas: Nkarta[];

  @ManyToOne(() => Xitem, (xitem) => xitem.nkartars)
  @JoinColumn([{ name: "xitem", referencedColumnName: "xitem" }])
  xitem2: Xitem;
}
