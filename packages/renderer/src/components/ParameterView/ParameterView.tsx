import Collapsible from 'react-collapsible';
import { SequenceType } from './SequenceType';
import { OutputPrefix } from './OutputPrefix';
import { Sources } from './Sources';
import { Treefile } from './Treefile';
import './ParameterView.css';
import { ExecutionButton } from './ExecutionButton';

export const ParameterView = () => {
  return (
    <>
      <ExecutionButton />
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
