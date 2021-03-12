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
    tableName: "task_schedule"
  })
  class TaskSchedule extends Model<TaskSchedule> {
    @AutoIncrement
    @PrimaryKey
    @Column
    id: number;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    task_id: number;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    user_id: number;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    type_id: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    start: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    end: string;

    @AllowNull(true)
    @Column(DataType.INTEGER)
    prior_id: number;

    @AllowNull(true)
    @Column(DataType.INTEGER)
    next_id: number;
  }

  export default TaskSchedule;
