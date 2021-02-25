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
  name: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  description: string;
}

export default TaskLabel;
