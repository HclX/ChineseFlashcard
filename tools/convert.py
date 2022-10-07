#!/bin/python3
# -*- coding: utf-8 -*-

import sys

unit = 6
part = 'b'

s1 = """
箍压凭药脾尿撒谎吼泡抹疲恼忠汪
薄艳碧京悠鸣仰奥艰瓣避荫旦城
馋窜粥膝屈殊嫉妒肛液格渣露
稳聚扭暂诵遭肿搂陶毕挨廊朗拥编
析鲁肺罪凡核沿跷异筒退钉脏诊
序击列豪恩宁建忆斗篇玫瑰戶州
适慰宿扣村吉裳辉附案耙仆良腾尼
昏股拳衫戒恨组吩咐踢饶搜拒距华
项妇虚街羞奋盖串浓谦链值辩饰
宜页献蔡技普亚欧价墨贡丝磅晾框便
迅敏郁则词册吊杂虑忧厕侧撕葱脆
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
