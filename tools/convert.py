#!/bin/python3

# Text and pinyin comes from this website
# http://xh.5156edu.com/conversion.html

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
s2 = """
láo wa huá huá hài bǎo è lù yǐ dòu yuè jīng 
lāo jǐng yè lián lìng jiē chuǎn huī bó nín zāo hǎn 
děng qīng gān zhuō tíng zhuān hú dié yì wàng jì hú 
nuǎn shū yīn nào hū guāng shì lì tǐng jiè wā hú 
chǎo táo shī zhǎo qiú shéng duàn lǘ shāng rú zhuǎn xiàn 
wō páng liú yǔ chà jí jù réng qīn guàn wō jiù 
suǒ zhuāng dá jiǎng liǎng cuò táo chuán liè diū diāo chòu 
zhǐ zhēng zhēng xī shé huài lǐ sī shòu xǐ huān tíng 
jié shí gǎn kǎn zào rěn dàn xiān xià ér qiě shū 
zhuó yī zhí cǎi mì gǔ biàn cuī fēng gōu láo cóng 
zhěng bǎi dēng lóng yīn biǎo cán kuì guō tí mí dù 
sī jiǎ gāng zhǔ huāng xià fú tǒng niàn jī qì zhòng 
"""

header = \
"""
const data = {
    name: "三年级(下)",
    chapters:
    [
"""

fmt = \
"""
        [
%s
        ],
"""

footer = \
"""
    ],
};

export default data;
"""

print("/*")
print(s1.strip('\n'))
print()
print(s2.strip('\n'))
print("*/")

ss = zip(s1.strip().splitlines(), s2.strip().splitlines())
print(header.strip('\n'))

for x, y in ss:
    sss = zip(x, y.split(' '))
    print(fmt.strip('\n') % "\n".join(['            ["%s", "%s", ""],' % ssss for ssss in sss]))
print(footer.strip('\n'))

