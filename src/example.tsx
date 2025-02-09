import util from 'util';

import { processElement, Condition, List, Value, Input, ComponentChildren, CreateState, DeriveValueListener } from './framework';

function ErrorMessage({ message }: { message: Value<string> }) {
  return <div>{message}</div>;
}

function Wrapper({ children }: { children: ComponentChildren }) {
  return <div>{children}</div>;
}

let x: Input<string> | undefined = undefined;

function NestedComponent({ query }: { query: Value<string> }, createState: CreateState) {
  const title = createState('x');
  const upper = query.computed((query) => query.toUpperCase());
  const repeated = upper.computed((query) => query + query);
  return <><h1>{title}</h1><p>{repeated}</p></>;
}

type ComponentProps = {
  fullName: Value<string>
}

export function Component({ fullName }: ComponentProps, createState: CreateState) {
  const search = createState('hi');
  x = search;
  // const results = search.debounce(100).computed(
  //   async (search, abortSignal) => fetch(`/search?query=${search}`, { signal: abortSignal }),
  // );
  const results = search.debounce(100).computed((search) => ({ success: true, data: Array(search.length).fill({ name: search }) }));

  const firstName = fullName.computed((fullName) => fullName.split(' ')[0]);
  const efficiency = Value.computed([search, results], (search, results) => results.data.length / search.length);

  const resultsLength = results.get('data').get('length');

  return (
    <div>
      <Wrapper><h1>Hello {firstName} how are you?</h1></Wrapper>
      <><input class="search-box" onChange={() => search}/></>
      <NestedComponent query={search} />
      <Condition
        if={resultsLength}
        then={() => (
          <Condition
            if={results.get('success')}
            then={() => (
              <>
                <div>
                  Found {resultsLength} results for {search}
                  Efficiency: {efficiency}
                </div>
                <List data={results.get('data')} element={(item) => {
                  const username = fullName.computed((fullName) => fullName.toLowerCase());
                  return <div class="item">{item.get('name')} owned by {username}</div>;
                }} />
              </>
            )}
            else={() => <ErrorMessage message={fullName}/>}
          />
        )}
        else={() => <div>Loading!</div>}
      />
    </div>
  );
}

const component = <Component fullName={new Value('x')}/>;
console.log(util.inspect(component, { depth: Infinity }));
console.log(util.inspect(processElement(component), { depth: Infinity }));

// console.log(util.inspect(x, { depth: Infinity }));

// const y = x as unknown as Input<string>;
// y.update('xxx');

// console.log(util.inspect(x, { depth: Infinity }));


