#!/bin/python3
# -*- coding: utf-8 -*-

import sys

unit = 8
part = 'b'

s1 = """
维填限崭扩厂敞诲阶
衔脉赵酷租效渔纲累
鹊敷熏穴灸艾腹髓嘛大
蔬协颤促销伦谓键坦
郑牧杏肴焚晕奉僻率
社择拽蘸宗轴轿溶厘乘
腻笛幽韩赖蔓娇障扒噢嚓
秃滋沮孵捕媚灌壤拦
疫昂呐措愤竞疏氛舟粽
兜凯资喂胀玲咖啡给
卸绩阔执颅钞掬伪坪
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
