import util from 'util';
import { ComponentChildren } from './framework';

function Component({ children }: { children: ComponentChildren }) {
  return <div>{children}</div>;
}

console.log(util.inspect(
  <>
    <Component><h1>{'HI'.toLowerCase()}</h1></Component>
    <img src={'foo'} />
  </>
, { depth: Infinity }));
