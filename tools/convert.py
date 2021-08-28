#!/bin/python3
# -*- coding: utf-8 -*-

import sys

s1 = """
牢哇华哗害饱饿鹿已豆越经
捞井夜连另接喘灰伯您糟喊
等蜻竿捉蜓专蝴蝶意忘记湖
暖舒音闹忽光世粒挺界挖湖
吵淘狮爪求绳断驴伤如转现
窝旁流羽差极句仍亲冠喔救
所装答讲俩错逃传猎丢叼臭
纸筝争溪折坏理思受喜欢停
结实感砍造忍但鲜夏而且叔
啄一直采蜜鼓遍催蜂钩劳丛
整摆灯笼因表惭愧蝈提迷肚
司假缸主慌吓浮桶念机汽重
"""

def load_dict():
    py_dict = {}
    for line in open("dict.txt", "r", encoding='utf-8'):
        py_dict.update({x[0]: x[1:] for x in line.strip().split(',') if len(x)>1})

    return py_dict

unit = 1
part = 'a'

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

py_dict = load_dict()
for s in s1.strip().splitlines():
    ss = [(x, py_dict[x]) for x in s]
    print(fmt.strip('\n') % "\n".join(['            ["%s", "%s", ""],' % sss for sss in ss]), file=out_file)
print(footer.strip('\n'), file=out_file)
