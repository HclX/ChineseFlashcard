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
    for (const semester of semesters) {
        for (const chapter of semester) {
            for (const item of chapter.items) {
                list.push({
                    character: item[0],
                    pinyin: item[1],
                    words: item[2],
                    source: chapter.name,
                    score: 0
                });
            }
        }
    }
    return list;
}

$(function() {
    var $main = $("#main");
    var cardTemplate = $("#card-template").html()

    var wordList = buildList([semester_4b, semester_5a]);
    var wordCnt = wordList.length;

    function loadNext() {
        if (wordList.length > 0) {
            var index = Math.floor(Math.random() * wordList.length);
            var content = Mustache.render(cardTemplate, wordList[index]);
            $main.html(content);
            $main.data("index", index);
            $("#progress").html(wordList.length + "/" + wordCnt);
        } else {
            $main.data("index", -1);
            $main.addClass("hidden");
            $("#progress").addClass("hidden");
            $("#cover").removeClass("hidden");
        }
    }

    var ENTER_KEY = 13;
    var SPACE_KEY = 32;
    $(document).keypress(function(event) {
        index = $main.data("index");
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
                $main.find("#tips").removeClass("hidden");
            }
        }
    });

    loadNext();
});
