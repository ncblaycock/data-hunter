import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "data_dictionary" })
export class DataDictionaryRow {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "dictionary_table", type: "varchar", length: 256 })
  tableName!: string;

  @Column({ name: "field_name", type: "varchar", length: 256 })
  fieldName!: string;

  @Column({ type: "text" })
  description!: string;
}
