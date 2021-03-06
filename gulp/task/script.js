import gulp from 'gulp';
import browserify from 'browserify';
import watchify from 'watchify';
import licensify from 'licensify';
import { gutil } from '../plugins';
import source from 'vinyl-source-stream';
import { scripts as conf } from '../conf';

const bundler = isWatch => {
  const { browserifyOpts } = conf;
  let b;

  if (isWatch) {
    // browserifyOpts.debug = true;
    browserifyOpts.cache = {};
    browserifyOpts.packageCache = {};
    browserifyOpts.fullPath = true;
    b = watchify(browserify(browserifyOpts));
  } else {
    b = browserify(browserifyOpts);
  }

  b.plugin(licensify);

  const bundle = () => {
    return b.bundle()
      .on('error', error => {
        gutil.log(
          gutil.colors.bgRed.white.bold('BUNDLE ERROR'),
          error.message,
          `\n${error.codeFrame}`
        );
      })
      .pipe(source('main.js'))
      .pipe(gulp.dest(conf.dst));
  };

  b
  .on('update', bundle)
  .on('log', message => {
    gutil.log(
      gutil.colors.green.bold('BUNDLE'),
      gutil.colors.magenta(conf.browserifyOpts.entries),
      message
    );
  });

  return bundle();
};


gulp.task('browserify', () => {
  return bundler();
});

gulp.task('watchify', () => {
  return bundler(true);
});
