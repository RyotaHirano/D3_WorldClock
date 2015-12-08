import gulp from 'gulp';
import requireDir from 'require-dir';
import runSequence from 'run-sequence';
import { reload } from 'browser-sync';
import { DIR } from './gulp/conf';

requireDir('./gulp/task');

gulp.task('predefault', cb => {
  runSequence(
    ['jade', 'sass', 'watchify'],
    'serve',
    cb
  );
});

gulp.task('default', ['predefault'], () => {
  gulp.watch(
    [`${DIR.SRC}/**/*.jade`],
    ['jade', reload]
  );
  gulp.watch(
    [`${DIR.SRC}/**/*.{scss,sass}`],
    ['sass', reload]
  );
  gulp.watch(
    [`${DIR.SRC}/**/*.js`],
    reload
  );
});

gulp.task('build', cb => {
  runSequence(
    'clean',
    ['jade', 'sass', 'browserify'],
    'uglify',
    'copy',
    cb
  )
});
