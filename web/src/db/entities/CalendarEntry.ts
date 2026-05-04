import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";

@Entity({ name: "calendar" })
@Unique(["date"])
export class CalendarEntry {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 16 })
  date!: string;

  @Column({ name: "start_of_year", type: "varchar", length: 16 })
  startOfYear!: string;

  @Column({ name: "start_of_quarter", type: "varchar", length: 16 })
  startOfQuarter!: string;

  @Column({ name: "start_of_month", type: "varchar", length: 16 })
  startOfMonth!: string;
}
