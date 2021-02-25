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
  tableName: "task_label"
})
class TaskLabel extends Model<TaskLabel> {
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

export default TaskLabel;
