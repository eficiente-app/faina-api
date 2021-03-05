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
  tableName: "folder_folder"
})
class FolderFolder extends Model<FolderFolder> {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @AllowNull(false)
  @Column(DataType.NUMBER)
  parent_id: number;

  @AllowNull(false)
  @Column(DataType.NUMBER)
  folder_id: number;
}

export default FolderFolder;
