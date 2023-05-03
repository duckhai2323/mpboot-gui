const info = {
  user_version: 4,
  up: 'create unique index idx_workspace_id_sequence_number on execution_history (workspace_id, sequence_number)',
  down: 'alter table execution_history drop index idx_workspace_id_sequence_number;',
};
export default info;
