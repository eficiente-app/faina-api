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
    tableName: "task_schedule_user"
  })
  class TaskScheduleUser extends Model<TaskScheduleUser> {
    @AutoIncrement
    @PrimaryKey
    @Column
    id: number;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    schedule_id: number;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    user_id: number;

    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    requiered: boolean;

    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    confirm: boolean;
  }

  export default TaskScheduleUser;
