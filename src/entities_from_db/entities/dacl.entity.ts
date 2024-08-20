// import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
// import { Xrole } from "./xrole.entity";
// import { Xdoctype } from "./xdoctype.entity";
// import { Dstate } from "./dstate.entity";

// @Index("uq_dacl", ["drole", "dstate", "next", "xdoctype", "xrole"], {
//   unique: true,
// })
// @Entity("dacl", { schema: "nlife" })
// export class Dacl {
//   @Column("integer", { name: "xdoctype", unique: true, primary: true })
//   xdoctype: number;

//   @Column("integer", { name: "dstate", unique: true })
//   dstate: number;

//   @Column("integer", { name: "next", nullable: true, unique: true })
//   next: number | null;

//   @Column("character varying", { name: "xrole", unique: true, length: 12 })
//   xrole: string;

//   @Column("character varying", { name: "drole", unique: true, length: 12 })
//   drole: string;

//   @Column("integer", { name: "acl", default: () => "0" })
//   acl: number;

//   @ManyToOne(() => Xrole, (xrole) => xrole.dacls, {
//     onDelete: "CASCADE",
//     onUpdate: "CASCADE",
//   })
//   @JoinColumn([{ name: "xrole", referencedColumnName: "xrole" }])
//   xrole2: Xrole;

//   @ManyToOne(() => Xdoctype, (xdoctype) => xdoctype.dacls, {
//     onDelete: "CASCADE",
//     onUpdate: "CASCADE",
//   })
//   @JoinColumn([{ name: "xdoctype", referencedColumnName: "xdoctype" }])
//   xdoctype2: Xdoctype;

//   @ManyToOne(() => Dstate, (dstate) => dstate.dacls, {
//     onDelete: "CASCADE",
//     onUpdate: "CASCADE",
//   })
//   @JoinColumn([
//     { name: "next", referencedColumnName: "next" },
//     { name: "dstate", referencedColumnName: "dstate" },
//   ])
//   dstate2: Dstate;
// }
