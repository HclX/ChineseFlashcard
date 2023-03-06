#!/bin/python3
# -*- coding: utf-8 -*-

import sys

unit = 7
part = 'a'

s1 = """
概括释类患误粘余途疗烂浆阻呕吐
集诞律菩萨探恐否酪诱粮淌织伍捆处
筑摄繁姜慧智览创固砖绍介孟婚
索毁锁享产刮悔统狂袖翁乒乓恢
喷谷尸拐腊咒饥拢拦宵杖掏馒
族揉俗刘宙宇馅聊倍朱捣济偏吴
姿势鞠躬乏励典帅恋贾陌症颊术落
截际规畅阅章犬构码媳仓态惑枪
耍叠菌堵孝素堂未访财挤烈待旺兴
贫承泣祈祷顽卢坑铲训奖遵欺几
翼聘抛唇蒜晶泉尔碌噜纽蹄境铜
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
    ss = [(x, py_dict[x], ','.join(find_words(x, 3))) for x in s]
    print(fmt.strip('\n') % "\n".join(['            ["%s", "%s", "%s"],' % sss for sss in ss]), file=out_file)
print(footer.strip('\n'), file=out_file)
