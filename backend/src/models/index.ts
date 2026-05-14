import { sequelize } from '../config/database';
import { User } from './User';
import { Note } from './Note';

User.hasMany(Note, { foreignKey: 'userId', as: 'notes', onDelete: 'CASCADE' });
Note.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { User, Note, sequelize };

export const syncDatabase = async (force = false): Promise<void> => {
  await sequelize.sync({ force, alter: !force });
};
