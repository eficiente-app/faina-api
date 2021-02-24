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
  tableName: "stage_type"
})
class StageType extends Model<StageType> {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  name: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  description: number;
}

export default StageType;
