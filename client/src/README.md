# Search Feature Architecture

### This feature follows a strict separation of concerns.

- View
- Container
- Hooks
- Mapper
- API Layer

### Each Layer

1. View Layer (views/)
   ### Responsibility:
   - Pure UI rendering.
     - Displays search results, loading states, and error states
     - Receives fully prepared props from the container
     - Contains no business logic
     - Contains no API calls
     - Contains no mapping or query building
   - Rule:
     A View must never know where data comes from.

Example

```tsx
<SearchHeritagePage items={items} isLoading={isLoading} />
```

2. Container Layer (containers/)
   ### Responsibility:
   - Reads URL parameters and builds search params
   - Calls hooks to fetch data
   - Converts raw API DTOs into View Models (VM)
   - Passes final props into the View
   - Rule:
     A Container connects layers, but does not implement them.

- Example
  - URL → params
  - params → hook
  - DTO → VM
  - VM → View

3. Hooks Layer (hooks/)
   ### Responsibility:
   State management + lifecycle.
   - Handles loading state
   - Handles error state
   - Calls the API layer through a clean function
   - Does NOT build query strings
   - Does NOT map DTO → VM

- Rule:
  A Hook is a black box that takes parameters and returns data + state.

- Example

```ts
return { data, isLoading, error };
```

4. Mapper Layer (mappers/)
   ### Responsibility:
   Pure transformation logic.
   This layer contains only functions that convert data:
   ### Request Mappers
   - Domain params → URL query string
   - Example
     ```ts
     HeritageSearchParams → URLSearchParams
     ```
   ### Response Mappers
   - Example
     ```ts
     ApiWorldHeritageDto → WorldHeritageVm
     ```
5. API Layer (api/)
   ### Responsibility:
   External communication only.
   - Encapsulates all API calls
   - Returns raw DTOs
   - Does NOT handle query building
   - Does NOT handle data transformation

- Rule:
  The API layer is the only layer that knows about endpoints and DTOs.

- Example

```ts
export async function searchHeritagesApi(...)
```

### Summary Table

| Layer     | Responsibility                 | Rule                                                   |
| --------- | ------------------------------ | ------------------------------------------------------ |
| View      | Pure UI rendering              | Must never know where data comes from                  |
| Container | Connects layers, prepares data | Does not implement logic, just connects                |
| Hooks     | State management, lifecycle    | A black box that takes params and returns data + state |
| Mapper    | Pure transformation logic      | Contains only functions that convert data              |
| API       | External communication only    | The only layer that knows about endpoints and DTOs     |
