export const DIR = {
  SRC: 'src',
  DST: 'dst',
  BUILD: 'public'
};

export const sass = {
  src: [
    `${DIR.SRC}/**/*.{scss,sass}`
  ],
  dst: `${DIR.DST}/css`
};

export const jade = {
  src: [
    `${DIR.SRC}/**/*.jade`
  ],
  dst: `${DIR.DST}/`
};

export const scripts = {
  browserifyOpts: {
    entries: [`./${DIR.SRC}/js/main.js`],
    transform: ['babelify']
  },
  dst: `${DIR.DST}/js`
};

export const serve = {
  open: 'external',
  reloadDebounce: 2000,
  ui: false,
  notify: false,
  startPath: '/',
  ghostMode: false,
  server: {
    baseDir: './',
    index: `${DIR.DST}/`,
    routes: {
      ['']: `${DIR.DST}/`
    }
  }
};

export const copy = {
  src: [
    `${DIR.DST}/**`,
    `!${DIR.DST}/js/**`
  ],
  dst: `${DIR.BUILD}/`
};

export const clean = {
  path: [`${DIR.BUILD}`]
};

export const uglify = {
  src: [
    `${DIR.DST}/js/**`
  ],
  dst: `${DIR.BUILD}/js`
};
