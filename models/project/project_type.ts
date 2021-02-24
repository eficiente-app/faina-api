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
  tableName: "project_type"
})
class ProjectType extends Model<ProjectType> {
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

export default ProjectType;
