import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";

@Entity({ name: "customer_loyalty_history" })
@Unique(["loyaltyNumber"])
export class CustomerLoyaltyHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "loyalty_number", type: "integer" })
  loyaltyNumber!: number;

  @Column({ type: "varchar", length: 128 })
  country!: string;

  @Column({ type: "varchar", length: 128 })
  province!: string;

  @Column({ type: "varchar", length: 128 })
  city!: string;

  @Column({ name: "postal_code", type: "varchar", length: 32 })
  postalCode!: string;

  @Column({ type: "varchar", length: 32 })
  gender!: string;

  @Column({ type: "varchar", length: 64, nullable: true })
  education!: string | null;

  @Column({ type: "real", nullable: true })
  salary!: number | null;

  @Column({ name: "marital_status", type: "varchar", length: 32 })
  maritalStatus!: string;

  @Column({ name: "loyalty_card", type: "varchar", length: 32 })
  loyaltyCard!: string;

  @Column({ type: "real" })
  clv!: number;

  @Column({ name: "enrollment_type", type: "varchar", length: 64 })
  enrollmentType!: string;

  @Column({ name: "enrollment_year", type: "integer" })
  enrollmentYear!: number;

  @Column({ name: "enrollment_month", type: "integer" })
  enrollmentMonth!: number;

  @Column({ name: "cancellation_year", type: "integer", nullable: true })
  cancellationYear!: number | null;

  @Column({ name: "cancellation_month", type: "integer", nullable: true })
  cancellationMonth!: number | null;
}
