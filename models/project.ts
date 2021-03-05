import { Moment } from "moment";
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
  tableName: "project"
})
class Project extends Model<Project> {
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

  @AllowNull(false)
  @Column(DataType.NUMBER)
  type_id: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  start: Moment;

  @AllowNull(true)
  @Column(DataType.DATE)
  end: Moment;
}

export default Project;
