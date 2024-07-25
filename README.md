<h1 align="center">Astro Typesafe Routes</h1>
<p align="center">A CLI for generating typesafe astro routes.</p>

<div align="center">
  <img src="https://i.imgur.com/Hc32hhK.gif" alt="Usage demo">
</div>


---

## Installation
```
npm install -D astro-typesafe-routes
```

## Usage
Add script to `package.json`
```
"scripts": {
  "generate-routes": "astro-typesafe-routes generate"
}
```

## Commands
- `generate` - Run code generation.
  - `-t, --trailing-slash` - Default to adding trailing slash to urls.
  - `-p, --pages-path <string>` - Path to Astro pages directory.
  - `-o, --out-path <string>` - Path to codegen to.
  - `-h, --help` - Show help
