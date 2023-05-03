const info = {
  user_version: 3,
  up: `CREATE TABLE IF NOT EXISTS execution_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workspace_id INTEGER NOT NULL,
        parameters TEXT NOT NULL,
        seed INTEGER NOT NULL,
        sequence_number INTEGER NOT NULL
      )`,
  down: 'DROP TABLE execution_history',
};
export default info;
