import { createInput, compute, Condition, List, Input } from 'framework';

function Component(fullName) {
  const search = createInput(false);
  const results = search.debounce(100).compute(
    async (search, abortSignal) => fetch(`/search?query=${search}`, { signal: abortSignal }),
  );

  const firstName = fullName.compute((fullName) => fullName.split(' ')[0]);
  const efficiency = compute([search, results], (search, results) => results.data.length / search.length);

  return (
    <div>
      <h1>Hello {firstName}</h1>
      <input class="search-box" onChange={search}/>
      <Condition
        if={results.resolved()}
        then={() => (
          <Condition
            if={results.get('success')}
            then={() => (
              <>
                <div>
                  Found {results.get('data.length')} results for {search}
                  Efficiency: {efficiency}
                </div>
                <List data={results.get('data')} element={(item) => {
                  const username = fullName.compute((fullName) => fullName.toLowerCase());
                  return <div class="item">{item.get('name')} owned by {username}</div>;
                }} />
              </>
            )}
            else={<Error name={fullName}/>}
          />
        )}
        else={<Loading />}
      />
    </div>
  );
}
