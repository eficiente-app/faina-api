import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table
} from "sequelize-typescript";

@Table({
  tableName: "schedule_type"
})
class ScheduleType extends Model<ScheduleType> {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  description: string;
}

export default ScheduleType;
