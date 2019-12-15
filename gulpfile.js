'use strict';

const gulp = require('gulp');
const del = require('del');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const debug = require('gulp-debug');
const gutil = require( 'gulp-util' );
const ftp = require( 'vinyl-ftp' );
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');
// const plumber = require('gulp-plumber');
// const eslint = require('gulp-eslint');
// const through2 = require('through2');
// const fs = require('fs');
// const combiner = require('stream-combiner2').obj;
// const remember = require('gulp-remember');
// const sassInheritance = require('gulp-sass-multi-inheritance');
// const cached = require('gulp-cached');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const pathNames = {
  src: {
    assets: ['dev/fonts/**/*.+(eot|svg|ttf|woff|woff2)'],
    img: ['dev/img/**/*.+(gif|png|jpg|jpeg)', 'dev/css/themes/readyshop/img/**/*.+(gif|png|jpg|jpeg)'],
    cssLib: ['dev/css/normalize.css'],
    cssFonts: ['dev/fonts/**/*.css'],
    sassLib: ['dev/css/*.scss', '!dev/css/themes/**/*.scss'],
    sassTheme: ['dev/css/themes/readyshop/**/*.scss'],
    js: ['dev/js/**/*.js', '!dev/**/*.es6.js', '!dev/js/admin.js'],
    jsES6: ['dev/js/**/*.es6.js']
  }
};
const dest = 'dist';
const base = 'dev';
const baseAdmin = 'dev_admin';

const ftpDataDefault = {
  host: '',
  user: '',
  pass: '',
  parallel: 5,
  log: gutil.log,
  src: 'dist/**/*.*',
  dest: '/sites/all/themes/jflex/library/',
  destAdmin: '/sites/all/themes/jflex_admin/'
};
let ftpData = {
  flexorm: {
    host: 'core.jetoflex.com',
    user: 'flex',
    pass: '4Q9a5Q6k',
    dest: '/core.jetoflex.com/sites/all/themes/jflex/library/',
    destAdmin: '/core.jetoflex.com/sites/all/themes/jflex_admin/'
  },
  jeto: {
    host: 'jeto.online',
    user: 'front_all',
    pass: '3T5u2D0v',
    dest: '/themes/jflex/library/',
    destAdmin: '/themes/jflex_admin/'
  },
  // fashion: {
  //   host: 'fashion.jetoflex.ru',
  //   user: 'fashion_jeto',
  //   pass: '9H5e6B7c'
  // },
  // pradiz: {
  //   host: 'pradizdev.ru',
  //   user: 'pradiz_jeto',
  //   pass: 'E0r6Z4v1'
  // },
  // seledka: {
  //   host: 'seledka-fit.ru',
  //   user: 'seledka_fit_jeto',
  //   pass: '1F3i2I4u'
  // },
  planshets: {
    host: 'planshets.ru',
    user: 'planshets_jeto',
    pass: '0Q0o6R0e'
  },
  bagforman: {
    host: 'bagforman.ru',
    user: 'bagforman',
    pass: '8N3u1Y2v'
  },
  dropbag: {
    host: 'dropbag.ru',
    user: 'dropbag',
    pass: '5C3d5P9t'
  },
  // bagformandev: {
  //   host: 'dev.bagforman.ru',
  //   user: 'bagformandev',
  //   pass: 'U8u2L1z8'
  // },
  // jetoflex: {
  //   host: 'jetoflex.ru',
  //   user: 'jetoflex',
  //   pass: '5N3b6M3f'
  // },
  // ks1000: {
  //   host: 'ks1000.ru',
  //   user: 'ks1000',
  //   pass: '9X1e4V6e',
  //   dest: '/themes/jflex/library/',
  //   destAdmin: '/themes/jflex_admin/'
  // },
  cosmosuit: {
    host: 'cosmosuit.org',
    user: 'cosmosuit',
    pass: 'V6i8A2n5'
  },
  newjeto: {
    host: 'jetoflex.com',
    user: 'jetoflex',
    pass: 'K4g2B0y9'
  }
};

for(let key in ftpData) {
  ftpData[key] = Object.assign({}, ftpDataDefault, ftpData[key]);
}

gulp.task('clean', () => {
  console.log(isDevelopment);
  console.log(process.env.NODE_ENV);
  return del(dest);
});

gulp.task('lint', () => {
  return gulp.src(pathNames.src.js);
});

gulp.task('assets', () => {
  return gulp.src(pathNames.src.assets, {base: base, since: gulp.lastRun('assets')})
    /*.on('data', (file) => {
      console.log({
        contents: file.contents,
        path: file.path,
        cwd: file.cwd,
        base: file.base,
        relative: file.relative,
        dirname: file.dirname,
        basename: file.basename,
        stem: file.stem,
        extname: file.extname
      });
      //console.dir(file);
    })*/
    .pipe(newer(dest))
    //.pipe(debug({title: 'assets'}))
    .pipe(gulp.dest(dest));
});

gulp.task('img', () => {
  return gulp.src(pathNames.src.img, {base: base, since: gulp.lastRun('img')})
    .pipe(newer(dest))
    .pipe(imagemin())
    //.pipe(debug({title: 'img'}))
    .pipe(gulp.dest(dest));
});

gulp.task('css:lib', () => {
  return gulp.src(pathNames.src.cssLib, {base: base, since: gulp.lastRun('css:lib')})
    .pipe(newer(dest))
    .pipe(cleanCSS({rebaseTo: ''}))
    .pipe(gulp.dest(dest));
});

gulp.task('css:fonts', () => {
  return gulp.src(pathNames.src.cssFonts, {base: base, since: gulp.lastRun('css:fonts')})
    .pipe(newer(dest))
    .pipe(cleanCSS({rebaseTo: ''}))
    .pipe(gulp.dest(dest));
});

gulp.task('sass:lib', () => {
  return gulp.src(pathNames.src.sassLib, {base: base/*, since: gulp.lastRun('sass:lib')*/})
    //.pipe(newer(dest))
    .pipe(debug({title: 'sass:lib'}))
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    //.pipe(remember('sass:lib'))
    .pipe(sass().on('error', notify.onError()))
    .pipe(cleanCSS({rebaseTo: ''}))
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulp.dest(dest))
    .pipe(debug({title: 'sass:lib:output'}));
});

gulp.task('sass:theme', () => {
  return gulp.src(pathNames.src.sassTheme, {base: base/*, since: gulp.lastRun('sass:theme')*/})
    //.pipe(newer(dest))
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({rebaseTo: ''}))
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulp.dest(dest));
});

gulp.task('js', () => {
  return gulp.src(pathNames.src.js, {base: base, since: gulp.lastRun('js')})
    .pipe(newer(dest))
    //.pipe(debug({title: 'js'}))
   /* .pipe(eslint({
      configFile: 'eslint.json'/!*,
      globals: [
        'jQuery',
        '$'
      ]*!/
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())*/
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(gulpIf(!isDevelopment, uglify()))
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulp.dest(dest));
});

gulp.task('js:ES6', () => {
  return gulp.src(pathNames.src.jsES6, {base: base, since: gulp.lastRun('js:ES6')})
    /*.pipe(newer({
      dest: dest,
      map: function (relative) {
        return relative.replace('.es6', '');
      }
    }))*/
    //.pipe(debug({title: 'js:ES6'}))
    /*.pipe(plumber({
      errorHandler: notify.onError
    }))*/
    //.pipe(debug({title: 'js:ES6:1'}))
    /*.pipe(eslint({
      configFile: 'eslint.json'
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())*/
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(babel({
      presets: ['es2015'],
      //plugins: ["transform-runtime"]
    }))
    .pipe(gulpIf(!isDevelopment, uglify()))
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(rename((path) => {
      //console.dir(path);

      let pattern = '.es6';
      let newName = path.basename.slice(0, path.basename.indexOf(pattern));

      path.basename = newName;
    }))
    //.pipe(debug({title: 'js:ES6:2'}))
    .pipe(gulp.dest(dest));
});

gulp.task('watch', () => {
  gulp.watch(pathNames.src.assets, gulp.series('assets'));

  gulp.watch(pathNames.src.cssLib, gulp.series('css:lib'));
  gulp.watch(pathNames.src.cssFonts, gulp.series('css:fonts'));

  gulp.watch('dev/css/**/*.scss', gulp.series('sass:lib'));
  gulp.watch(pathNames.src.sassTheme, gulp.series('sass:theme'));

  gulp.watch(pathNames.src.js, gulp.series('js'));
  gulp.watch(pathNames.src.jsES6, gulp.series('js:ES6'));
});

gulp.task('build', gulp.series('clean', 'assets', 'img', 'css:fonts', 'sass:theme', 'css:lib', 'sass:lib', 'js', 'js:ES6'));

gulp.task('default', gulp.series('build'));

gulp.task('dev', gulp.series('build', 'watch'));

/*FTP tasks*/
gulp.task('ftp:jflex', (callback) => {
  let ftpTasksArr = [];
  let index = 0;
  //let pipe;

  for(let key in ftpData) {
    let currFtpData = ftpData[key];
    //console.dir(currFtpData);

    //let func = ;
    let taskName = currFtpData.host; //`ftp-task-${index}`;
    gulp.task(taskName, () => {
      let conn = ftp.create({
        host: currFtpData.host,
        user: currFtpData.user,
        pass: currFtpData.pass,
        parallel: currFtpData.parallel,
        log: gutil.log
      });

      return gulp.src(currFtpData.src, {base: dest, buffer: false})
        .pipe(conn.newer(currFtpData.dest))
        .pipe(conn.dest(currFtpData.dest));
        //.pipe(conn.clean(currFtpData.dest + 'jflex/library/', currFtpData.src));
    });

    ftpTasksArr.push(taskName);
    index++;
  }

  console.dir(ftpTasksArr);

  gulp.series(ftpTasksArr)(callback);
  //callback();
});

gulp.task('ftp:jflex-admin', (callback) => {
  let ftpTasksArr = [];
  let index = 0;

  for(let key in ftpData) {
    let currFtpData = ftpData[key];

    let taskName = currFtpData.host; //`ftp-task-${index}`;
    gulp.task(taskName, () => {
      let conn = ftp.create({
        host: currFtpData.host,
        user: currFtpData.user,
        pass: currFtpData.pass,
        parallel: currFtpData.parallel,
        log: gutil.log
      });

      return gulp.src(baseAdmin + '/**/*.*', {base: baseAdmin, buffer: false})
        .pipe(conn.newer(currFtpData.destAdmin))
        .pipe(conn.dest(currFtpData.destAdmin));
        //.pipe(conn.clean(currFtpData.dest + 'jflex_admin/', baseAdmin));
    });

    ftpTasksArr.push(taskName);
    index++;
  }

  console.dir(ftpTasksArr);

  gulp.series(ftpTasksArr)(callback);
  //callback();
});

gulp.task('ftp:all', gulp.series('ftp:jflex', 'ftp:jflex-admin'));

gulp.task('ftp:flexorm:flex', () => {
  return ftpFlex(ftpData.flexorm);
});
gulp.task('ftp:flexorm:admin', () => {
  return ftpFlexAdmin(ftpData.flexorm);
});
gulp.task('ftp:flexorm', gulp.series('ftp:flexorm:flex', 'ftp:flexorm:admin'));

gulp.task('ftp:newjeto:flex', () => {
  return ftpFlex(ftpData.newjeto);
});
gulp.task('ftp:newjeto:admin', () => {
  return ftpFlexAdmin(ftpData.newjeto);
});
gulp.task('ftp:newjeto', gulp.series('ftp:newjeto:flex', 'ftp:newjeto:admin'));

function ftpFlex(data) {
  let conn = ftp.create({
    host: data.host,
    user: data.user,
    pass: data.pass,
    parallel: data.parallel,
    log: gutil.log
  });
  let globs = `${dest}/**/*.*`;

  return gulp.src(globs, {base: dest, buffer: false})
    .pipe(conn.newer(data.dest))
    .pipe(conn.dest(data.dest));
}

function ftpFlexAdmin(data) {
  let conn = ftp.create({
    host: data.host,
    user: data.user,
    pass: data.pass,
    parallel: 5,
    log: gutil.log
  });

  let globs = `${baseAdmin}/**/*.*`;

  return gulp.src(globs, {base: baseAdmin, buffer: false})
    .pipe(conn.newer(data.destAdmin))
    .pipe(conn.dest(data.destAdmin));
}

function ftpFlexAll(data) {
  let conn = ftp.create({
    host: data.host,
    user: data.user,
    pass: data.pass,
    parallel: data.parallel,
    log: gutil.log
  });
  let globsFlex = `${dest}/**/*.*`;
  let globsAdmin = `${baseAdmin}/**/*.*`;

  return gulp.src(globsFlex, {base: dest, buffer: false})
    .pipe(conn.newer(data.dest))
    .pipe(conn.dest(data.dest))
    .pipe();
}
