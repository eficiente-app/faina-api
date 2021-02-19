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

    @AllowNull(false)
    @Column(DataType.INTEGER)
    task_id: number;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    type_id: number;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    label_id: number;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    status_id: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    name: string;
  
    @AllowNull(false)
    @Column(DataType.STRING)
    description: string;
  
    @AllowNull(false)
    @Column(DataType.STRING)
    due_date: string;
  }
  
  export default Task;
  