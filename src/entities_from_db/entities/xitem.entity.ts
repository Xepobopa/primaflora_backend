import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Xdocline } from "./xdocline.entity";
import { Xbasket } from "./xbasket.entity";
import { Nkartar } from "./nkartar.entity";

@Index("i2_xitem", ["name"], { unique: true })
@Index("i1_xitem", ["name"], { unique: true })
@Index("pk_xitem", ["xitem"], { unique: true })
@Entity("xitem", { schema: "nlife" })
export class Xitem {
  @Column("uuid", { primary: true, name: "xitem" })
  xitem: string;

  @Column("character varying", { name: "name", nullable: true, length: 64 })
  name: string | null;

  @Column("character varying", { name: "edi", nullable: true, length: 12 })
  edi: string | null;

  @Column("numeric", {
    name: "points",
    nullable: true,
    precision: 14,
    scale: 2,
  })
  points: string | null;

  @Column("numeric", {
    name: "price100",
    nullable: true,
    precision: 14,
    scale: 2,
  })
  price100: string | null;

  @Column("numeric", {
    name: "price40",
    nullable: true,
    precision: 14,
    scale: 2,
  })
  price40: string | null;

  @Column("numeric", {
    name: "price30",
    nullable: true,
    precision: 14,
    scale: 2,
  })
  price30: string | null;

  @Column("numeric", {
    name: "price20",
    nullable: true,
    precision: 14,
    scale: 2,
  })
  price20: string | null;

  @Column("boolean", { name: "inactive", default: () => "false" })
  inactive: boolean;

  @Column("numeric", {
    name: "price10",
    nullable: true,
    precision: 14,
    scale: 2,
  })
  price10: string | null;

  @ManyToOne(() => Xitem, (xitem) => xitem.xitems)
  @JoinColumn([{ name: "parent", referencedColumnName: "xitem" }])
  parent: Xitem;

  @OneToMany(() => Xitem, (xitem) => xitem.parent)
  xitems: Xitem[];

  @OneToMany(() => Xdocline, (xdocline) => xdocline.xitem2)
  xdoclines: Xdocline[];

  @OneToMany(() => Xbasket, (xbasket) => xbasket.xitem)
  xbaskets: Xbasket[];

  @OneToMany(() => Nkartar, (nkartar) => nkartar.xitem2)
  nkartars: Nkartar[];
}
