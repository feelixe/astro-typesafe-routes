---
sidebar_position: 4
---

# Breaking Changes From v3

## Search Params
In v3 search params were passed to the field `search`
```tsx
<Link to="/" search={{ filter: "recent" }}>
  Click Me
</Link>
```
In v4, `search` is used for typed search params, and untyped search params are passed to `searchParams` instead. To migrate, simply replace `search` with `searchParams`
```tsx
<Link to="/" searchParams={{ filter: "recent" }}>
  Click Me
</Link>
```