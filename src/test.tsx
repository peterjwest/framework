import util from 'util';
import { ComponentChildren } from './framework';

function Component({ children }: { children: ComponentChildren }) {
  return <div>{children}</div>;
}

console.log(util.inspect(<Component><h1>HI</h1></Component>, { depth: Infinity }));
