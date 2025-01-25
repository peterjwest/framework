import util from 'util';
import { Condition, List, ComponentChildren } from './framework';

function Component({ children }: { children: ComponentChildren }) {
  return <div>{children}</div>;
}

console.log(util.inspect(
  <>
    <Component><h1>{'HI'.toLowerCase()}</h1></Component>
    <img src={'foo'} />
    <Condition if={{}} then={() =>
      <div>HI</div>
    }></Condition>
    <List data={{}} element={(item) => <p>{item}</p>}></List>
  </>
, { depth: Infinity }));
