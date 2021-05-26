#!/bin/python3

# Text and pinyin comes from this website
# http://xh.5156edu.com/conversion.html

s1 = """
强弱赞称导尊敬保护程杨咛嗨注副中
颜交丰首农民充研究枫紫愁运科柿乐
待招报躺随调节宣陆虹尽客轮份板递式
隔淡谈宋陈号藤缠绕浇偷斜旗虾滩竟
将军曹秤切容易弓箭射斤庄稼操睬岭
尚庙瘦嚷瞎寓遇互引失取盲趟柱瘸哦
"""

s2 = """
qiáng ruò zàn chēng dǎo zūn jìng bǎo hù chéng yáng níng hēi zhù fù zhōng 
yán jiāo fēng shǒu nóng mín chōng yán jiū fēng zǐ chóu yùn kē shì lè 
dài zhāo bào tǎng suí diào jiē xuān lù hóng jìn kè lún fèn bǎn dì shì 
gé dàn tán sòng chén hào téng chán rào jiāo tōu xié qí xiā tān jìng 
jiāng jun1 cáo chèng qiē róng yì gōng jiàn shè jīn zhuāng jià cāo cǎi lǐng 
shàng miào shòu rǎng xiā yù yù hù yǐn shī qǔ máng tàng zhù qué ò
"""

fmt = """    {
        name: "五年级(上)-第%d单元",
        items: [
%s
        ],
    },"""

print("/*")
print(s1.strip())
print()
print(s2.strip())
print("*/")

ss = zip(s1.strip().splitlines(), s2.strip().splitlines())
index = 1
print("semester_5a = [")
for x, y in ss:
    sss = zip(x, y.split(' '))
    print(fmt % (index, "\n".join(['            ["%s", "%s", ""],' % ssss for ssss in sss])))
    index += 1
print("];")
