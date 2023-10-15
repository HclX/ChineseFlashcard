#!/bin/python3
# -*- coding: utf-8 -*-

import sys

unit = 8
part = 'a'

s1 = """
烛蜡醋逛掺矩噼炮燃宵潮纱更
携幼怨触祭遗鬼尘驱录袍锣
缓卧弃施巢售税灿霞供榕涨会
佩伏昼裹唯偿荒陷惧咔熄源
奏禽畜牲荤妆衬暇征秀谋杆供
隐裕捐赠茄葬迁坟墓贩攒测丧
"""

py_dict = {}
def load_dict():
    for line in open("dict.txt", "r", encoding='utf-8'):
        py_dict.update({x[0]: x[1:] for x in line.strip().split(',') if len(x)>1})

py_word = {}
def load_word():
    for line in open("word.txt", "r", encoding="utf-8"):
        word = line.split('\t')[0]
        if len(word) != 2 and len(word) != 4:
            continue
        for i in range(0, len(word)):
            key = word[i] if i == 0 else word[i] + '+'
            if not key in py_word:
                py_word[key] = [word]
            else:
                py_word[key].append(word)

def find_words(char, num):
    words = py_word.get(char, []) + py_word.get(char + '+', [])
    return words[:num]

if unit < 1 or unit > 9:
    print("Invalid unit: %s" % unit)
    sys.exit(1)

if part not in ['a', 'b']:
    print("Invalid part: %s" % part)
    sys.exit(1)

out_file = open("%d%s.js" %(unit, part), "w", encoding="utf-8")

header = \
"""
const data = {
    name: "%s年级(%s)",
    chapters:
    [
""" % ("一二三四五六七八九十"[unit - 1], "上下"[ord(part) - ord('a')])

fmt = \
"""
        [
            /* āáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜü */
%s
        ],
"""

footer = \
"""
    ],
};

export default data;
"""

print("/*", file=out_file)
print(s1.strip('\n'), file=out_file)
print(file=out_file)
print("*/", file=out_file)

print(header.strip('\n'), file=out_file)

load_dict()
load_word()
for s in s1.strip().splitlines():
    ss = [(x, py_dict.get(x, ''), ','.join(find_words(x, 3))) for x in s.strip()]
    print(fmt.strip('\n') % "\n".join(['            ["%s", "%s", "%s"],' % sss for sss in ss]), file=out_file)
print(footer.strip('\n'), file=out_file)
