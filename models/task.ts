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
  tableName: "task"
})
class Task extends Model<Task> {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @AllowNull(true)
  @Column(DataType.NUMBER)
  task_id: number;

  @AllowNull(true)
  @Column(DataType.NUMBER)
  type_id: number;

  @AllowNull(true)
  @Column(DataType.NUMBER)
  label_id: number;

  @AllowNull(true)
  @Column(DataType.NUMBER)
  status_id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  name: number;

  @AllowNull(true)
  @Column(DataType.STRING)
  description: number;

  @AllowNull(true)
  @Column(DataType.DATE)
  due_date: Date;
}

export default Task;
