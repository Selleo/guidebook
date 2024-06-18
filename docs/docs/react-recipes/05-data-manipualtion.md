# Data mutations and refetches

## Data revalidation

With the queryOptions approach for queries data refetches are pretty simple. You simply import necesary queryOptions and refetch on them like:

```tsx
    mutate(
      {
        data: parsedValues,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: currentUserQueryOptions.queryKey,
          });
        },
      }
    );
```

or

```tsx
 mutate(
      {
        data: parsedValues,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(currentUserQueryOptions);
        },
      }
    );
```
