import { ComponentChildren, CreateState } from './jsx';
import { Value, InputValue, DeriveValueListener } from './value';
import { renderElement, Condition, List, StateWatcher } from './framework';
import { TargetedEvent } from './util';

function ErrorMessage({ message }: { message: Value<string> }) {
  return <div>Error! {message}</div>;
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
      then={<p class="repeated">{repeated}</p>}
    />
  </>;
}

export function Component({}, createState: CreateState) {
  const fullName = createState('J W');
  const search = createState('hi');
  const count = createState(2);

  // TODO: Async
  // const results = search.debounce(100).computed(
  //   async (search, abortSignal) => fetch(`/search?query=${search}`, { signal: abortSignal }),
  // );
  const results = Value.computed([search, count], (search, count) =>
    ({ success: true, data: Array(Math.max(0, count)).fill(undefined).map((_, index) => ({ id: index, name: search })) })
  );

  const firstName = fullName.computed((fullName) => fullName.split(' ')[0]);
  const ratio = Value.computed([search, count], (search, count) => search.length / count);

  const resultsLength = results.get('data').get('length');

  return (
    <article>
      <Section><h1>Hello {firstName} how are you?</h1><a href="/foo">Link</a></Section>
      <>
        <input type="text" class="search-box" value={search.extract()} events={{ input: search.bind('value') }}/>
        <input type="number" class="search-box" value={count.extract()} events={{ input: count.bind('value', Number) }}/>
        <form>
          <select id="fruit" name="fruit">
            <option value="apple">Apple</option>
            <option value="banana">Banana</option>
            <option value="cabbage">Cabbage</option>
          </select>

          <textarea style="display: block;" events={{ input: search.bind('value') }} />
          <button formaction="/submit" formmethod="get">Submit</button>
        </form>
      </>
      <NestedComponent query={search} />
      <Condition
        if={search.get('length')}
        then={() => (
          <Condition
            if={count}
            then={() => (
              <>
                <div data-count={resultsLength}>
                  Found {resultsLength} results for {search}
                  <pre>Ratio: {ratio}</pre>
                </div>
                <List data={results.get('data')} itemKey={'id'} each={(item) => {
                  const count = createState(0);
                  const username = fullName.computed((fullName) => fullName.toLowerCase());
                  return <div class="item">
                    <span>{item.get('name')} owned by {username} - </span>
                    <b>{count} </b>
                    <button events={{ click: () => count.update(count.extract() + 1)}}>Increment</button>
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

const listener = new DeriveValueListener([]);
(document as any).listener = listener;
renderElement(<Component/>, document.body, new StateWatcher(), new InputValue(0), listener);
