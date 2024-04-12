# Weapons

## Weapon characteristics

### Main characteristics

This is basically what makes a weapon unique.

| Name      |                       Values                       | Short description                                           |
| --------- | :------------------------------------------------: | ----------------------------------------------------------- |
| Category  |                       1 ~ 5                        | represents complexity and efficiency                        |
| Type      |          sharp, blunt, piercing, flexible          | represents how the weapon deals damage                      |
| Grip      | hilt (DEX), handle (STR), shaft (AGI), range (PER) | represents the way the weapon is wielded                    |
| Size      |                 -2 ~ 2, default 0                  | represents the size of the weapon in relation to standards  |
| Width     |                 -2 ~ 2, default 0                  | represents the width of the weapon in relation to standards |
| Archetype |           sword, axe, hast, mace, exotic           | defines the family in which the weapon in question falls    |

#### Category

Category is a clever mix between complexity, heaviness, size, efficiency... the more advanced a weapon is, the more effective it will be but will require significant training to take advantage of it.

| Category |   Type   | Default roll | Default range | Default bulk | Default weight | Default penalty |
| -------- | :------: | :----------: | :-----------: | :----------: | :------------: | :-------------: |
| 1        |  Common  |      d4      |      +1       |     1/2      |       10       |        1        |
| 2        | Skirmish |      d6      |      +2       |      1       |       20       |        2        |
| 3        |  Battle  |      d8      |      +3       |   1 + 1/2    |       30       |        3        |
| 4        |  Siege   |     d10      |      +4       |      2       |       40       |        4        |
| 5        |   War    |     d12      |      +5       |   2 + 1/2    |       50       |        5        |

Common Weapons: These weapons are the most widespread and accessible to the general population, including hunters. They include daggers, staves, and clubs. Light and easy to handle, they are often chosen for personal defense or as versatile tools in daily life. Their simplicity and limited effectiveness make them ideal for small-scale confrontations or for individuals without combat training.

Skirmish Weapons: Designed for fast and mobile confrontations, these weapons favor speed and surprise. They include short swords, light bows, and spears. Used in harassment or reconnaissance tactics, these weapons allow fighters to quickly engage the enemy and withdraw before reinforcements arrive. They are favored by scouts and small mobile units.

Battle Weapons: Robust and effective, these weapons are designed for major clashes between armed forces. Including longswords, battle axes, and clubs, they require some skill to use effectively but can inflict considerable damage. Heavy armor and shields are often associated with these weapons, providing fighters with increased protection during pitched battles.

Siege Weapons: Specifically designed for breaching fortifications or fighting under siege conditions, these weapons include battering rams, catapults, and heavy crossbows. They are characterized by their imposing size and their need to be operated by several people or complex mechanisms. Their use is crucial to overcoming enemy defenses and paving the way for an invasion.

Weapons of War: These weapons symbolize large-scale conflict and are often centerpieces on the battlefield. Including trebuchets, ballistae, and other large-scale war machines, they require significant logistics for their transport, assembly, and use. These weapons are capable of changing the course of a war thanks to their considerable destructive power and their ability to inflict massive casualties.

Category have a direct effect on:

| Weapon  | Every additional Category |
| ------- | ------------------------- |
| Roll    | +1 dice size              |
| Range   | +1                        |
| Bulk    | +1/2                      |
| Weight  | +10                       |
| Penalty | +1                        |

Also a weapon is broken when its break counter reach its category, meaning category is directly bind to a weapon's durability.

A weapon handled by someone who is not trained properly grants a disavantage for all rolls done with it.  
On the other hand, a weapon wielded by someone properly trained grants the "triangle" advantage (see the appropriate section for what this entails).

#### Type

Weapon type represents the type of damage dealt by the weapon's primary deadly surface or how it is used.  
Weapon type makes a big difference when it comes to the value of the weapon's rolls or the weapon triangle.  
The average of the weapon's rolls is always the same (except in cases noted \* or \*\*), but the calculation differs, which can make a difference in situations affecting these values.

| Type     | Common      | Skirmish    | Battle       | Siege         | War             |
| -------- | ----------- | ----------- | ------------ | ------------- | --------------- |
| Sharp    | 1d4 (1~4)   | 1d6 (1~6)   | 1d8 (1~8)    | 1d10 (1~10)   | 1d12 (1~12)     |
| Blunt    | 1d6-1 (0~5) | 1d8-1 (0~7) | 1d10-1 (0~9) | 1d12-1 (0~11) | 2d6 (2~12) \*\* |
| Piercing | 1d2+1 (2~3) | 1d4+1 (2~5) | 1d6+1 (2~7)  | 1d8+1 (2~9)   | 1d10+1 (2~11)   |
| Flexible | 2 (2) \*    | 1d2+2 (3~4) | 1d4+2 (3~6)  | 1d6+2 (3~8)   | 1d8+2 (3~10)    |
| Average  | 2,5         | 3,5         | 4,5          | 5,5           | 6,6             |

\*\* : Penalty increased by 1

#### Grip

The grip defines which attribute is used to handle the weapon in order to perform attacks.
It does not affect tactics and defenses, which depends on their nature.

- **Hilted Weapons** (like swords): Weapons with a hilt are those whose handling requires great finesse and precision. The handle allows for quick and precise movements, necessary to strike specific targets or exploit opponent's weaknesses. For this reason, the main attribute for wielding these weapons is Dexterity (DEX). Dexterity reflects the fighter's ability to perform precise and coordinated movements, essential to getting the most out of grip weapons.
- **Handled Weapons** (such as axes): Weapons with handles are designed to inflict damage through brute force. The handle extends the reach of the weapon and increases the power of the blow thanks to the force applied. Effectively using a hafted weapon therefore requires considerable Strength (FOR). Strength influences the fighter's ability to lift, swing, and strike with the weapon, transforming muscular energy into devastating punching power.
- **Shafted Weapons** (such as spears): Shafted weapons combine extended reach with the need for quick, controlled movements, exploiting both the reach to keep the enemy at bay and the ability to deliver rapid blows . For this reason, the main attribute for these weapons is Agility (AGI). Agility determines the fighter's ability to manipulate the weapon with velocity and precision, allowing them to react quickly to the opponent's movements while maintaining a safe distance.

#### Size

The size of the weapon affects its range, but this is not without consequences on its weight.

#### Width

The width of the weapon affects the force of its impact and solidity, but this is not without consequences on its weight.

#### Particularities

Even within a framework categorizing weapons by basic features, a weapon can stand out due to a unique "peculiarity," such as a distinct trait, underscoring that some items defy broad classification.  
EVery particularity implies at least

Throw : This weapon is suitable to be used as a thrown weapon, hence throwing that kind of weapon does not imply a disadvantage.
Efficient :

- _Cultural_ : This weapon is aligned with a given culture, advantages and disavantages depends on the given culture.  
  Elven : Weight reduced by 20.  
  Dwarven : Solidity increased by 20.  
  Orcish : Difficulty against this weapon (attacks, tactical or defense) reduced by 5.  
  Rosalian : Weapon based actions initiative +2.
- _Double_ : This weapon bears to different heads which help to perform multiple attacks on a same target of to perform attacks on different targets. It grants to different effects: Subsequents attacks are not disadvantaged against the same target is the first one have missed OR against another target.
- _x-Heads_ : This weapons is made of several heads which penetrate armor with more ease. Every heads above the first adds 1 Malus and grant +3 perforation.
- _Curved_ : This weapon present a curvy shape which grants better chance to perform very effective moves. Critical odds are improved by 10.
- _Versatile_ : Type weapon can deal another type of damage (F for flexible, P for pierce, B for blunt and S for slash).
- _Branched_ : This weapon is made of several branched which makes wounds even badder. When it comes to malus implied by wouds inflicted by this weapon, value is half higher.
- _Effictive_ : This weapon is hard to manipulate but deliver a better overall efficiency. Weapons gets +1 to all rolls.
- _Twisted_ : This weapon presents an odds an wavy shape which makes it difficult to defend against. Difficulty for you attacks is reduced by 10.
- _Pratical_ : This weapon presents a very practical design which makes it efficient to manoeuver. Difficulty for you tactics is reduced by 10.
- _Parade_ : This weapon presents a design which favors defense. Difficulty for you defenses is reduced by 10.
- _Maniability_ : This weapon is designed in a way to prevent bad moves and such. Clumsiness is reduced by 10.
- _Balanced_ : This weapon presents a very fine balance of weights or some appendage which makes it efficient to keep its owner standy and safe. Defenses against attacks or tactics are increased by 10.
- _Precise_ : This weapon is meant to be a precise tool. Weapons gets +1 precision.
- _Swift_ : This weapon is meant to be a precise tool. Weapons gets +1 maneuverability.
- _Lethal_ : This weapon is meant to hurt bad. Weapons damage rolls are improved by 2.
- _Guarding_ : This weapon is meant to guard its user from harm. Weapons deviation rolls are improved by 2.
- _Tactical_ : This weapon is meant to hinder targets which more efficiency. Weapons impact rolls are improved by 2.
- _Composite_ : This (range) weapon is meant to get the best of the user's muscles. Dices from this weapon rolls value can't be lower than actual strengher modifier of the character.

Special : This weapon displays an odd shape making it difficult to defense against.

### Sub characteristics

What is shared by weapons and very common:

| Name     |          Values           | Short description                                             |
| -------- | :-----------------------: | ------------------------------------------------------------- |
| Quality  | 0 (or less) ~ 5 (or more) | represents the quality and potential of a weapon              |
| Weight   |         -x to +x          | represents the weight of the weapon                           |
| Bulck    |         0 or more         | represents the space occupied by this weapon in the inventory |
| Range    |         -x to +x          | represents the range of the weapon                            |
| Solidity |        30 or more         | represents weapon's durability                                |
| Penalty  |           1 ~ 5           | represents an overall penalty when equipped                   |

What is shared by weapons and mostly uncommon (default values are 0):

| Name            | Short description                                    |
| --------------- | :--------------------------------------------------- |
| Penetration     | weapon ignores that much armor from targets when hit |
| Maneuverability | weapon adds that amount to actual user's speed       |
| Range           | weapon adds that amount to actual user's reach       |
| Precision       | weapon adds that amount to actual user's accuracy    |

## Weapon list

### Melee

| Name     |  C  |  Type  | Grip | Size | Width | Roll | Range | Bulk | Weight | Penalties | Properties |
| -------- | :-: | :----: | :--: | :--: | :---: | :--: | :---: | :--: | :----: | --------- | ---------- |
| Knuckles |  1  | Blunt  | STR  |      |       |      |       |      |        |           |
| Cestus   |  1  | Blunt  | CON  |      |       |      |       |      |        |           |
| Gauntlet |  1  | Blunt  | DEX  |      |       |      |       |      |        |           |
| Claw     |  1  | Pierce | AGI  |      |       |      |       |      |        |           |

### Blades

| Name          |  C  | Type  | Grip | Size | Width | Roll | Range |  Bulk   | Weight | Penalties | Properties |
| ------------- | :-: | :---: | :--: | :--: | :---: | :--: | :---: | :-----: | ------ | --------- | ---------- |
| Dagger        |  1  | Sharp | DEX  |  0   |   0   | 1d4  |  +1   |   1/2   | 10     | -1        |
| Short Sword   |  2  | Sharp | DEX  |  0   |   0   | 1d6  |  +2   |    1    | 20     | -2        |
| Long Sword    |  3  | Sharp | DEX  |  0   |   0   | 1d8  |  +3   | 1 + 1/2 | 30     | -3        |
| Bastard Sword |  4  | Sharp | DEX  |  0   |   0   | 1d10 |  +4   |    2    | 40     | -4        |
| Claymore      |  5  | Sharp | DEX  |  0   |   0   | 1d12 |  +5   | 2 + 1/2 | 50     | -5        |

| Name             |  C  | Type  | Grip | Size | Width |  Roll  | Range |  Bulk   | Weight | Penalties | Properties      |
| ---------------- | :-: | :---: | :--: | :--: | :---: | :----: | :---: | :-----: | :----: | --------- | --------------- |
| Wakizashi        |  2  | Sharp | DEX  |  0   |   0   |        |       |         |        |           | Cultural        |
| Katana           |  3  | Sharp | DEX  |  0   |   0   |        |       |         |        |           | Cultural        |
| Tachi            |  4  | Sharp | DEX  |  0   |   0   |        |       |         |        |           | Cultural        |
| Nodachi          |  5  | Sharp | DEX  |  0   |   0   |        |       |         |        |           | Cultural        |
| Kukri            |  1  | Sharp | DEX  |  0   |   1   |        |       |         |        |           | Curved          |
| Sica             |  1  | Sharp | DEX  |  1   |  -1   |        |       |         |        |           |
| Gladius          |  2  | Sharp | DEX  |  0   |   1   |        |       |         |        |           |
| Flachion         |  2  | Sharp | DEX  |  -1  |   2   |        |       |         |        |           |
| Cutlass          |  2  | Sharp | DEX  |  0   |   2   |        |       |         |        |           | Curved          |
| Saber            |  3  | Sharp | DEX  |  -1  |   1   |        |       |         |        |           | Curved          |
| Scimitar         |  3  | Sharp | DEX  |  0   |  -1   |        |       |         |        |           | Curved          |
| Flamberge        |  5  | Sharp | DEX  |  0   |   0   |        |       |         |        |           | Special         |
| Spatha           |  3  | Sharp | DEX  |  0   |   1   |        |       |         |        |           |
| Zweihander       |  5  | Sharp | DEX  |  1   |   2   |        |       |         |        |           |
| Cinquedea        |  2  | Sharp | DEX  |  -1  |   2   |        |       |         |        |           |
| Dao              |  2  | Sharp | DEX  |  0   |   2   |        |       |         |        |           | Cultural        |
| 7 Branched Sword |  4  | Sharp | DEX  |  0   |   2   |        |       |         |        |           | Branched        |
| Shotel           |  3  | Sharp | DEX  |  -1  |  -1   |        |       |         |        |           | Special, Curved |
| Greatsword       |  5  | Sharp | DEX  |  0   |   2   | 1d12+2 |  +5   | 2 + 1/2 |   50   | -7        |

### Edges

| Name         |  C  |  Type  | Grip | Size | Width | Roll | Range |  Bulk   | Weight | Penalties | Properties |
| ------------ | :-: | :----: | :--: | :--: | :---: | :--: | :---: | :-----: | :----: | --------- | ---------- |
| Stiletto     |  1  | Pierce | DEX  |  0   |   0   | 1d4  |  +1   |   1/2   |   10   | -1        |
| Smallsword   |  2  | Pierce | DEX  |  0   |   0   | 1d6  |  +2   |    1    |   20   | -2        |
| Rapier       |  3  | Pierce | DEX  |  0   |   0   | 1d8  |  +3   | 1 + 1/2 |   30   | -3        |
| Colichemarde |  4  | Pierce | DEX  |  0   |   0   | 1d10 |  +4   |    2    |   40   | -4        |
| Estoc        |  5  | Pierce | DEX  |  0   |   0   | 1d12 |  +5   | 2 + 1/2 |   50   | -5        |

| Name  |  C  |  Type  | Grip | Size | Width | Roll | Range | Bulk | Weight | Penalties | Properties |
| ----- | :-: | :----: | :--: | :--: | :---: | :--: | :---: | :--: | :----: | --------- | ---------- |
| Saï   |  1  | Pierce | DEX  |  0   |  -2   |      |       |      |        |           | Cultural   |
| Jitte |  1  | Pierce | DEX  |  0   |  -1   |      |       |      |        |           | Cultural   |
| Foil  |  2  | Pierce | DEX  |  0   |  -2   |      |       |      |        |           |

### Axes

| Name      |  C  | Type  | Grip | Size | Width | Roll | Range |  Bulk   | Weight | Penalties | Properties |
| --------- | :-: | :---: | :--: | :--: | :---: | :--: | :---: | :-----: | :----: | --------- | ---------- |
| Handaxe   |  1  | Sharp | STR  |  0   |   0   | 1d4  |  +1   |   1/2   |   10   | -1        |
| BroadAxe  |  2  | Sharp | STR  |  0   |   0   | 1d6  |  +2   |    1    |   20   | -2        |
| Battleaxe |  3  | Sharp | STR  |  0   |   0   | 1d8  |  +3   | 1 + 1/2 |   30   | -3        |
| Greataxe  |  4  | Sharp | STR  |  0   |   0   | 1d10 |  +4   |    2    |   40   | -4        |
| Waraxe    |  5  | Sharp | STR  |  0   |   0   | 1d12 |  +5   | 2 + 1/2 |   50   | -5        |

| Name         |  C  | Type  | Grip | Size | Width |  Roll  | Range |  Bulk   | Weight | Penalties | Properties              |
| ------------ | :-: | :---: | :--: | :--: | :---: | :----: | :---: | :-----: | :----: | --------- | ----------------------- |
| Throwing Axe |  1  | Sharp | STR  |  0   |   0   |  1d4   |  +1   |    1    |   20   | -3        | Throw                   |
| Hachet       |  2  | Sharp | STR  |  0   |   0   |  1d4   |  +1   |    1    |   20   | -3        | Throw                   |
| Thomahawk    |  2  | Sharp | STR  |  0   |  -1   | 1d6-1  |  +2   | 1 + 1/2 |   30   | -4        | Throw                   |
| Dwarven Axe  |  3  | Sharp | STR  |  -1  |   2   | 1d8+2  |  +2   | 1 + 1/2 |   30   | -4        | Cultural                |
| Double Axe   |  5  | Sharp | STR  |  0   |   1   | 1d12+1 |  +5   | 2 + 1/2 |   50   | -7        | Double                  |
| Urgrosh      |  5  | Sharp | STR  |  -1  |   2   |        |       |         |        |           | Cultural                |
| Antelope Axe |  5  | Slash | STR  |  0   |   1   |        |       |         |        |           | Versatile (P), Cultural |

### Pick

| Name    |  C  |  Type  | Grip | Size | Width | Roll | Range | Bulk | Weight | Penalties | Properties |
| ------- | :-: | :----: | :--: | :--: | :---: | :--: | :---: | :--: | :----: | --------- | ---------- |
| Pick    |  2  | Pierce | STR  |  0   |   0   |      |       |      |        |           |
| Pickaxe |  3  | Pierce | STR  |  0   |   0   |      |       |      |        |           |
| Warpick |  4  | Pierce | STR  |  0   |   0   |      |       |      |        |           |

### Spears

| Name       |  C  |  Type  | Grip | Size | Width | Roll | Range |  Bulk   | Weight | Penalties | Properties |
| ---------- | :-: | :----: | :--: | :--: | :---: | :--: | :---: | :-----: | :----: | --------- | ---------- |
| Shortspear |  1  | Pierce | AGI  |  0   |   0   |      |  +1   |   1/2   |   10   | -1        |
| Spear      |  2  | Pierce | AGI  |  0   |   0   |      |  +2   |    1    |   20   | -2        |
| Longspear  |  3  | Pierce | AGI  |  0   |   0   |      |  +3   | 1 + 1/2 |   30   | -3        |
| Lance      |  4  | Pierce | AGI  |  0   |   0   |      |  +4   |    2    |   40   | -4        |
| Partisan   |  5  | Pierce | AGI  |  0   |   0   |      |       |         |        |           |

| Name                |  C  |  Type  | Grip | Size | Width | Roll | Range | Bulk | Weight | Penalties | Properties    |
| ------------------- | :-: | :----: | :--: | :--: | :---: | :--: | :---: | :--: | :----: | --------- | ------------- |
| Javelin             |  1  | Pierce | AGI  |  0   |   0   |      |  +1   | 1/2  |   10   | -1        | Throw         |
| Harpoon             |  2  | Pierce | AGI  |  0   |   0   |      |       |      |        |           | Cultural      |
| Yari                |  4  | Pierce | AGI  |  2   |  -1   |      |       |      |        |           | Cultural      |
| Fork                |  3  | Pierce | AGI  |  0   |   1   |      |       |      |        |           | 2 Heads       |
| Trident             |  3  | Pierce | AGI  |  -1  |   2   |      |       |      |        |           | 3 Heads       |
| Corseque            |  4  | Pierce | AGI  |  1   |   1   |      |       |      |        |           |
| Ranseur             |  3  | Pierce | AGI  |  0   |   1   |      |       |      |        |           |
| Septum              |  3  | Pierce | AGI  |  2   |   0   |      |       |      |        |           |
| Svardstav           |  4  | Pierce | AGI  |  1   |   1   |      |       |      |        |           | Cultural      |
| Bec de corbin       |  4  | Pierce | AGI  |  0   |  -1   |      |       |      |        |           | Special       |
| Ahlspiess           |  3  | Pierce | AGI  |  0   |   1   |      |       |      |        |           | Versatile (S) |
| Trilance            |  5  | Pierce | AGI  |  2   |   2   |      |       |      |        |           | Versatile (S) |
| Pike                |  5  | Pierce | AGI  |  -1  |   3   |      |       |      |        |           |
| Lucerne Hammer (\*) |  5  | Pierce | AGI  |  2   |   0   |      |       |      |        |           | Versatile (B) |

### Polearms

| Name     |  C  | Type  | Grip | Size | Width | Roll | Range |  Bulk   | Weight | Penalties | Properties |
| -------- | :-: | :---: | :--: | :--: | :---: | :--: | :---: | :-----: | :----: | --------- | ---------- |
|          |  1  | Slash | AGI  |  0   |   0   |      |  +1   |   1/2   |   10   | -1        |
|          |  2  | Slash | AGI  |  0   |   0   |      |  +2   |    1    |   20   | -2        |
| Guisarme |  3  | Slash | AGI  |  0   |   0   |      |  +3   | 1 + 1/2 |   30   | -3        |
| Vougue   |  4  | Slash | AGI  |  0   |   0   |      |  +4   |    2    |   40   | -4        |
| Halebard |  5  | Slash | AGI  |  0   |   0   |      |  +5   | 2 + 1/2 |   50   | -5        |

| Name     |  C  | Type  | Grip | Size | Width | Roll | Range | Bulk | Weight | Penalties | Properties    |
| -------- | :-: | :---: | :--: | :--: | :---: | :--: | :---: | :--: | :----: | --------- | ------------- |
| Fauchard |  4  | Slash | AGI  |  1   |   2   |      |       |      |        |           | Cultural      |
| Vougue   |  4  | Slash | AGI  |  0   |   2   |      |       |      |        |           |
| Guandao  |  4  | Slash | AGI  |  0   |   2   |      |       |      |        |           | Cultural      |
| Naginata |  5  | Slash | AGI  |  1   |   0   |      |       |      |        |           | Cultural      |
| Poleaxe  |  5  | Slash | AGI  |  0   |   1   |      |       |      |        |           | Versatile (B) |
| Bardiche |  5  | Slash | AGI  |  -1  |   2   |      |       |      |        |           |

### Rods

| Name         |  C  | Type  | Grip | Size | Width | Roll | Range |  Bulk   | Weight | Penalties | Properties |
| ------------ | :-: | :---: | :--: | :--: | :---: | :--: | :---: | :-----: | :----: | --------- | ---------- |
|              |  1  | Blunt | AGI  |  0   |   0   |      |  +1   |   1/2   |   10   | -1        |
| Quarterstaff |  2  | Blunt | AGI  |  0   |   0   |      |  +2   |    1    |   20   | -2        |
| Battlestaff  |  3  | Blunt | AGI  |  0   |   0   |      |  +3   | 1 + 1/2 |   30   | -3        |
|              |  4  | Blunt | AGI  |  0   |   0   |      |  +4   |    2    |   40   | -4        |
|              |  5  | Blunt | AGI  |  0   |   0   |      |  +5   | 2 + 1/2 |   50   | -5        |

### Maces

| Name      |  C  | Type  | Grip | Size | Width | Roll | Range |  Bulk   | Weight | Penalties | Properties |
| --------- | :-: | :---: | :--: | :--: | :---: | :--: | :---: | :-----: | :----: | --------- | ---------- |
| Club      |  1  | Blunt | STR  |  0   |   0   |      |  +1   |   1/2   |   10   | -1        |
| Mace      |  2  | Blunt | STR  |  0   |   0   |      |  +2   |    1    |   20   | -2        |
| Hammer    |  3  | Blunt | STR  |  0   |   0   |      |  +3   | 1 + 1/2 |   30   | -3        |
| Maul      |  4  | Blunt | STR  |  0   |   0   |      |  +4   |    2    |   40   | -4        |
| Warhammer |  5  | Blunt | STR  |  0   |   0   |      |  +5   | 2 + 1/2 |   50   | -5        |

| Name                |  C  | Type  | Grip | Size | Width | Roll | Range | Bulk | Weight | Penalties | Properties    |
| ------------------- | :-: | :---: | :--: | :--: | :---: | :--: | :---: | :--: | :----: | --------- | ------------- |
| Dwarven Hammer      |  3  | Blunt | STR  |  1   |   1   |      |       |      |        |           | Cultural      |
| Lucerne Hammer (\*) |  5  | Blunt | STR  |  2   |   0   |      |       |      |        |           | Versatile (P) |

### Exotics

| Name             |  C  |   Type   | Grip | Size | Width | Roll | Range |  Bulk   | Weight | Penalties | Family  | Properties |
| ---------------- | :-: | :------: | :--: | :--: | :---: | :--: | :---: | :-----: | :----: | --------- | ------- | ---------- |
| Sling            |  1  |  Blunt   | PER  |      |       |      |       | 1 + 1/2 |   30   | -3        |         |
| Sickle           |  1  |  Slash   | DEX  |      |       |      |       |    1    |   10   | -2        |         |
| Whip             |  2  | Flexible | AGI  |      |       |      |       |   1/2   |   20   | -1        |         |
| Flail            |  3  | Flexible | STR  |      |       |      |       |         |        |           |         |
| Chain            |  3  | Flexible | AGI  |      |       |      |       |         |        |           |         |
| Katar            |  3  |  Pierce  | AGI  |      |       |      |       |         |        |           |         |
| Tri-bladed Katar |  3  |  Pierce  | AGI  |      |       |      |       |         |        |           |         | 3 Heads    |
| Scythe           |  5  |  Slash   | AGI  |      |       |      |       |         |        |           | Polearm |
| Hydra            |  3  | Flexible | STR  |      |       |      |       |         |        |           |         | 3 Heads    |
| Nunchaku         |  2  | Flexible | STR  |      |       |      |       |         |        |           |         | Double     |
| Kama             |  3  |  Sharp   | STR  |  0   |   0   |      |       |         |        |           |         |
| Fan              |  1  |  Sharp   | DEX  |  -1  |  -2   |      |       |         |        |           |         |
| Blowgun          |  1  |  Pierce  | PER  |  -2  |  -2   |      |       |         |        |           |         | Inject     |
| Morgenstern      |  3  |  Pierce  | STR  |      |       |      |       |         |        |           | Mace    |

### Throwables

| Name     |  C  |  Type  | Grip | Size | Width | Roll | Range |  Bulk   | Weight | Penalties | Properties |
| -------- | :-: | :----: | :--: | :--: | :---: | :--: | :---: | :-----: | :----: | --------- | ---------- |
| Dart     |  1  | Pierce | PER  |      |       |      |       |   1/2   |   10   | -1        |
| Kunaï    |  2  | Pierce | PER  |      |       |      |       |    1    |   20   | -2        |
| Starnife |  3  | Pierce | PER  |      |       |      |       | 1 + 1/2 |   30   | -3        |
| Chakram  |  3  | Sharp  | PER  |      |       |      |       |         |        |           |
| Bolas    |  3  | Blunt  | PER  |      |       |      |       |         |        |           |

### Bows

| Name         |  C  |  Type  | Grip | Size | Width | Roll | Range |  Bulk   | Weight | Penalties | Properties |
| ------------ | :-: | :----: | :--: | :--: | :---: | :--: | :---: | :-----: | :----: | --------- | ---------- |
| Huntbow      |  1  | Pierce | PER  |      |       |      |       |   1/2   |        |           |
| Shortbow     |  2  | Pierce | PER  |      |       |      |       |    1    |        |           |
| Longbow      |  3  | Pierce | PER  |      |       |      |       | 1 + 1/2 |        |           |
| Siegebow     |  4  | Pierce | PER  |      |       |      |       |    2    |        |           |
| Compound Bow |  5  | Pierce | PER  |      |       |      |       | 2 + 1/2 |        |           |

| Name               |  C  |  Type  | Grip | Size | Width | Roll | Range | Bulk | Weight | Penalties | Properties |
| ------------------ | :-: | :----: | :--: | :--: | :---: | :--: | :---: | :--: | :----: | --------- | ---------- |
| Composite Shortbow |  2  | Pierce | PER  |      |       |      |       |      |        |           | Composite  |
| Composite Longbow  |  3  | Pierce | PER  |      |       |      |       |      |        |           | Composite  |
| Recurve Bow        |  3  | Pierce | PER  |      |       |      |       |      |        |           | Curved     |
| Elven Bow          |  4  | Pierce | PER  |  -1  |  -2   |      |       |      |        |           | Cultural   |
| Double Bow         |  4  | Pierce | PER  |  0   |   2   |      |       |      |        |           |            |
| Kyudo              |  4  | Pierce | PER  |  2   |   0   |      |       |      |        |           | Cultural   |

### Arbalest

| Name           |  C  |  Type  | Grip | Size | Width | Roll | Range |  Bulk   | Weight | Penalties | Properties |
| -------------- | :-: | :----: | :--: | :--: | :---: | :--: | :---: | :-----: | :----: | --------- | ---------- |
| Hand Crossbow  |  1  | Pierce | PER  |      |       |      |       |   1/2   |   10   | -1        |
| Light Crossbow |  2  | Pierce | PER  |      |       |      |       |    1    |   20   | -2        |
| Heavy Crossbow |  3  | Pierce | PER  |      |       |      |       | 1 + 1/2 |   30   | -3        |
| Arbalest       |  4  | Pierce | PER  |      |       |      |       |    2    |   40   | -4        |
| Ballista       |  5  | Pierce | PER  |      |       |      |       | 2 + 1/2 |   50   | -5        |

| Name               |  C  |  Type  | Grip | Size | Width | Roll | Range | Bulk | Weight | Penalties | Properties |
| ------------------ | :-: | :----: | :--: | :--: | :---: | :--: | :---: | :--: | :----: | --------- | ---------- |
| Repeating Crossbow |  3  | Pierce | PER  |  1   |   1   |      |       |      |        |           | Repeating  |
| Wallarmbrust       |  5  | Pierce | PER  |  1   |   1   |      |       |      |        |           |

### Handguns

| Name     |  C  |  Type  | Grip | Size | Width | Roll | Range |  Bulk   | Weight | Penalties | Properties |
| -------- | :-: | :----: | :--: | :--: | :---: | :--: | :---: | :-----: | :----: | --------- | ---------- |
| Handgun  |  2  | Pierce | PER  |      |       |      |       |    1    |   20   | -2        |
| Revolver |  3  | Pierce | PER  |      |       |      |       | 1 + 1/2 |   30   | -3        |
| Pistol   |  4  | Pierce | PER  |      |       |      |       |    2    |   40   | -4        |
| Magnum   |  5  | Pierce | PER  |      |       |      |       | 2 + 1/2 |   50   | -5        |

### Rifles

| Name      |  C  |  Type  | Grip | Size | Width | Roll | Range |  Bulk   | Weight | Penalties | Properties |
| --------- | :-: | :----: | :--: | :--: | :---: | :--: | :---: | :-----: | :----: | --------- | ---------- |
| Arquebuse |  2  | Pierce | PER  |      |       |      |       |    1    |   20   | -2        |
| Carabine  |  3  | Pierce | PER  |      |       |      |       | 1 + 1/2 |   30   | -3        |
| Musket    |  4  | Pierce | PER  |      |       |      |       |    2    |   40   | -4        |
| Rifle     |  5  | Pierce | PER  |      |       |      |       | 2 + 1/2 |   50   | -5        |

| Name       |  C  |  Type  | Grip | Size | Width | Roll | Range | Bulk | Weight | Penalties | Properties |
| ---------- | :-: | :----: | :--: | :--: | :---: | :--: | :---: | :--: | :----: | --------- | ---------- |
| Handgonne  |  2  | Pierce | PER  |      |       |      |       | 1/2  |   10   | -1        |
| Musketoon  |  4  | Pierce | PER  |  -2  |   1   |      |       |      |   0    |           |
| Shotgun    |  4  | Pierce | PER  |  -2  |   2   |      |       |      |   0    |           |
| Long Rifle |  4  | Pierce | PER  |  -2  |   2   |      |       |      |   0    |           |
