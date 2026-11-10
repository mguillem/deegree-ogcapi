# Frontend app

For local development start:

```
docker run -it --rm -v $PWD:/app --workdir=/app -p 8080:8080 node npm run serve
```

and open http://localhost:8080/to-be-replaced-by-context-path

Mock data has to be in public/mockdata and files end with `.json`

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
