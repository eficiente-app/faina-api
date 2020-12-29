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
  tableName: "projeto"
})
class Projeto extends Model<Projeto> {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  nome: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  descricao: number;

  @AllowNull(false)
  @Column(DataType.NUMBER)
  tipo: string;
}

export default Projeto;
