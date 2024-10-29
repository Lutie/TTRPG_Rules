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

## Trump cards

A character can always consider the attribute with the highest natural value as their "trump". If a character has another attribute that surpasses their current trump attribute, the trump status only changes if the current trump attribute does not have a "tension" marker.  
It is also possible to have an additional trump through specific traits.

When a character wishes, they can justify a methodology, preparation, or other actions that utilize their trump attribute for a given action. This must make sense and be explainable in detail; common sense should prevail, and the GM has the final say in whether the interpretation is valid or not (no tension applied if not valid).  

When this is the case, the character receives a "tension" marker on their trump attribute, and the test is advantaged. In combat, this requires a quick action.  
If the attribute has a current tension level greater than [Attribute Modifier - 3]/2, this is not possible.  

| Attribute Value | Maximum Tension Markers |
|-----------------|-------------------------|
| 50              | 1                       |
| 70              | 2                       |
| 90              | 3                       |
| +20             | +1                      |

A character's attribute loses one tension marker with each full rest.

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
