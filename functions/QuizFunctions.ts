const htmlify = require('js-htmlencode');
const uuid = require('uuid/v4');
const Content = require('./Content');
const Utils = require('./shuffle');

const debug_mode = true;
let questionsList = [];
let shuffledAnswers = [];
let currentIndex = -1;
let answersList = {};
let quizOn = false;

