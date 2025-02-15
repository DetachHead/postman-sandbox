describe('bootcode dependencies', function () {
    this.timeout(60 * 1000);

    var expect = require('chai').expect,
        env = require('../../lib/environment'),
        Bundle = require('../../lib/bundle'),
        currentDependencies;

    before(function (done) {
        process && process.stdout.write('  -- building dependencies, please wait... ');
        Bundle.load(env).listDependencies(function (err, dependencies) {
            currentDependencies = dependencies;
            console.info(err ? 'failed' : 'done');

            return done(err);
        });
    });

    it('should not change', function () {
        expect(currentDependencies).to.eql([
            'ajv',
            'array-filter',
            'assert',
            'assertion-error',
            'atob',
            'available-typed-arrays',
            'backbone',
            'base64-js',
            'boolbase',
            'browserify',
            'btoa',
            'buffer',
            'call-bind',
            'chai',
            'chai-postman',
            'charset',
            'check-error',
            'cheerio',
            'core-util-is',
            'crypto-js',
            'css-select',
            'css-what',
            'csv-parse',
            'deep-eql',
            'define-properties',
            'dom-serializer',
            'domelementtype',
            'domhandler',
            'domutils',
            'entities',
            'es-abstract',
            'es6-object-assign',
            'events',
            'faker',
            'fast-deep-equal',
            'fast-json-stable-stringify',
            'file-type',
            'foreach',
            'function-bind',
            'get-func-name',
            'get-intrinsic',
            'has',
            'has-symbols',
            'htmlparser2',
            'http-reasons',
            'iconv-lite',
            'ieee754',
            'inherits',
            'ip-regex',
            'is-arguments',
            'is-buffer',
            'is-generator-function',
            'is-nan',
            'is-typed-array',
            'isarray',
            'jquery',
            'json-schema-traverse',
            'liquid-json',
            'lodash',
            'lodash.assignin',
            'lodash.bind',
            'lodash.defaults',
            'lodash.filter',
            'lodash.flatten',
            'lodash.foreach',
            'lodash.map',
            'lodash.merge',
            'lodash.pick',
            'lodash.reduce',
            'lodash.reject',
            'lodash.some',
            'lodash3',
            'lru-cache',
            'mime-db',
            'mime-format',
            'mime-types',
            'moment',
            'nth-check',
            'object-is',
            'object-keys',
            'os-browserify',
            'path-browserify',
            'pathval',
            'postman-collection',
            'postman-sandbox',
            'postman-url-encoder',
            'process',
            'process-nextick-args',
            'psl',
            'punycode',
            'querystring-es3',
            'readable-stream',
            'safe-buffer',
            'safer-buffer',
            'sax',
            'semver',
            'stream-browserify',
            'string_decoder',
            'teleport-javascript',
            'timers-browserify',
            'tough-cookie',
            'tv4',
            'type-detect',
            'underscore',
            'uniscope',
            'uri-js',
            'url',
            'util',
            'util-deprecate',
            'uuid',
            'which-typed-array',
            'xml2js',
            'xmlbuilder',
            'yallist'
        ]);
    });
});
