import { renderElement, Condition, List, InputValue, Value, ComponentChildren, CreateState } from './framework';

function ErrorMessage({ message }: { message: Value<string> }) {
  return <div>{message}</div>;
}

function Section({ children }: { children: ComponentChildren }) {
  return <section>{children}</section>;
}

function NestedComponent({ query }: { query: Value<string> }, createState: CreateState) {
  const title = createState('x');
  const upper = query.computed((query) => query.toUpperCase());
  const repeated = upper.computed((query) => `${query} ${query} ${query}`);
  return <>
    <h1 class="title">{title}</h1>
    <Condition
      if={repeated.computed((value) => value.length)}
      then={() => <p class="repeated">{repeated}</p>}
    />
  </>;
}

type ComponentProps = {
  fullName: Value<string>
}

export function Component({ fullName }: ComponentProps, createState: CreateState) {
  const search = createState('hi');
  const count = createState(2);
  // const results = search.debounce(100).computed(
  //   async (search, abortSignal) => fetch(`/search?query=${search}`, { signal: abortSignal }),
  // );
  const results = Value.computed([search.debounce(100), count], (search, count) =>
    ({ success: true, data: Array(Math.max(0, count)).fill(undefined).map((_, index) => ({ id: index, name: search })) })
  );

  const firstName = fullName.computed((fullName) => fullName.split(' ')[0]);
  const ratio = Value.computed([search, count], (search, count) => search.length / count);

  const resultsLength = results.get('data').get('length');

  return (
    <article>
      <Section><h1>Hello {firstName} how are you?</h1></Section>
      <>
        <input class="search-box" value={search.extract()} onChange={(event) => {
          search.update((event.target as HTMLInputElement).value);
        }}/>
        <input type="number" class="search-box" value={count.extract()} onChange={(event) => {
          count.update(Number((event.target as HTMLInputElement).value));
        }}/>
      </>
      <NestedComponent query={search} />
      <Condition
        if={search.get('length')}
        then={() => (
          <Condition
            if={count}
            then={() => (
              <>
                <div>
                  Found {resultsLength} results for {search}
                  <pre>Ratio: {ratio}</pre>
                </div>
                <List data={results.get('data')} itemKey={'id'} each={(item) => {
                  const count = createState(0);
                  const username = fullName.computed((fullName) => fullName.toLowerCase());
                  return <div class="item">
                    <span>{item.get('name')} owned by {username} - </span>
                    <b>{count} </b>
                    <button onClick={() => {
                      count.update(count.extract() + 1);
                    }}>Increment</button>
                  </div>;
                }} />
              </>
            )}
            else={() => <ErrorMessage message={fullName}/>}
          />
        )}
        else={() => <div>Loading!</div>}
      />
    </article>
  );
}

renderElement(<Component fullName={new InputValue('x')}/>, document.body);
