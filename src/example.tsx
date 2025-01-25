import util from 'util';

import { Condition, List, Value, Input, ComponentChildren } from './framework';

function Error({ message }: { message: Value<string> }) {
  return <div>{message}</div>;
}

function Wrapper({ children }: { children: ComponentChildren }) {
  return <div>{children}</div>;
}

let x: Input<string> | undefined = undefined;

function Component({ fullName }: { fullName: Value<string>}) {
  const search = new Input('hi');
  x = search;
  // const results = search.debounce(100).computed(
  //   async (search, abortSignal) => fetch(`/search?query=${search}`, { signal: abortSignal }),
  // );
  const results = search.debounce(100).computed((search) => ({ success: true, data: [{ name: search }, { name: search }, { name: search }] }));

  const firstName = fullName.computed((fullName) => fullName.split(' ')[0]);
  const efficiency = Value.computed([search, results], (search, results) => results.data.length / search.length);

  const resultsLength = results.get('data').get('length');

  return (
    <div>
      <Wrapper><h1>Hello {firstName}</h1></Wrapper>
      <><input class="search-box" onChange={() => search}/></>
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
            else={<Error message={fullName}/>}
          />
        )}
        else={<div>Loading!</div>}
      />
    </div>
  );
}

console.log(util.inspect(<Component fullName={new Value('x')} />, { depth: Infinity }));

console.log(util.inspect(x, { depth: Infinity }));
