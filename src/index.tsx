import { renderElement, Condition, List, Value, Input, ComponentChildren, CreateState } from './framework';

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
  const count = createState(1);
  // const results = search.debounce(100).computed(
  //   async (search, abortSignal) => fetch(`/search?query=${search}`, { signal: abortSignal }),
  // );
  const results = Value.computed([search.debounce(100), count], (search, count) => ({ success: true, data: Array(count).fill({ name: search }) }));

  const firstName = fullName.computed((fullName) => fullName.split(' ')[0]);
  const ratio = Value.computed([search, count], (search, count) => search.length / count);

  const resultsLength = results.get('data').get('length');

  return (
    <article>
      <Section><h1>Hello {firstName} how are you?</h1></Section>
      <>
        {/* TODO: Support attributes */}
        <input class="search-box" value={Value.extract(search)} onChange={(event) => {
          search.update((event.target as HTMLInputElement).value);
        }}/>
        <input type="number" class="search-box" value={Value.extract(count)} onChange={(event) => {
          count.update(Number((event.target as HTMLInputElement).value));
        }}/>
      </>
      <NestedComponent query={search} />
      <Condition
        if={resultsLength}
        then={() => (
          <Condition
            if={count}
            then={() => (
              <>
                <div>
                  Found {resultsLength} results for {search}
                  <pre>Ratio: {ratio}</pre>
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
    </article>
  );
}

renderElement(<Component fullName={new Value('x')}/>, document.body);
