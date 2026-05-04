import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";

@Entity({ name: "customer_flight_activity" })
@Unique(["loyaltyNumber", "year", "month"])
export class CustomerFlightActivity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "loyalty_number", type: "integer" })
  loyaltyNumber!: number;

  @Column({ type: "integer" })
  year!: number;

  @Column({ type: "integer" })
  month!: number;

  @Column({ name: "total_flights", type: "integer" })
  totalFlights!: number;

  @Column({ type: "integer" })
  distance!: number;

  @Column({ name: "points_accumulated", type: "integer" })
  pointsAccumulated!: number;

  @Column({ name: "points_redeemed", type: "integer" })
  pointsRedeemed!: number;

  @Column({ name: "dollar_cost_points_redeemed", type: "integer" })
  dollarCostPointsRedeemed!: number;
}
