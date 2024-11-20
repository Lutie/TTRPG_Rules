---
icon: material/label 
---
# How to play

## Success and Actions

To determine the outcome of an action, you need to perform a test. This involves rolling a 100-sided die (1d100). Here's a detailed guide to help you understand how to conduct these tests and interpret the results.

### Rolling the Dice

- Roll the die: Roll 1d100, making sure to distinguish between the tens and the units.
- Compare the result: Compare the roll result to various values related to your character and the action being taken.

### Test Steps

**Attribute Check**

- Determine the attribute: Each action is associated with an attribute based on the nature of the scene and the action.
- Compare the result: If the roll result is less than or equal to the attribute value, the action get one success.
  - If the attribute value is greater than 100, the action is an automatic success. Additionally, the amount exceeding 100 is used to determine if there is an extra success.

**Skill Check**

- Identify the skill: The action is also linked to a specific skill.
- Compare the result: Compare the roll result to the skill value. If the result is less than or equal to this value, the action gains get one success, which stacks with previous ones. The skill value depends on the skill rank and any relevant specializations.

**Feat Check**

- Consider the feat: The action may benefit from a feat, influenced by rank, specialization, and the luck attribute.
- Compare the result: If the roll result is less than or equal to the feat value, the action gains one success, which stacks with previous ones. This check can be performed by an opponent or the game master (GM) based on the difficulty imposed by their character or the situation.

**Mishap Check**

- Check for mishap: Mishap represents the potential for failure even under optimal conditions.
- Compare the result: If the roll result is greater than or equal to the mishap value (starting at 90), the action loses a success.

### Modifiers and Difficulties

**Penalties and Bonuses**

- Modifiers: An action may be influenced by modifiers ranging from -30 (very difficult) to +30 (very easy).
- Application: This modifier directly affects the attribute value for the action (but not the skill or feat values).

**Difficulty**

- Determine difficulty: Difficulty represents the inherent complexity of an action. Against an opponent, difficulty is based on the opponent's capabilities. Otherwise, the GM determines the difficulty.
- Compare the result: Compare the inverted roll result to the difficulty. If the inverted result is less than the difficulty, the action loses a success.

### Action Outcomes

The total number of successes determines the final outcome of the action:

| Number of Successes | Outcome          | Description                                         | Result      | Throw   |
| ------------------- | ---------------- | --------------------------------------------------- | ----------- | ------- |
| -2 successes        | Critical failure | The action fails with severe consequences           | no and ...  | no      |
| -1 success          | Major failure    | The action fails                                    | no          | no      |
| 0 successes         | Minor failure    | The action fails but with potential mitigation      | no but ...  | 0 dice  |
| 1 success           | Minor success    | The action succeeds with conditions                 | yes but ... | 1 dice  |
| 2 successes         | Major success    | The action succeeds                                 | yes         | 2 dices |
| 3 successes or more | Critical success | The action succeeds brilliantly with extra benefits | yes and ... | 3 dices |

## Modifying Success Chances

You can modify the chances of success for an action by spending resources strategically.
These options allow players to influence outcomes and add a layer of strategy to their decision-making processes.

**Spiritual Points:**

- Before the test: Spend 1 Spiritual Point (PS) to grant a one-time bonus of +10 to the attribute.
- After the test: If a point has not already been spent, you can spend 1 Spiritual Point (PS) for a one-time bonus of +5.

**Karma Points:**

- After the test: Spend 1 Karma Point (PK) to reroll the test, but this can only be done once per test.

## Advantage and Disadvantage

Sometimes, a test may be advantaged or disadvantaged, affecting the roll results.

- **Advantaged Test:** Roll two tens dice instead of one and keep the lower result.
- **Disadvantaged Test:** Roll two tens dice instead of one and keep the higher result.
- **Combined Advantage and Disadvantage:** If a test is both advantaged and disadvantaged, sum the advantages and disadvantages. The test is advantaged if there are more advantages, and disadvantaged if there are more disadvantages.

## Examples

For our examples, we will consider a single scenario:
Aribeth attacks a goblin using her halberd. She has 60 in AGI (agility) and 20 in LCK (luck), the attributes corresponding to the use of this weapon, and the goblin has 30 in DEX (dexterity), the attribute corresponding to the defense against this weapon.
She also has the Melee Combat skill (specialization in polearms) at rank 3 (30 + 15).

### Case 1

The d100 is rolled and shows a 56.

- 56 is less than 60: Aribeth's attribute provides one success.
- 56 is more than 45: Aribeth's skill does not provide a success.
- 56 is more than 20: The feat does not provide a success.
- 56 is less than 90: Mishap does not remove a success.
- 65 (the inverse of 56) is more than 30: The target's attribute does not remove a success.

The attack results in one success, which is a minor success.

### Case 2

The d100 is rolled and shows a 51.

- The same observations apply as in Case 1, except for one.
- 15 (the inverse of 51) is less than 30: The target's attribute removes one success.

The attack results in zero successes, which is a minor failure.

### Case 3

The d100 is rolled and shows a 5.

- 5 is less than 60: The attribute provides one success.
- 5 is less than 45: The skill provides one success.
- 5 is less than 20: The feat provides one success.
- 50 (the inverse of 5) is more than 30: The target's attribute does not remove a success.
- 5 is less than 90: Mishap does not remove a success.

The attack results in three successes, which is a critical success.

## Save checks

Save checks works differently than other checks.  
Those checks only use a D20 (that's the only case when those type of dice are involved).  
The resultat of that throw is added to a one of the character's save value, which can be one of the following: Thougness, Flexibility, Bravery, Composure, Intuition, Fortune, Opposition or Initiative.  
You can see what those saves are used for on the characteristics section.    

A core difference between a skill check and a save check is that the later does not require any actions to perform, nor decisions to make, those are automatic events implied by the story or adversary's actions.  

### Save difficulty  

When a save check is required it is always graded as "normal", "easy", "hard" or "extreme".  
The "normal" save difficulty is equal to either the opponent's (which actions are the origin of that save check) malice value + 5 (physical, mental or social, depending on the action nature involved) OR to 15 (when no such opponent can be identified).  
The "easy" save difficulty is equal to the opponent's malice value OR to 10.  
The "hard" save difficulty is equal to the opponent's malice value OR to 20.  
The "extreme" save difficulty is equal to the opponent's malice value OR to 25.  

A save checks can result in those outcome:  
- Check < Difficulty + 5 : Critical fail  
- Check < Difficulty : Critical   
- Check > Difficulty : Success   
- Check > Difficulty + 5 : Critical Success  

Depending on that result:  
- Effects may be increased by half for a critical fail  
- Effects may be applied as it is for a fail  
- Effects may be reduced by half for a success  
- Effects may be nullified/ignored for a critical success  

Note that a normal save check may not mention the "normal" aspect of them and simply ask for a save check, while other form of save checks will tell explicitly which difficulty is required by spelling "requires an easy save check" or something alike.  
In other words, if nothing is mentioned then it is a "normal" save check that is required by default.  

### Save example  

Let's say a bandit tries to blind one of the character.  
Blind is a condition, which are always applied with a charge determining the time for recovery (charge are reduced by the recovery value of the victim each turn).  
His action involve a "normal" save check with a difficulty of 13 (his malice of 8 + 5).  
The character rolls a 11 on its dice but have a Thougness of 3 which results in a total of 14.  
Since this result is superior than 13 but not than 18 then its a regular success.  
Hence that characters suffers a blindness but with half of its charges.  
