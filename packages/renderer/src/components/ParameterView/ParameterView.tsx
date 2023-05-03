import Collapsible from 'react-collapsible';
import { SequenceType } from './SequenceType';
import { OutputPrefix } from './OutputPrefix';
import { Sources } from './Sources';
import { Treefile } from './Treefile';

import { ExecutionButton } from './ExecutionButton';
import { Seed } from './Seed';
import { ExecutionHistoryIterator } from './ExecutionHistoryIterator';

export const ParameterView = () => {
  return (
    <>
      <ExecutionButton />
      <ExecutionHistoryIterator />
      <Collapsible
        trigger={'Basic parameters'}
        transitionTime={1}
        open={true}
      >
        <table>
          <Sources />
          <Treefile />
          <SequenceType />
          <OutputPrefix />
          <Seed />
        </table>
      </Collapsible>
      <Collapsible
        trigger={'Advance parameters'}
        transitionTime={1}
      >
        <table>
          <Sources />
          <Treefile />
          <SequenceType />
          <OutputPrefix />
        </table>
      </Collapsible>
    </>
  );
};
