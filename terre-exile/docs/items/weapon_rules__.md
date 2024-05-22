# Weapon Rules

## Weapon characteristics

### Main characteristics

This is basically what makes a weapon unique.

| Name      |                       Values                       | Short description                                             |
| --------- | :------------------------------------------------: | ------------------------------------------------------------- |
| Category  |                       1 ~ 5                        | represents complexity and efficiency                          |
| Type      |          sharp, blunt, piercing, flexible          | represents how the weapon deals damage                        |
| Grip      | hilt (DEX), handle (STR), shaft (AGI), range (PER) | represents the way the weapon is wielded                      |
| Size      |                 -1 ~ 1, default 0                  | represents the size of the weapon in relation to standards    |
| Width     |                 -1 ~ 1, default 0                  | represents the width of the weapon in relation to standards   |
| Balance   |                 -1 ~ 1, default 0                  | represents the balance of the weapon in relation to standards |
| Archetype |           sword, axe, hast, mace, exotic           | defines the family in which the weapon in question falls      |

#### Category

Category is a clever mix between complexity, heaviness, size, efficiency... the more advanced a weapon is, the more effective it will be but will require significant training to take advantage of it.

| Category |   Type   | Default roll | Default range | Default bulk | Default weight | Default penalty |
| -------- | :------: | :----------: | :-----------: | :----------: | :------------: | :-------------: |
| 0        |   None   |      d2      |       0       |      0       |       0        |        0        |
| 1        |  Common  |      d4      |      1/2      |     1/2      |       10       |        1        |
| 2        | Skirmish |      d6      |       1       |      1       |       20       |        2        |
| 3        |  Battle  |      d8      |    1 + 1/2    |   1 + 1/2    |       30       |        3        |
| 4        |  Siege   |     d10      |       2       |      2       |       40       |        4        |
| 5        |   War    |     d12      |    2 + 1/2    |   2 + 1/2    |       50       |        5        |

**Common Weapons**: These weapons are the most widespread and accessible to the general population, including hunters. They include daggers, staves, and clubs. Light and easy to handle, they are often chosen for personal defense or as versatile tools in daily life. Their simplicity and limited effectiveness make them ideal for small-scale confrontations or for individuals without combat training.

**Skirmish Weapons**: Designed for fast and mobile confrontations, these weapons favor speed and surprise. They include short swords, light bows, and spears. Used in harassment or reconnaissance tactics, these weapons allow fighters to quickly engage the enemy and withdraw before reinforcements arrive. They are favored by scouts and small mobile units.

**Battle Weapons**: Robust and effective, these weapons are designed for major clashes between armed forces. Including longswords, battle axes, and clubs, they require some skill to use effectively but can inflict considerable damage. Heavy armor and shields are often associated with these weapons, providing fighters with increased protection during pitched battles.

**Siege Weapons**: Specifically designed for breaching fortifications or fighting under siege conditions, these weapons include battering rams, catapults, and heavy crossbows. They are characterized by their imposing size and their need to be operated by several people or complex mechanisms. Their use is crucial to overcoming enemy defenses and paving the way for an invasion.

**Weapons of War**: These weapons symbolize large-scale conflict and are often centerpieces on the battlefield. Including trebuchets, ballistae, and other large-scale war machines, they require significant logistics for their transport, assembly, and use. These weapons are capable of changing the course of a war thanks to their considerable destructive power and their ability to inflict massive casualties.

Category have a direct effect on:

| Weapon  | Every additional Category |
| ------- | ------------------------- |
| Roll    | +1 dice size              |
| Range   | +1/2                      |
| Bulk    | +1/2                      |
| Weight  | +10                       |
| Penalty | +1                        |

Also a weapon is broken when its break counter reach its category, meaning category is directly bind to a weapon's durability.

#### Range

#### Roll

#### Bulck

#### Penalty

#### Type

Weapon type represents the type of damage dealt by the weapon's primary deadly surface or how it is used.  
Weapon type makes a big difference when it comes to the value of the weapon's rolls or the weapon triangle.  
The average of the weapon's rolls is always the same (except in cases noted \* or \*\*), but the calculation differs, which can make a difference in situations affecting these values.

| Type     | Common      | Skirmish    | Battle       | Siege         | War             | Damage type |
| -------- | ----------- | ----------- | ------------ | ------------- | --------------- | ----------- |
| Sharp    | 1d4 (1~4)   | 1d6 (1~6)   | 1d8 (1~8)    | 1d10 (1~10)   | 1d12 (1~12)     | Slash       |
| Blunt    | 1d6-1 (0~5) | 1d8-1 (0~7) | 1d10-1 (0~9) | 1d12-1 (0~11) | 2d6 (2~12) \*\* | Chop        |
| Piercing | 1d2+1 (2~3) | 1d4+1 (2~5) | 1d6+1 (2~7)  | 1d8+1 (2~9)   | 1d10+1 (2~11)   | Thrust      |
| Flexible | 2 (2) \*    | 1d2+2 (3~4) | 1d4+2 (3~6)  | 1d6+2 (3~8)   | 1d8+2 (3~10)    | Abrasive    |
| Average  | 2,5         | 3,5         | 4,5          | 5,5           | 6,6             |             |

\*\* : Penalty increased by 1

#### Grip

The grip defines which attribute is used to handle the weapon in order to perform attacks.
It does not affect tactics and defenses, which depends on their nature.

- **Hilted Weapons** (like swords): Weapons with a hilt are those whose handling requires great finesse and precision. The handle allows for quick and precise movements, necessary to strike specific targets or exploit opponent's weaknesses. For this reason, the main attribute for wielding these weapons is Dexterity (DEX). Dexterity reflects the fighter's ability to perform precise and coordinated movements, essential to getting the most out of grip weapons.
- **Handled Weapons** (such as axes): Weapons with handles are designed to inflict damage through brute force. The handle extends the reach of the weapon and increases the power of the blow thanks to the force applied. Effectively using a hafted weapon therefore requires considerable Strength (FOR). Strength influences the fighter's ability to lift, swing, and strike with the weapon, transforming muscular energy into devastating punching power.
- **Shafted Weapons** (such as spears): Shafted weapons combine extended reach with the need for quick, controlled movements, exploiting both the reach to keep the enemy at bay and the ability to deliver rapid blows . For this reason, the main attribute for these weapons is Agility (AGI). Agility determines the fighter's ability to manipulate the weapon with velocity and precision, allowing them to react quickly to the opponent's movements while maintaining a safe distance.
- **Ranged Weapons** (such as bows or rifles): Ranged weapons allow engaging the enemy from a secure position, utilizing accuracy and distance judgment. The primary attribute for these weapons is Perception (PER). Perception affects the fighter's ability to accurately assess the distance and movements of the enemy, ensuring that each shot is made with maximum precision. This allows the fighter to remain outside the immediate reach of the enemy while still being able to inflict effective damage.

#### Particularities

Weapons may have particularities. The features require an improvement slot that the quality provides (1 improvement slot per quality level of an item).
Every particularity implies at least a boost in penalty by 1, but this can be different (mostly higher) depending on the given particularity.

- _Excellent_ : This weapon is thinked and shaped in order to compensate its bad sides.
  <> Penalties are reduced by 1. They can't become lower than 0 this way.

- _Cultural_ : This weapon is aligned with a given culture, advantages and disavantages depends on the given culture.  
  <> Elven : Weight reduced by 20.  
  <> Dwarven : Solidity increased by 20.  
  <> Orcish : Difficulties against this weapon (attacks, tactical or defense) reduced by 5.  
  <> ? : Defense difficulties against this weapon increased by 10.  
  <> Rosalian : Initiative increased by 2 (for actions performed throught this weapon).
- _Double_ : This weapon bears to different heads which help to perform multiple attacks on a same target of to perform attacks on different targets.
  <> Subsequents attack or tactical action are not disadvantaged: against the same target if the first one have missed /OR/ against another target.

- _Curved_ : This weapon present a curvy shape which grants better chance to perform very effective moves.
  <> Critical success rate (science) is improved by 10.
- _Maniability_ : This weapon is designed in a way to prevent bad moves and such.
  <> Critical miss rate (clumsiness) is reduced by 10.

- _Versatile_ : Type weapon present different type of heads in order to perform different kind of damage.  
  <> Can deal another type of damage (F for flexible, P for pierce, B for blunt and S for slash).
- _Branched_ : This weapon is made of several branched which makes wounds even badder.
  <> When it comes to malus implied by wouds inflicted by this weapon, value is half higher.

- _Twisted_ : This weapon presents an odds an wavy shape which makes it difficult to defend against.
  <> Difficulty associated to your attack actions are reduced by 10.
- _Pratical_ : This weapon presents a very practical design which makes it efficient to manoeuver.  
  <> Difficulty associated to your tactical actions are reduced by 10.
- _Parade_ : This weapon presents a design which favors defense.  
  <> Difficulty associated to your defense actions is reduced by 10.
- _Balanced_ : This weapon presents a very fine balance of weights or some appendage which makes it efficient to keep its owner standy and safe.
  <> Defense actions (against attacks or tactics) are increased by 10.

- _Precise_ : This weapon is meant to be a precise tool.
  <> Weapons gets +1 precision.
- _Swift_ : This weapon is meant to be a precise tool.
  <> Weapons gets +1 maneuverability.
- _X-Heads_ : This weapons is made of several heads which penetrate armor with more ease.
  <> Every heads above the first one adds 1 Malus but grant +3 perforation.
- _Sharp_ : This weapons is extra sharp and can pass throught protections.
  <> The weapon ignores 1 point of target's protection.

- _Effictive_ : This weapon is hard to manipulate but deliver a better overall efficiency.
  <> All throws increased by 1.
- _Lethal_ : This weapon is meant to hurt bad.  
  <> Weapons damage rolls are improved by 1.
- _Guarding_ : This weapon is meant to guard its user from harm.  
  <> Weapons deviation rolls are improved by 1.
- _Tactical_ : This weapon is meant to hinder targets which more efficiency.
  <> Weapons impact rolls are improved by 1.
- _?_ : This weapon is able to perform very effective moves when used with extra precision.  
  <> Weapons throws are improved by 5 on a critical success.
- _Guilded_ : This weapon appearence is improved in order to appear nobler.  
  <> ???.

- _Vorpal_ : This weapon is meant to cut heads.
  <> Weapons damage rolls are improved by 2 when located on the head location.
- _?_ : This weapon is meant to disable the uses of arms.
  <> Weapons wounds are improved by 10 when located on the arms location.
- _?_ : This weapon is meant to disable the uses of tendons.
  <> Weapons wounds are improved by 10 when located on the legs location.

- _Mecanical_ : This weapon is [...]
  <> Weapons penetration improved by 3, but weapon can grip or break.
- _Dangerous_ : This weapon is [...]
  <> Weapons damage roll improved by 2, only for mecanical weapons for which reliability is decreased, also recoil may disarm/knockdown user.

- _Specialized_ : This weapon is specialized in a given (none common) type of action.
  <> When used for its specialized move, on at least a minor success this weapon get 1 extra roll.
  But this weapon also lose one roll on all other kind of moves.

- _Oriented_ : This weapon is oriented in a given (none common) type of action.
  <> When used for its oriented move this weapon have an increased bonus of 2.  
  If we factor out the malus due to this property it amounts to a bonus of 1 in the oriented action and a penalty of 1 for the others.

  Tactical specialized/oriented move can be: Disarm, Knockback, Knockdown, Lockdown.
  Defense specialized/oriented move can be: Parry, Block.
  Attack specialized/oriented move can be: Opportunity, Counter.

- _Composite_ : This (range) weapon is meant to get the best of the user's muscles.
  <> Dices from this weapon rolls value can't be lower than actual strengh modifier of the user.
- _Throw_ : This (none ranged) weapon is suitable to be used as a thrown weapon.
  <> When throwing that kind of weapon does not imply a disadvantage.
