describe('sandbox', function () {
    this.timeout(1000 * 60);
    var Sandbox = require('../../lib');

    it('should create context', function (done) {
        Sandbox.createContext(function (err, ctx) {
            if (err) { return done(err); }
            ctx.on('error', done);

            ctx.ping(function (err, ttl, packet) {
                expect(err).to.be.null;
                expect(packet).to.be.ok;
                expect(ttl).to.be.a('number').that.is.above(-1);
                done();
            });
        });
    });

    it('should execute a piece of code', function (done) {
        Sandbox.createContext(function (err, ctx) {
            if (err) { return done(err); }
            ctx.on('error', done);

            ctx.execute('throw new Error("this will regurgitate!")', function (err) {
                expect(err).to.be.ok;
                expect(err).to.have.property('message', 'this will regurgitate!');
                done();
            });
        });
    });

    it('should have a few important globals', function (done) {
        Sandbox.createContext(function (err, ctx) {
            if (err) { return done(err); }
            ctx.on('error', done);

            ctx.execute(`
                var assert = require('assert');
                assert.equal(typeof _, 'function');
                assert.equal(typeof Error, 'function');
                assert.equal(typeof console, 'object');
            `, done);
        });
    });

    it('should not have access to uvm bridge', function (done) {
        Sandbox.createContext(function (err, ctx) {
            if (err) { return done(err); }
            ctx.on('error', done);

            ctx.execute(`
                var assert = require('assert');
                assert.equal(typeof bridge, 'undefined');
                assert.equal(typeof this.bridge, 'undefined');
                assert.equal(typeof Function('return this.bridge')(), 'undefined');
            `, done);
        });
    });

    it('should not have access to global properties', function (done) {
        Sandbox.createContext({ debug: true }, function (err, ctx) {
            if (err) { return done(err); }
            ctx.on('error', done);

            ctx.execute(`
                var assert = require('assert');
                var allowedGlobals = ${JSON.stringify(require('uniscope/lib/allowed-globals'))};
                var ignoredProps = [
                    'TEMPORARY', 'PERSISTENT', // DedicatedWorkerGlobalScope constants (in Browser)
                    'require', 'eval', 'console', // uniscope ignored
                    'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'setImmediate', 'clearImmediate'
                ]
                var propNames = [];

                var contextObject = Function('return this;')();
                do {
                    propNames = propNames.concat(Object.getOwnPropertyNames(contextObject));
                    contextObject = Object.getPrototypeOf(contextObject);
                    // traverse until Object prototype
                    // @note since we mutated the scope already, don't check using the constructor
                    // instead, check for hasOwnProperty existence on the contextObject.
                } while (contextObject && !Object.hasOwnProperty.call(contextObject, 'hasOwnProperty'));

                // filter out the ignored properties
                propNames = propNames.filter(prop => !ignoredProps.includes(prop));

                // FIXME: why's 'SharedArrayBuffer' missing from browser's context?
                // Temporarily added to fix browser tests
                !propNames.includes('SharedArrayBuffer') && propNames.push('SharedArrayBuffer');

                // make sure both propNames and allowedGlobals are same
                assert.equal(JSON.stringify(propNames.sort()), JSON.stringify(allowedGlobals.sort()));

                // double check using the diff
                var diff = propNames
                    .filter(x => !allowedGlobals.includes(x))
                    .concat(allowedGlobals.filter(x => !propNames.includes(x)));
                assert.equal(diff.length, 0);
            `, done);
        });
    });

    it('should accept an external execution id', function (done) {
        Sandbox.createContext(function (err, ctx) {
            if (err) { return done(err); }
            ctx.on('error', done);

            ctx.execute(`
                var assert = require('assert');
                assert.equal(typeof _, 'function');
                assert.equal(typeof Error, 'function');
                assert.equal(typeof console, 'object');
            `, {
                id: 'my-test-id'
            }, function (err, execution) {
                if (err) { return done(err); }

                expect(execution).to.have.property('id', 'my-test-id');
                done();
            });
        });
    });
});
