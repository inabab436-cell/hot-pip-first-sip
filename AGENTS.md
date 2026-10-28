<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Frontend design
- Keep global visual tokens and responsive campaign layout rules in src/styles.css, with page controls composed from shared UI components; this keeps the Arabic campaign consistent and themeable.
- Keep the waitlist's existing browser Cloud insert and aggregate count behavior during presentation-only redesigns; visual changes must not alter data access or registration fields.
