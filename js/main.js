import semester_0a from "./data/0a.js"
import semester_3a from "./data/3a.js"
import semester_3b from "./data/3b.js"
import semester_4a from "./data/4a.js"
import semester_4b from "./data/4b.js"
import semester_5a from "./data/5a.js"

var allSemesters = {
    "0a": semester_0a,
    "3a": semester_3a,
    "3b": semester_3b,
    "4a": semester_4a,
    "4b": semester_4b,
    "5a": semester_5a,
};

function buildPinyin(s) {
    var punctuations = [
        ["1a", "ā"],
        ["2a", "á"],
        ["3a", "ǎ"],
        ["4a", "à"],
        ["1o", "ō"],
        ["2o", "ó"],
        ["3o", "ǒ"],
        ["4o", "ò"],
        ["1e", "ē"],
        ["2e", "é"],
        ["3e", "ě"],
        ["4e", "è"],
        ["1i", "ī"],
        ["2i", "í"],
        ["3i", "ǐ"],
        ["4i", "ì"],
        ["1u", "ū"],
        ["2u", "ú"],
        ["3u", "ǔ"],
        ["4u", "ù"],
        ["1v", "ǖ"],
        ["2v", "ǘ"],
        ["3v", "ǚ"],
        ["4v", "ǜ"],
        ["v", "ü"],
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
                source: s.name + "--" + idx,
            };
        }
    }
    return charMap;
}

var _context = {}
function ctxInit(sid) {
    try {
        _context = JSON.parse(localStorage.getItem("data_" + sid));
    } catch (e) {
        _context = null;
    }

    if (_context == null) {
        _context = {sid:undefined, chars: undefined};
    }

    _context.sid = sid;
    _context.chars = buildCharMap(sid);

    // Initialize statistics if not available
    if (!('stat' in _context)) {
        _context['stat'] = {};
    }

    if (Object.keys(_context.stat).length === 0) {
        for (var char in _context.chars) {
            _context.stat[char] = {totalCnt: 1, failureCnt: 0};
        }
    }

    // Initialize test data if not in the middle of a test
    if (!('test' in _context)) {
        _context['test'] = {};
    }

    if (!('chars' in _context.test)) {
        _context.test['chars'] = {};
    }
    if (Object.keys(_context.test.chars).length === 0) {
        for (var char in _context.chars) {
            var totalCnt = Math.trunc(3 * _context.stat[char].failureCnt / _context.stat[char].totalCnt + 1);
            _context.test.chars[char] = {totalCnt: totalCnt, correctCnt: 0};
        }
    }
}

function ctxUpdate(char, success) {
    if (success) {
        _context.test.chars[char].correctCnt ++;
    } else {
        _context.stat[char].failureCnt ++;
        _context.test.chars[char].totalCnt ++;
    }

    _context.stat[char].totalCnt ++;
    if (_context.test.chars[char].correctCnt === _context.test.chars[char].totalCnt) {
        delete _context.test.chars[char];
    }

    // hide `sid` and `chars` in the JSON file
    const progressObj = {..._context, sid: undefined, chars: undefined};
    localStorage.setItem("data_" + _context.sid, JSON.stringify(progressObj));
}

function ctxClear() {
    // hide `sid` and `chars` in the JSON file
    const progressObj = {..._context, sid: undefined, chars: undefined, test: undefined};
    localStorage.setItem("data_" + _context.sid, JSON.stringify(progressObj));
}

function ctxGetTestChar() {
    var chars = Object.keys(_context.test.chars);
    if (chars.length > 0) {
        var index = Math.floor(Math.random() * chars.length);
        var char = chars[index];
        return {
            char: char,
            pinyin: _context.chars[char].pinyin,
            words: _context.chars[char].words,
            source: _context.chars[char].source,
            score: _context.test.chars[char].correctCnt + "/" + _context.test.chars[char].totalCnt,
            progress: chars.length + "/" + Object.keys(_context.chars).length,
        }
    } else {
        return undefined;
    }
}

var $start = null;
var $main = null;
var $done = null;

function progress(timeleft, timetotal, $element, done) {
    var progressBarWidth = timeleft * $element.width() / timetotal;
    $element.find('div').animate({ width: progressBarWidth }, 1);
    if(timeleft > 0) {
        setTimeout(function() {
            progress(timeleft - 1, timetotal, $element, done);
        }, 100);
    } else {
        done();
    }
};

function loadNext() {
    var test = ctxGetTestChar();
    if (!test) {
        var endDate = new Date();
        var minutesUsed = Math.trunc((endDate.getTime() - $main.data('start').getTime()) / 60000);
        $main.addClass("hidden");
        $done.removeClass("hidden");
        $done.find("#date").html("完成于" + $.format.toBrowserTimeZone(endDate, "yyyy年M月d日 HH:mm:ss"));
        $done.find("#time").html("用时" + minutesUsed + "分钟");
    } else {
        $main.find("#character").html(test.char);
        $main.find("#score").html(test.score);
        $main.find("#pinyin_input").focus().val("");
        $main.find("#pinyin_display").html("");

        $("#progress").html(test.progress);
        var tips_template = $("#tips_template").html();
        $main.find("#tips")
            .addClass("hidden")
            .html(Mustache.render(tips_template, test));
        $main.data('test', test);
    }
}

function showTips() {
    $main.find("#tips").removeClass("hidden");
}

function hideTips() {
    $main.find("#tips").addClass("hidden");
}

function onResult(result) {
    var test = $main.data('test');
    if (result) {
        ctxUpdate(test.char, true);
        loadNext();
    } else {
        // wrong answer
        showTips();
        ctxUpdate(test.char, false);
    }
}

function onAnswer(pinyin) {
    var test = $main.data('test');
    if (test.pinyin.indexOf(pinyin) < 0) {
        // wrong answer
        showTips();
        ctxUpdate(test.char, false);
    } else {
        ctxUpdate(test.char, true);
        loadNext();
    }
}

function clearData(sid, clearAll) {
    ctxInit(sid);
    ctxClear();
}

function startPlay(sid, practiceMode) {
    ctxInit(sid);

    $main.data("start", new Date());

    if (practiceMode) {
        $main.find("#practice").removeClass("hidden");
        $main.on('change keyup paste', "#pinyin_input", function(e) {
            var pinyin = buildSmartPinyin($("#pinyin_input").val());
            $("#pinyin_display").html(pinyin);

            if (e.type == 'keyup' && 
                (e.key === 'Enter' || e.keyCode === 13) &&
                pinyin.length > 0) {
                onAnswer(pinyin);
            }
        });
    } else {
        var ENTER_KEY = 13;
        var SPACE_KEY = 32;
        $main.find("#practice").addClass("hidden");
        $(document).keypress(function(event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == ENTER_KEY) {
                onResult(true);
            } else if (keycode == SPACE_KEY) {
                onResult(false);
            }
        });
    }

    loadNext();
}

$(function() {
    $start = $("#start");
    $main = $("#main");
    $done = $("#done");

    var semesters = Object.keys(allSemesters)
        .sort()
        .map(x => ({'id': x, 'name': allSemesters[x].name}));
    var semester_list_template = $start.find("#semester_list_template").html();
    var content = Mustache.render(semester_list_template, {data: semesters});
    $start.find("#semester_list").html(content);

    $start.on('click', '#test', function(){
        var s = $start.find("#semester_list :selected").val();
        $start.addClass("hidden");
        $main.removeClass("hidden");
        startPlay(s, false);
    });

    $start.on('click', '#practice', function(){
        var s = $start.find("#semester_list :selected").val();
        $start.addClass("hidden");
        $main.removeClass("hidden");
        startPlay(s, true);
    });

    $start.on('click', '#clear', function(){
        var s = $start.find("#semester_list :selected").val();
        clearData(s, false);
    });

});
