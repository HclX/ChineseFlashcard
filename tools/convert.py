#!/bin/python3
# -*- coding: utf-8 -*-

import sys

unit = 10
part = 'a'

s1 = """
陡拴乳哨挽械懈擅溅诫戚袭逝
盈监柄港媒鸽誉碑绵坛厦罩缘
栩峡掘扯瀑捷额痴暮蜗籍债唾
蔼频宅佳辅敷逛纱携怨祭遗驱
屁售税霞榕伏裹奏畜荤征谋供
隐裕捐茄贩援旋贼胞译捏慈损
凑吻董邦蓄涉削嗽谨拆哀衷浩
痣敞阶衔脉艾腹促伦谓坦蘸轿
溶榕韩赖懒滋沮孵捕媚疫氛予
玲卸绩澈撤欲舀职若闷委状逼
番宴瑜愈焰烹饪倾舍彻酱爆傅
播辞熬莫杜汇亦涛嘱辈惯邀基
恳稻概释误浆诞探酪淌织绍谷
宵馒俗宙聊倍济偏姿帅述截规
堂未末挤贫顽规章聘奖箍脾吼
抹忠艳悠仰奥瓣避馋殊搅嫉妒
渣稳聚屈遭搂陶朗廊拥析鲁芝
跷筒序击户宿吉古裳辉恨拳耙
戒恨拳饶拒项妇羞链值饰献蔡
技价磅则侧吊脆词馋隆赚况封
帘嫌椒炒夺牵毫宫蟹晓妖绑怜
魔丑扭讨计兄晃般驾架败圣冻
臂康肩枚孔醉宾郭羡慕暑混抡
幕抢复惜缝割炎鞭谅歉旱牌悉
束披撑屉暗修劝灾扬端灭注秤
称瘸恭局淡睬寓遇似景烧透并
汁莲系蹲广厂管搭疼拾歪骑狠
镇买卖埋扮愁玲令逗精融辨荡
幸筋铺扁澡臊翘皱各舞眠仔铅
矮鹰龟骄傲坡言湿蝇蚊橙寄难
观窄跪霜鹿饱捞糟捉忽驴爪羽
讲叼啄采惭愧蝈底共椅挂细汗
淋舔藏掌摸顶蹦摘满往凉静升
井咸套婆篮蓝浪样本片汤祝渴
写怎咬响午另棚昨晒团困虹引
宣浇递童皇瞎板陆盆岳捡运肖
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

if unit < 1 or unit > 10:
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
""" % ("一二三四五六七八九十终"[unit - 1], "上下"[ord(part) - ord('a')])

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
