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
  tableName: "folder_type"
})
class FolderType extends Model<FolderType> {
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

export default FolderType;