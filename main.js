var allSemesters = new Map(Object.keys(window)
    .filter(s => s.match(/^semester_.*/g))
    .sort()
    .map(x => [x, window[x]]));

function buildPunctuation(s) {
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

function buildList(semesters) {
    var list = [];
    for (const s of semesters) {
        for (let idx = 0; idx < s.chapters.length; idx ++) {
            chapter = s.chapters[idx];
            for (const item of chapter) {
                list.push({
                    character: item[0],
                    pinyin: item[1],
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

var $card = $("#card");
var cardTemplate = $("#card-template").html()

function loadNext() {
    if (wordList.length > 0) {
        var index = Math.floor(Math.random() * wordList.length);
        var content = Mustache.render(cardTemplate, wordList[index]);
        $card.html(content);
        $card.data("index", index);
        $("#progress").html(wordList.length + "/" + wordCnt);
    } else {
        $card.data("index", -1);
        $("#main").addClass("hidden");
        $("#done").removeClass("hidden");
    }
}

function play(semester) {
    wordList = buildList([semester]);
    wordCnt = wordList.length;

    $("#start").addClass("hidden");
    $("#main").removeClass("hidden");

    var ENTER_KEY = 13;
    var SPACE_KEY = 32;
    $(document).keypress(function(event) {
        index = $card.data("index");
        if (index >= 0) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == ENTER_KEY) {
                wordList[index].score ++;
                if (wordList[index].score > 2) {
                    wordList.splice(index, 1);
                }
                loadNext();
            } else if (keycode == SPACE_KEY) {
                wordList[index].score --;
                $card.find("#tips").removeClass("hidden");
            }
        }
    });

    loadNext();
}

$(function() {
    var semesters = Array.from(allSemesters.keys())
        .sort()
        .map(x => ({'id': x, 'name': allSemesters.get(x).name}));
    var content = Mustache.render($("#semester_list_template").html(), {data: semesters});
    $("#semester_list").html(content);

    $("#play").click(function(){
        var s = $("#semester_list :selected").val();
        play(allSemesters.get(s));
    });
});
