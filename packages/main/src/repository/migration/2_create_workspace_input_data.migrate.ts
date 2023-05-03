const info = {
  user_version: 2,
  up: `CREATE TABLE IF NOT EXISTS workspace_input_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workspace_id INTEGER NOT NULL,
        ref_name TEXT NOT NULL,
        type TEXT NOT NULL,
        input_path TEXT NOT NULL
      )`,
  down: 'DROP TABLE workspace_input_data',
};
export default info;
