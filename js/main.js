import semester_3a from "./data/3a.js"
import semester_3b from "./data/3b.js"
import semester_4a from "./data/4a.js"
import semester_4b from "./data/4b.js"
import semester_5a from "./data/5a.js"

var allSemesters = {
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

function buildList(semesters) {
    var list = [];
    for (const s of semesters) {
        for (let idx = 0; idx < s.chapters.length; idx ++) {
            var chapter = s.chapters[idx];
            for (const item of chapter) {
                list.push({
                    character: item[0],
                    pinyin: item[1].split('/'),
                    words: item[2],
                    source: s.name + "--" + idx,
                    score: 0
                });
            }
        }
    }
    return list;
}

var wordList = null;
var wordCnt = 0;

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
    if (wordList.length <= 0) {
        $main.addClass("hidden");
        $done.removeClass("hidden");
    } else {
        var index = Math.floor(Math.random() * wordList.length);

        $main.find("#character")
            .html(wordList[index].character)
            .data("index", index);

        $main.find("#score").html(wordList[index].score);
        $main.find("#pinyin_input").focus().val("");
        $main.find("#pinyin_display").html("");

        $("#progress").html(wordList.length + "/" + wordCnt);
        // progress(10, 10, $('#progressBar'), loadNext);
    }
}

function showTips(index) {
    var tips_template = $("#tips_template").html();
    $main.find("#tips")
        .html(Mustache.render(tips_template, wordList[index]))
        .removeClass("hidden");
}

function hideTips() {
    $main.find("#tips").addClass("hidden");
}

function onAnswer(index, pinyin) {
    if (wordList[index].pinyin.indexOf(pinyin) < 0) {
        // wrong answer
        showTips(index);
        wordList[index].score --;
        $main.find("#score").html(wordList[index].score);
    } else {
        // correct answer
        wordList[index].score ++;
        if (wordList[index].score > 2) {
            wordList.splice(index, 1);
        }

        hideTips();
        loadNext();
    }
}

function startPlay(semester, practiceMode) {
    wordList = buildList([semester]);
    wordCnt = wordList.length;

    if (practiceMode) {
        $main.find("#practice").removeClass("hidden");
        $main.on('change keyup paste', "#pinyin_input", function(e) {
            var pinyin = buildSmartPinyin($("#pinyin_input").val());
            $("#pinyin_display").html(pinyin);

            if (e.type == 'keyup' && 
                (e.key === 'Enter' || e.keyCode === 13) &&
                pinyin.length > 0) {
                var index = $main.find("#character").data("index");
                if (index >= 0) {
                    onAnswer(index, pinyin);
                }
            }
        });
    } else {
        $main.find("#practice").addClass("hidden");
        var ENTER_KEY = 13;
        var SPACE_KEY = 32;
        $(document).keypress(function(event) {
            var index =  $main.find("#character").data("index");
            if (index >= 0) {
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if (keycode == ENTER_KEY) {
                    onAnswer(index, wordList[index].pinyin[0]);
                } else if (keycode == SPACE_KEY) {
                    onAnswer(index, "");
                }
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
        startPlay(allSemesters[s], false);
    });

    $start.on('click', '#practice', function(){
        var s = $start.find("#semester_list :selected").val();
        $start.addClass("hidden");
        $main.removeClass("hidden");
        startPlay(allSemesters[s], true);
    });

});
