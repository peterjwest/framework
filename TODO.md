# TODO

- Name
- Tests
- Docs
- Good examples
- Graph components/signals
- Look into virtual event https://github.com/preactjs/preact/blob/d7b47872734eafdd3fdc55eadd97898cf4232a86/src/diff/props#L29, also: https://github.com/preactjs/preact/issues/3927
- Support eventListener options
- Consider mapping List items to keys so that they can't be changed by side effects?
- Expose list item index
- Fix checked input property update
- Support async:
    - Abort signal
    - Debounce
    - Populate InputValue
        ```ts
        store.get('results').populate([data], (previousResults, data) => {
            return previousResults.map((result) => ({ ...result, data: data[result.id] }));
        });
        ```
    - Async inProgress
        ```ts
        const results = search.debounce(100).computed(
        async (search, abortSignal) => fetch(`/search?query=${search}`, { signal: abortSignal }),
        );
        ```
    - Look into functional tools e.g. Rambda
        ```ts
        store.get('results').populate([data], (previousResults, data) => {
            return update(previousResults, '[].data', (result) => data[result.id]))
        });
        ```
