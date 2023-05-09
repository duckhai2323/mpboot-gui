const info = {
    user_version: 5,
    up: 'alter table execution_history add column source_hash TEXT',
    down: 'alter table execution_history drop column source_hash',
  };
  export default info;
  