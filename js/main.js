import semester_0a from './data/0a.js'
import semester_3a from './data/3a.js'
import semester_3b from './data/3b.js'
import semester_4a from './data/4a.js'
import semester_4b from './data/4b.js'
import semester_5a from './data/5a.js'
import semester_5b from './data/5b.js'
import semester_6a from './data/6a.js'
import semester_6b from './data/6b.js'
import semester_7a from './data/7a.js'
import semester_7b from './data/7b.js'
import semester_8a from './data/8a.js'
import semester_8b from './data/8b.js'
import semester_9a from './data/9a.js'

var allSemesters = {
    '0a': semester_0a,
    '3a': semester_3a,
    '3b': semester_3b,
    '4a': semester_4a,
    '4b': semester_4b,
    '5a': semester_5a,
    '5b': semester_5b,
    '6a': semester_6a,
    '6b': semester_6b,
    '7a': semester_7a,
    '7b': semester_7b,
    '8a': semester_8a,
    '8b': semester_8b,
    '9a': semester_9a,
};

function buildPinyin(s) {
    var punctuations = [
        ['1a', 'ā'],
        ['2a', 'á'],
        ['3a', 'ǎ'],
        ['4a', 'à'],
        ['1o', 'ō'],
        ['2o', 'ó'],
        ['3o', 'ǒ'],
        ['4o', 'ò'],
        ['1e', 'ē'],
        ['2e', 'é'],
        ['3e', 'ě'],
        ['4e', 'è'],
        ['1i', 'ī'],
        ['2i', 'í'],
        ['3i', 'ǐ'],
        ['4i', 'ì'],
        ['1u', 'ū'],
        ['2u', 'ú'],
        ['3u', 'ǔ'],
        ['4u', 'ù'],
        ['1v', 'ǖ'],
        ['2v', 'ǘ'],
        ['3v', 'ǚ'],
        ['4v', 'ǜ'],
        ['v', 'ü'],
    ];

    for (const [key, value] of punctuations) {
        s = s.replace(key, value);
    }
    return s;
}

function buildSmartPinyin(s) {
    var m = s.match(/^([a-z]+)([1-4]?)$/);
    if (m) {
        if (m[2].length > 0) {
            s = m[1];
            for (const x of 'aoeiuv') {
                var idx = s.indexOf(x);
                if (idx >= 0) {
                    if (idx < s.length - 1) {
                        if ((x === 'i' && s[idx + 1] === 'u') || 
                            (x === 'u' && s[idx + 1] === 'i')) {
                            idx += 1;
                        }
                    }
                    s = s.slice(0, idx) + m[2] + s.slice(idx);
                    break;
                }
            }
        }
        return buildPinyin(s);
    } else {
        return s;
    }
}

function buildCharMap(sid) {
    var charMap = {};
    var s = allSemesters[sid]
    for (let idx = 0; idx < s.chapters.length; idx ++) {
        var chapter = s.chapters[idx];
        for (const item of chapter) {
            charMap[item[0]] = {
                char: item[0],
                pinyin: item[1].split('/'),
                words: item[2],
                source: s.name + '--' + (idx + 1),
            };
        }
    }
    return charMap;
}

var MAX_TARGET_CNT = 3;

var _ctx = {}
function ctxInit(sid) {
    try {
        _ctx = JSON.parse(localStorage.getItem('data_' + sid));
    } catch (e) {
        _ctx = null;
    }

    if (_ctx === null) {
        _ctx = {sid:undefined, chars: undefined};
    }

    _ctx.sid = sid;
    _ctx.chars = buildCharMap(sid);

    // Initialize statistics if not available
    if (!('stat' in _ctx)) {
        _ctx['stat'] = {};
    }

    if (Object.keys(_ctx.stat).length === 0) {
        for (var char in _ctx.chars) {
            _ctx.stat[char] = {totalCnt: 1, failureCnt: 1};
        }
    }

    // Initialize test data if not in the middle of a test
    if (!('test' in _ctx)) {
        _ctx['test'] = {};
    }

    if (!('chars' in _ctx.test)) {
        _ctx.test['chars'] = {};
    }
    if (Object.keys(_ctx.test.chars).length === 0) {
        for (var char in _ctx.chars) {
            var failureRate = _ctx.stat[char].failureCnt / _ctx.stat[char].totalCnt;
            var targetCnt = Math.ceil(Math.sqrt(failureRate) * MAX_TARGET_CNT);
            _ctx.test.chars[char] = {targetCnt: targetCnt, correctCnt: 0};
        }
    }
}

function ctxUpdate(char, success) {
    if (success) {
        _ctx.test.chars[char].correctCnt ++;
    } else {
        _ctx.stat[char].failureCnt ++;
        _ctx.test.chars[char].targetCnt ++;
    }

    if (_ctx.test.chars[char].targetCnt > MAX_TARGET_CNT) {
        _ctx.test.chars[char].targetCnt = MAX_TARGET_CNT;
    }

    _ctx.stat[char].totalCnt ++;
    if (_ctx.test.chars[char].correctCnt >= _ctx.test.chars[char].targetCnt) {
        delete _ctx.test.chars[char];
    }

    // hide `sid` and `chars` in the JSON file
    const progressObj = {..._ctx, sid: undefined, chars: undefined};
    localStorage.setItem('data_' + _ctx.sid, JSON.stringify(progressObj));
}

function ctxClear() {
    // hide `sid` and `chars` in the JSON file
    const progressObj = {..._ctx, sid: undefined, chars: undefined, test: undefined};
    localStorage.setItem('data_' + _ctx.sid, JSON.stringify(progressObj));
}

function ctxGetTestChar() {
    var chars = Object.keys(_ctx.test.chars);
    if (chars.length > 0) {
        var index = Math.floor(Math.random() * chars.length);
        var char = chars[index];
        return {
            char: char,
            pinyin: _ctx.chars[char].pinyin,
            words: _ctx.chars[char].words,
            source: _ctx.chars[char].source,
            score: _ctx.test.chars[char].correctCnt + '/' + _ctx.test.chars[char].targetCnt,
            progress: {
                value: Object.keys(_ctx.chars).length - chars.length,
                max: Object.keys(_ctx.chars).length,
                text: chars.length + "/" + Object.keys(_ctx.chars).length},
        }
    } else {
        return undefined;
    }
}

var $start = null;
var $main = null;
var $done = null;

function loadNext() {
    var test = ctxGetTestChar();
    if (!test) {
        var endDate = new Date();
        var minutesUsed = Math.trunc((endDate.getTime() - $main.data('start').getTime()) / 60000);
        $main.addClass('hidden');
        $done.removeClass('hidden');
        $done.find('#date').html('完成于' + $.format.toBrowserTimeZone(endDate, 'yyyy年M月d日 HH:mm:ss'));
        $done.find('#time').html('用时' + minutesUsed + '分钟');
    } else {
        $main.find('#card').html(test.char);
        $main.find('#score').html(test.score);
        $main.find('#pinyin input').focus().val('');
        $main.find('#pinyin div').html('');

        var progress_template = $('#progress_template').html();
        $main.find("#progress").html(Mustache.render(progress_template, test.progress));

        var tips_template = $('#tips_template').html();
        $main.find('#tips')
            .addClass('hidden')
            .html(Mustache.render(tips_template, test));
        $main.data('test', test);
    }
}

function showTips() {
    $main.find('#tips').removeClass('hidden');
}

function onResult(result) {
    var test = $main.data('test');
    ctxUpdate(test.char, result);
    if (result) {
        // Correct!
        loadNext();
    } else {
        // Wrong!
        showTips();
    }
}

function onAnswer(pinyin) {
    var test = $main.data('test');
    var result = test.pinyin.indexOf(pinyin) >= 0;
    
    ctxUpdate(test.char, result);
    if (result) {
        // Correct!
        loadNext();
    } else {
        // Wrong!
        showTips();
    }
}

function clearData(clearAll) {
    ctxClear();
}

function startPlay(mode) {
    $main.data('start', new Date());
    if (mode === 'practice') {
        $main.find('#pinyin').removeClass('hidden');
        $main.on('change keyup paste', '#pinyin input', function(e) {
            var pinyin = buildSmartPinyin($('#pinyin input').val());
            $('#pinyin div').html(pinyin);

            if (e.type === 'keyup' && e.key === "Enter" && pinyin.length > 0) {
                $('#pinyin input').select();
                onAnswer(pinyin);
            }
        });
    } else if (mode === 'test') {
        $main.find('#pinyin').addClass('hidden');
        $(document).keypress(function(event) {
            if (event.key === "Enter") {
                onResult(true);
            } else if (event.key === " " || event.key === "+") {
                onResult(false);
            }
        });
    } else {
        // unknown mode
    }

    loadNext();
}

$(function() {
    $start = $('#start');
    $main = $('#main');
    $done = $('#done');

    var $list = $start.find('#semester_list');

    var semesters = Object.keys(allSemesters)
        .sort()
        .map(x => ({'id': x, 'name': allSemesters[x].name}));
    var semester_list_template = $('#semester_list_template').html();
    var content = Mustache.render(semester_list_template, {data: semesters});
    $list.html(content);

    $start.on('change', '#semester_list', function() {
        var s = $start.find('#semester_list :selected').val();
        ctxInit(s);
    });

    $start.on('click', '#test', function(){
        $start.addClass('hidden');
        $main.removeClass('hidden');
        startPlay('test');
    });

    $start.on('click', '#practice', function(){
        $start.addClass('hidden');
        $main.removeClass('hidden');
        startPlay('practice');
    });

    $start.on('click', '#clear', function(){
        clearData(false);
    });

    $list.trigger('change');
});
