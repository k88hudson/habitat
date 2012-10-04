var fs = require('fs');
var pathutil = require('path');
var test = require('tap').test;
var util = require('util');

var habitat = require('..');

test('habitat#get: basic test', function (t) {
  process.env['HABITAT_HELLO'] = 'world';

  var env = new habitat('habitat');
  t.same(env.get('hello'), 'world');

  var env2 = new habitat('HABITAT');
  t.same(env.get('HELLO'), 'world');
  t.end();
});

test('habitat#get: no prefix', function (t) {
  process.env['SOMETHING'] = 'that thing';
  var env = new habitat();
  t.same(env.get('something'), 'that thing');
  t.end();
});

test('habitat.get: shortcut for non-prefixed things', function (t) {
  process.env['SOMETHING'] = 'other thing';
  t.same(habitat.get('something'), 'other thing');
  t.end();
});

test('habitat#set: set a value', function (t) {
  var env = new habitat('habitat');
  env.set('lol', 'wut');
  t.same(env.get('lol'), process.env['HABITAT_LOL'], 'should be "wut"');
  t.end();
});


test('habitat#temp: syncronous', function (t) {
  var env = new habitat('habitat');
  process.env['HABITAT_HELLO'] = 'universe';
  env.temp({
    hello: 'world',
    goodnight: 'moon'
  }, function () {
    t.same(process.env['HABITAT_HELLO'], 'world');
    t.same(env.get('hello'), 'world');
  });

  t.same(env.get('hello'), 'universe');
  t.end();
});

test('habitat#temp: asyncronous', function (t) {
  var env = new habitat('habitat');
  process.env['HABITAT_HELLO'] = 'universe';
  env.temp({
    hello: 'world',
    goodnight: 'moon'
  }, function (done) {
    t.same(process.env['HABITAT_HELLO'], 'world');
    t.same(env.get('hello'), 'world');

    done();

    t.same(env.get('hello'), 'universe');
    t.end();
  });

});

test('habitat constructor: defaults', function (t) {
  process.env['HABITAT_AWESOME'] = 'yep';
  var env = new habitat('habitat', {
    rad: 'to the max',
    awesome: 'to the extreme'
  });
  t.same(env.get('rad'), 'to the max');
  t.same(env.get('awesome'), 'yep');
  t.end();
});

test('habitat#unset', function (t) {
  process.env['HABITAT_WUT'] = 'lol';
  var env = new habitat('habitat');
  env.unset('wut');
  t.notOk(env.get('wut'), 'should not get a result');
  t.end();
});