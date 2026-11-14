# the-psp-verse

Personal portfolio site for Sai Pratik Pendli — live at [www.pspverse.com](https://www.pspverse.com).

A static site: plain HTML, CSS and JS with Bootstrap 5 loaded from a CDN. No build step.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Structure

| Path | Purpose |
| --- | --- |
| `index.html` | Single-page site (landing, intro, portfolio, contact) and project modals |
| `css/styles.css` | Custom styles |
| `js/particles.js` | Interactive particle background |
| `stock_analysis_dashboard.html` | Embedded Power BI dashboard |
| `particles.html` | Particle animation sandbox (not linked) |
| `img/`, `doc/` | Images/GIFs and résumé PDF |

## Related

- **Services / PSP Labs** — [labs.pspverse.com](https://labs.pspverse.com), maintained in a separate repo.

## Branches

- `main` — deployed via GitHub Pages
- `claude-edits` — in-progress next version

## License

See [LICENSE](LICENSE).
