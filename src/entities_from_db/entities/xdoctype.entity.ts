import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Dstate } from "./dstate.entity";
// import { Dacl } from "./dacl.entity";
import { Xdoc } from "./xdoc.entity";

@Index("pk_xdoctype", ["xdoctype"], { unique: true })
@Entity("xdoctype", { schema: "nlife" })
export class Xdoctype {
  @Column("integer", { primary: true, name: "xdoctype" })
  xdoctype: number;

  @Column("character varying", { name: "name", nullable: true, length: 64 })
  name: string | null;

  @Column("integer", { name: "acl", nullable: true })
  acl: number | null;

  @ManyToOne(() => Dstate, (dstate) => dstate.xdoctypes, {
    onDelete: "SET NULL",
    onUpdate: "SET NULL",
  })
  @JoinColumn([{ name: "initial_dstate", referencedColumnName: "dstate" }])
  initialDstate: Dstate;

  // @OneToMany(() => Dacl, (dacl) => dacl.xdoctype2)
  // dacls: Dacl[];

  @OneToMany(() => Xdoc, (xdoc) => xdoc.xdoctype2)
  xdocs: Xdoc[];
}
