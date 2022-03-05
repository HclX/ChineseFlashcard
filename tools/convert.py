#!/bin/python3
# -*- coding: utf-8 -*-

import sys

unit = 6
part = 'a'

s1 = """
轰隆赚况投封帘扇厅炼锻震危险冒
嫌仙盼齐咱毯术椒约预舱炒讶秒着
徐夺牵毫宫默闯啼蟹扛晓妖绑符喝
禁嫩耀展业跃甲示痒怒怜魔苞丈漂
裂丑庆厌讨独孤兄晃厉陪般驾弹
残配败苏圣温托拖锤冻剑臂合胜
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

out_file = sys.stdout
if len(sys.argv) > 1 and len(sys.argv[1]) == 2:
    unit = int(sys.argv[1][0])
    part = sys.argv[1][1]

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
