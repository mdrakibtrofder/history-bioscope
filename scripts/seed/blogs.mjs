const now = '2026-10-08T00:00:00.000Z';

const b = (id, title, slug, timeline, excerpt, tags, relatedEventIds, wikiTitle, content) => ({
  id, title, slug, timeline, excerpt, tags, relatedEventIds, coverImage: null, wikiTitle,
  author: 'History Bioscope Editorial', content: content.trim(), status: 'published', createdAt: now, updatedAt: now,
});

export const blogs = [
  b('blog-pala', 'The Pala Empire: Bengal’s Buddhist Golden Age', 'pala-empire-golden-age', 'bangladesh',
    'How an elected king and his successors turned Bengal into the intellectual capital of Buddhist Asia.',
    ['Pala Empire', 'Buddhism', 'Paharpur'], ['bd-pala-founding', 'bd-dharmapala', 'bd-somapura', 'bd-atisha'], 'Somapura_Mahavihara', `
## An elected king

Around 750 CE, after a century of anarchy known as **matsyanyaya** — "the law of the fish", where the big devour the small — the chiefs of Bengal did something extraordinary: they *chose* a king. His name was **Gopala**, and the dynasty he founded ruled for some four hundred years.

## Monasteries that drew the world

Gopala's son **Dharmapala** fought for supremacy over North India, but his lasting legacy was intellectual. He founded **Vikramashila** and the vast **Somapura Mahavihara** at Paharpur in today's Naogaon district. Pilgrims and scholars came from Tibet, China and Southeast Asia.

> Somapura's cruciform temple and 177 monastic cells made it one of the largest Buddhist monasteries south of the Himalayas.

## Art in terracotta

More than 2,000 terracotta plaques at Paharpur show daily life: farmers, musicians, animals and gods. Together with the bronze sculptures of the "Pala school", they influenced art from Nepal to Java.

## The scholar who went to Tibet

In the 11th century, **Atisha Dipankara** of Bikrampur left Vikramashila for Tibet, where his teachings reshaped Tibetan Buddhism. Bengal's influence on Asia had never been greater.

### Explore further
- Visit the *Somapura Mahavihara* event on the timeline
- Open the Map Explorer and toggle the **Pala Empire** territory layer
`),

  b('blog-muslin', 'Muslin: The Fabric That Clothed the World', 'muslin-fabric-of-bengal', 'bangladesh',
    'Dhaka muslin was so fine it was called "woven air". Here is the story of its rise and fall.',
    ['Muslin', 'Mughal Bengal', 'Economy'], ['bd-muslin', 'bd-shaista-khan', 'wd-industrial'], 'Dhaka_muslin', `
## Woven air

Travellers called it *baft-hawa* — **woven air**. Dhaka muslin was spun from **Phuti karpas**, a cotton that grew only along the banks of the Meghna. Spinners worked in the humid early morning so the delicate thread would not snap.

## A global luxury

Under the Mughals, Bengal was one of the most productive regions on earth. Muslin dressed Mughal emperors and, by the 18th century, the fashionable women of Paris and London. Dutch, English, French and Armenian merchants competed for it.

## Decline

After Plassey (1757), the East India Company controlled weavers and prices. Then came the **Industrial Revolution**: machine-made Lancashire cotton flooded Indian markets while Indian cloth faced British tariffs. By the mid-19th century the great muslin tradition had vanished.

## Revival

In recent years Bangladeshi researchers have worked to identify the original Phuti karpas plant and recreate the fabric — a project to rescue a lost heritage.
`),

  b('blog-ekushey', '21 February: How a Language Made a Nation', '21-february-language-movement', 'bangladesh',
    'From a student protest in Dhaka to International Mother Language Day — the story of Ekushey.',
    ['Language Movement', 'Shaheed Minar', '1952'], ['bd-language-movement', 'bd-mother-language-day', 'bd-victory'], 'Bengali_language_movement', `
## "Urdu and only Urdu"

In March 1948, Muhammad Ali Jinnah told a Dhaka audience that **Urdu** alone would be Pakistan's state language — although Bengali speakers were the majority of Pakistan's population. Students protested immediately.

## Ekushey February

On **21 February 1952**, students at Dhaka University defied a ban on gatherings. Police opened fire near the Medical College. **Salam, Barkat, Rafiq, Jabbar** and others were killed. A memorial built overnight was destroyed; it was later rebuilt as the **Shaheed Minar**.

## From language to nation

The movement turned language into the core of a new political identity. The same students and ideas fed the 1954 United Front victory, the 1966 Six Points, and ultimately the Liberation War of 1971.

## A gift to the world

In 1999 UNESCO declared 21 February **International Mother Language Day**. Every year, people around the world honour linguistic diversity because of the sacrifice made in Dhaka.

*"Amar bhaiyer rokte rangano Ekushey February, ami ki bhulite pari?"*
`),

  b('blog-house-of-wisdom', 'Inside Baghdad’s House of Wisdom', 'house-of-wisdom-baghdad', 'islamic',
    'Translators, mathematicians and astronomers turned Abbasid Baghdad into the world’s knowledge capital.',
    ['Golden Age', 'Baghdad', 'Science'], ['is-house-of-wisdom', 'is-khwarizmi', 'is-abbasid'], 'House_of_Wisdom', `
## A city of round walls and open minds

In 762 the caliph **al-Mansur** founded Baghdad as a round city on the Tigris. Within decades it became the largest city in the world, linking trade routes from China to Spain.

## The translation movement

Under **Harun al-Rashid** and especially **al-Ma'mun**, scholars translated Greek, Syriac, Persian and Sanskrit works into Arabic. **Hunayn ibn Ishaq** translated Galen and Hippocrates; others worked on Euclid, Ptolemy and Indian astronomy.

## Algebra and algorithms

**Muhammad ibn Musa al-Khwarizmi** wrote *al-Kitab al-Mukhtasar fi Hisab al-Jabr wal-Muqabala*. "Al-jabr" gave us **algebra**, and the Latin form of his name, *Algoritmi*, gave us **algorithm**.

## Paper changes everything

Paper-making, learned from Chinese craftsmen in Samarkand, made books cheap. Baghdad's markets had whole streets of booksellers.

## Legacy

When the Mongols sacked Baghdad in 1258, it was said the Tigris ran black with ink. But the knowledge had already spread — to Cairo, Córdoba, and through Latin translations to the universities of Europe.
`),

  b('blog-silk-road', 'Walking the Silk Road', 'walking-the-silk-road', 'world',
    'Silk, paper, faith and plague — what really travelled along history’s greatest trade network.',
    ['Silk Road', 'Trade', 'Central Asia'], ['wd-silk-road', 'wd-genghis', 'wd-black-death'], 'Silk_Road', `
## Not one road

The "Silk Road" — a term coined in the 19th century — was really a web of caravan routes across deserts and mountains, from **Chang'an** to **Samarkand**, **Baghdad** and **Constantinople**.

## What moved

- **Goods:** silk, porcelain, spices, horses, glass, paper
- **Ideas:** Buddhism to China, Islam to Central Asia, mathematics and astronomy in every direction
- **Technology:** paper-making, the compass, gunpowder
- **Disease:** the Black Death travelled along these routes in the 1340s

## The Mongol peace

Under the Mongols in the 13th–14th centuries, a merchant could, it was said, cross Asia safely. Marco Polo and Ibn Battuta both travelled in this world.

## Explore it on the map

Open the **Map Explorer**, enable the *Trade Routes* layer and press **Animate** to watch the Silk Road come alive.
`),

  b('blog-ai', 'From ARPANET to AI: Seventy Years of Computing', 'arpanet-to-ai', 'world',
    'How a few connected computers in 1969 led to the generative AI revolution.',
    ['Technology', 'Internet', 'AI'], ['wd-arpanet', 'wd-www', 'wd-transformer', 'wd-chatgpt'], 'History_of_the_Internet', `
## 1969: "LO"

The first ARPANET message between UCLA and SRI was supposed to be "LOGIN". The system crashed after two letters. History's first network message was **"LO"**.

## 1991: the Web

At CERN, **Tim Berners-Lee** combined hypertext with the Internet. The World Wide Web made the network usable by everyone.

## 2007: the Internet in your pocket

Smartphones and social media connected billions — including millions of Bangladeshis who skipped desktop computers entirely.

## 2017: attention

The paper *"Attention Is All You Need"* introduced the **Transformer**. It became the foundation of large language models.

## 2022 onwards: generative AI

AI assistants moved from labs to classrooms and offices within months. For students and researchers, the question is no longer *whether* to use AI, but *how* to use it responsibly.
`),
];
