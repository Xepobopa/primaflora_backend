import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Xdoc } from "./xdoc.entity";
import { Xdoctype } from "./xdoctype.entity";
// import { Dacl } from "./dacl.entity";

@Index("pk_dstate", ["dstate"], { unique: true })
@Index("uq_dstate", ["dstate", "next"], { unique: true })
@Entity("dstate", { schema: "nlife" })
export class Dstate {
  @Column("integer", { primary: true, name: "dstate" })
  dstate: number;

  @Column("character varying", { name: "name", nullable: true, length: 64 })
  name: string | null;

  @Column("integer", { name: "next", nullable: true, unique: true })
  next: number | null;

  @ManyToOne(() => Dstate, (dstate) => dstate.dstates)
  @JoinColumn([{ name: "next", referencedColumnName: "dstate" }])
  next2: Dstate;

  @OneToMany(() => Dstate, (dstate) => dstate.next2)
  dstates: Dstate[];

  @OneToMany(() => Xdoc, (xdoc) => xdoc.dstate)
  xdocs: Xdoc[];

  @OneToMany(() => Xdoctype, (xdoctype) => xdoctype.initialDstate)
  xdoctypes: Xdoctype[];

  // @OneToMany(() => Dacl, (dacl) => dacl.dstate2)
  // dacls: Dacl[];
}
