import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface NoteAttributes {
  id: number;
  userId: number;
  title: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type NoteCreationAttributes = Optional<NoteAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Note extends Model<NoteAttributes, NoteCreationAttributes> implements NoteAttributes {
  public id!: number;
  public userId!: number;
  public title!: string;
  public content!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Note.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'user_id' },
    title: { type: DataTypes.STRING(100), allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
  },
  {
    sequelize,
    tableName: 'notes',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    indexes: [{ fields: ['user_id'] }],
  },
);
