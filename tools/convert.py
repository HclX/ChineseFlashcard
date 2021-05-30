#!/bin/python3

# Text and pinyin comes from this website
# http://xh.5156edu.com/conversion.html

s1 = """
澡臊喵翘妙皱眉夸既具各咯眯胡莓
微悄准备舞愉雷眠刺位岸仔通姑芽
铅图改矮盒贝眨应书总该肠情橡要
鹰搬雀久累休息岛离滚架堆永泳泥
龟段始敢半傲于步输赢今骄终认坡
壁借甩拨傻言消湿墙角蝇蚊握挣腰
企影州塑料橙定熟惊却伙伴吸劲寄
淹麦死试够唉周叹驮浅姥昨棚挡难
英降工被银散酸味沙担茎蒲榴啪豌植
苍晒视野炸粗观软荚纷识胆靠察得
骆驼围肯窄跪诗李疑霜举短论证评
铁棒磨针名决习读困夫教室硬功溜伟
"""

s2 = """
zǎo sào miāo qiào miào zhòu méi kuā jì jù gè gē mī hú méi 
wēi qiāo zhǔn bèi wǔ yú léi mián cì wèi àn zǎi tōng gū yá 
qiān tú gǎi ǎi hé bèi zhǎ yīng shū zǒng gāi cháng qíng xiàng yào 
yīng bān què jiǔ lèi xiū xī dǎo lí gǔn jià duī yǒng yǒng ní 
guī duàn shǐ gǎn bàn ào yú bù shū yíng jīn jiāo zhōng rèn pō 
bì jiè shuǎi bō shǎ yán xiāo shī qiáng jiǎo yíng wén wò zhèng yāo 
qǐ yǐng zhōu sù liào chéng dìng shú jīng què huǒ bàn xī jìn jì 
yān mài sǐ shì gòu āi zhōu tàn tuó qiǎn lǎo zuó péng dǎng nán 
yīng jiàng gōng bèi yín sàn suān wèi shā dān jīng pú liú pā wān zhí 
cāng shài shì yě zhà cū guān ruǎn jiá fēn shí dǎn kào chá dé 
luò tuó wéi kěn zhǎi guì shī lǐ yí shuāng jǔ duǎn lùn zhèng píng 
tiě bàng mó zhēn míng jué xí dú kùn fū jiāo shì yìng gōng liū wěi 
"""

header = \
"""
const data = {
    name: "四年级(上)",
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

