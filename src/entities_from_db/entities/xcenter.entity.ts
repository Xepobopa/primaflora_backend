import { Column, Entity, Index, OneToMany } from "typeorm";
import { Nkartar } from "./nkartar.entity";

@Index("pk_xcenter", ["xcenter"], { unique: true })
@Entity("xcenter", { schema: "nlife" })
export class Xcenter {
  @Column("uuid", { primary: true, name: "xcenter" })
  xcenter: string;

  @Column("character varying", { name: "name", nullable: true, length: 64 })
  name: string | null;

  @Column("character varying", { name: "address", nullable: true, length: 255 })
  address: string | null;

  @Column("boolean", { name: "is_central", nullable: true })
  isCentral: boolean | null;

  @OneToMany(() => Nkartar, (nkartar) => nkartar.xcenter2)
  nkartars: Nkartar[];
}
