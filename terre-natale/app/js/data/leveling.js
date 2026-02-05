const CasteProgression = {
  get() {
    return [
      {
        rang: 1,
        titre: "Apprenti",
        reqXp: 50,
        reqAptitude: 7,
        pcMax: 1,
        pa: 7,
        sauvegardes: { max: 2, mid: 1, min: 0 },
        attributsCasteMax: 18,
        bonusEquilibre: 0,
        avantages: [
          {
            nom: "Privilège de Caste",
            description:
              "Le personnage peut désormais faire appel au privilège de sa caste. Il peut donc dépenser autant de PC que le « privilège PC max » associé à son rang dans les situations couverts par le dit privilège.",
          },
          {
            nom: "Entraînement aux armures (1)",
            description:
              "Une caste est associée à divers entraînements qui couvrent ses besoins lors de ses activités. Il existe les entraînements suivants : Armes de mêlée, Armes de tir, Armures, Sociale, Outils, Focalisateurs, Steam.\nLorsqu’un personnage acquiert un avantage de ce type, il reçoit un rang dans le trait d'entraînement qui est associé, avec les mêmes conditions d’acquisition (et de rang maximum) que pour les traits en question.\nL'entraînement permet de réduire les pénalités d’attributs associés aux tests d’une action profitant d’une catégorie supérieure à 0. Un entraînement de rang 1 réduit ces pénalités de 2, un entraînement de rang 2 réduit ces pénalités de 4 à la place.\nCe n’est pas parce qu’une caste n’a pas certains entraînements dans sa liste que les traits ne sont pas accessibles via les points de personnage.",
          },
          {
            nom: "Maîtrise de caste 1",
            description:
              "Cette valeur affecte 3 sujets : La connaissance, la réputation et la récupération de caste.\nRécupération de caste : utilisée pour augmenter la récupération des ressources associées à la caste (si la ressource est l’endurance, c’est la récupération de fatigue qui augmente).\nConnaissance de caste : défausse pour mesurer la connaissance propre à sa caste, remplaçant le modificateur compétence + groupe par la valeur correspondant au rang actuel (tests via Intelligence).\nRéputation de caste : défausse pour mesurer la réputation au sein de la caste.",
          },
        ],
      },
      {
        rang: 2,
        titre: "Apprenti +",
        reqXp: 100,
        reqAptitude: 9,
        pcMax: 2,
        pa: 8,
        sauvegardes: { max: 2, mid: 1, min: 0 },
        attributsCasteMax: 19,
        bonusEquilibre: 1,
        avantages: [
          {
            nom: "Entrainement de Caste (1)",
            description:
              "Une caste est associée à divers entraînements qui couvrent ses besoins lors de ses activités. Il existe les entraînements suivants : Armes de mêlée, Armes de tir, Armures, Sociale, Outils, Focalisateurs, Steam.\nLorsqu’un personnage acquiert un avantage de ce type, il reçoit un rang dans le trait d'entraînement qui est associé, avec les mêmes conditions d’acquisition (et de rang maximum) que pour les traits en question.\nL'entraînement permet de réduire les pénalités d’attributs associés aux tests d’une action profitant d’une catégorie supérieure à 0. Un entraînement de rang 1 réduit ces pénalités de 2, un entraînement de rang 2 réduit ces pénalités de 4 à la place.\nCe n’est pas parce qu’une caste n’a pas certains entraînements dans sa liste que les traits ne sont pas accessibles via les points de personnage.",
          },
          {
            nom: "Formation Initiale",
            description:
              "Donne le trait de formation associé à l’attribut de caste principal choisi par le personnage.\nLa formation permet d’éviter les maladresses sur les doubles 2.",
          },
        ],
      },
      {
        rang: 3,
        titre: "Compagnon",
        reqXp: 200,
        reqAptitude: 11,
        pcMax: 3,
        pa: 9,
        sauvegardes: { max: 3, mid: 1, min: 0 },
        attributsCasteMax: 19,
        bonusEquilibre: 1,
        avantages: [
          {
            nom: "1er Trait de Caste",
            description:
              "Donne le 1er trait de la Caste.\nPour une caste de base le 1e trait peut être choisi parmi les avantages des règles de base (mais pas celles des extensions) OU parmi les 1er traits des castes avancées qui partagent au moins un attribut avec elle.\nPour une caste avancée le trait en question est le 1er trait associé à la caste, ce sont des traits uniques.",
          },
          {
            nom: "Maîtrise de caste 2",
            description:
              "Cette valeur affecte 3 sujets : La connaissance, la réputation et la récupération de caste.\nRécupération de caste : utilisée pour augmenter la récupération des ressources associées à la caste (si la ressource est l’endurance, c’est la récupération de fatigue qui augmente).\nConnaissance de caste : défausse pour mesurer la connaissance propre à sa caste, remplaçant le modificateur compétence + groupe par la valeur correspondant au rang actuel (tests via Intelligence).\nRéputation de caste : défausse pour mesurer la réputation au sein de la caste.",
          },
        ],
      },
      {
        rang: 4,
        titre: "Compagnon +",
        reqXp: 370,
        reqAptitude: 13,
        pcMax: 4,
        pa: 10,
        sauvegardes: { max: 3, mid: 2, min: 0 },
        attributsCasteMax: 19,
        bonusEquilibre: 2,
        avantages: [
          {
            nom: "Entrainement de Caste (2)",
            description:
              "Une caste est associée à divers entraînements qui couvrent ses besoins lors de ses activités. Il existe les entraînements suivants : Armes de mêlée, Armes de tir, Armures, Sociale, Outils, Focalisateurs, Steam.\nLorsqu’un personnage acquiert un avantage de ce type, il reçoit un rang dans le trait d'entraînement qui est associé, avec les mêmes conditions d’acquisition (et de rang maximum) que pour les traits en question.\nL'entraînement permet de réduire les pénalités d’attributs associés aux tests d’une action profitant d’une catégorie supérieure à 0. Un entraînement de rang 1 réduit ces pénalités de 2, un entraînement de rang 2 réduit ces pénalités de 4 à la place.\nCe n’est pas parce qu’une caste n’a pas certains entraînements dans sa liste que les traits ne sont pas accessibles via les points de personnage.",
          },
          {
            nom: "Formation Finale",
            description:
              "Donne le trait de formation associé à l’attribut de caste secondaire choisi par le personnage.\nLa formation permet d’éviter les maladresses sur les doubles 2.",
          },
          {
            nom: "Action de Caste",
            description:
              "Le personnage peut désormais faire appel à l’action (ou les actions) spécifiques à sa caste. Ces actions sont uniques et dépendent de la caste en question, contrairement aux privilèges et traits de Caste ces actions sont forcément orientées pour les confrontations.",
          },
        ],
      },
      {
        rang: 5,
        titre: "Expert",
        reqXp: 550,
        reqAptitude: 17,
        pcMax: 5,
        pa: 11,
        sauvegardes: { max: 4, mid: 2, min: 1 },
        attributsCasteMax: 20,
        bonusEquilibre: 2,
        avantages: [
          {
            nom: "Point de Personnage +1",
            description:
              "A certains rang le personnage reçoit simplement 1 point de personnage (PP) supplémentaire qu’il peut utiliser sur le champ ou plus tard pour acquérir de nouveaux traits.\nComme pour les PP lors de la création, le personnage n’est pas limité dans ses choix (sauf conditions d’acquisition).",
          },
          {
            nom: "Science de la Caste",
            description:
              "Donne le trait de science associé à l’attribut de caste principal choisi par le personnage.\nLa Science de la Caste + donne la science associée à l’autre attribut.",
          },
          {
            nom: "Maîtrise de caste 3",
            description:
              "Cette valeur affecte 3 sujets : La connaissance, la réputation et la récupération de caste.\nRécupération de caste : utilisée pour augmenter la récupération des ressources associées à la caste (si la ressource est l’endurance, c’est la récupération de fatigue qui augmente).\nConnaissance de caste : défausse pour mesurer la connaissance propre à sa caste, remplaçant le modificateur compétence + groupe par la valeur correspondant au rang actuel (tests via Intelligence).\nRéputation de caste : défausse pour mesurer la réputation au sein de la caste.",
          },
        ],
      },
      {
        rang: 6,
        titre: "Expert +",
        reqXp: 700,
        reqAptitude: 21,
        pcMax: 6,
        pa: 12,
        sauvegardes: { max: 4, mid: 2, min: 1 },
        attributsCasteMax: 20,
        bonusEquilibre: 3,
        avantages: [
          {
            nom: "Entrainement de Caste (3)",
            description:
              "Une caste est associée à divers entraînements qui couvrent ses besoins lors de ses activités. Il existe les entraînements suivants : Armes de mêlée, Armes de tir, Armures, Sociale, Outils, Focalisateurs, Steam.\nLorsqu’un personnage acquiert un avantage de ce type, il reçoit un rang dans le trait d'entraînement qui est associé, avec les mêmes conditions d’acquisition (et de rang maximum) que pour les traits en question.\nL'entraînement permet de réduire les pénalités d’attributs associés aux tests d’une action profitant d’une catégorie supérieure à 0. Un entraînement de rang 1 réduit ces pénalités de 2, un entraînement de rang 2 réduit ces pénalités de 4 à la place.\nCe n’est pas parce qu’une caste n’a pas certains entraînements dans sa liste que les traits ne sont pas accessibles via les points de personnage.",
          },
          {
            nom: "2nd Trait de Caste",
            description:
              "Donne le 2e trait de la Caste.\nPour une caste de base le 2e trait peut être choisi parmi les avantages des règles de base (mais pas celles des extensions) OU parmi les 1er traits des castes avancées qui partagent un ou plusieurs attributs de caste.\nPour une caste avancée un choix est possible : soit il acquiert le 2eme trait de sa Caste, soit il acquiert le 1er trait d’une caste qui partage un ou plusieurs attributs de caste.\nSi le personnage opte pour le trait d’une autre caste il se lie à cette caste et ne pourra plus formuler de choix issus d’une autre caste.",
          },
        ],
      },
      {
        rang: 7,
        titre: "Maître",
        reqXp: 950,
        reqAptitude: 25,
        pcMax: 7,
        pa: 13,
        sauvegardes: { max: 5, mid: 3, min: 1 },
        attributsCasteMax: 20,
        bonusEquilibre: 3,
        avantages: [
          {
            nom: "Point de Personnage +1",
            description:
              "A certains rang le personnage reçoit simplement 1 point de personnage (PP) supplémentaire qu’il peut utiliser sur le champ ou plus tard pour acquérir de nouveaux traits.\nComme pour les PP lors de la création, le personnage n’est pas limité dans ses choix (sauf conditions d’acquisition).",
          },
          {
            nom: "Science de la Caste +",
            description:
              "Donne le trait de science associé à l’attribut de caste principal choisi par le personnage.\nLa Science de la Caste + donne la science associée à l’autre attribut.",
          },
          {
            nom: "Maîtrise de caste 4",
            description:
              "Cette valeur affecte 3 sujets : La connaissance, la réputation et la récupération de caste.\nRécupération de caste : utilisée pour augmenter la récupération des ressources associées à la caste (si la ressource est l’endurance, c’est la récupération de fatigue qui augmente).\nConnaissance de caste : défausse pour mesurer la connaissance propre à sa caste, remplaçant le modificateur compétence + groupe par la valeur correspondant au rang actuel (tests via Intelligence).\nRéputation de caste : défausse pour mesurer la réputation au sein de la caste.",
          },
        ],
      },
      {
        rang: 8,
        titre: "Maître +",
        reqXp: 1250,
        reqAptitude: 29,
        pcMax: 8,
        pa: 14,
        sauvegardes: { max: 5, mid: 3, min: 1 },
        attributsCasteMax: 21,
        bonusEquilibre: 4,
        avantages: [
          {
            nom: "Action de Caste améliorée",
            description:
              "Choix : version améliorée de l’action de caste, ou action (non améliorée) d’une caste partageant des attributs.\nSi le personnage opte pour une autre caste il se lie à cette caste et ne pourra plus formuler de choix issus d’une autre.",
          },
          {
            nom: "Compétences supérieures",
            description:
              "Lorsqu’il acquiert cet avantage, le personnage peut désormais apprendre ses compétences jusqu’au rang 5.",
          },
        ],
      },
      {
        rang: 9,
        titre: "Grand Maître",
        reqXp: 1600,
        reqAptitude: 33,
        pcMax: 9,
        pa: 15,
        sauvegardes: { max: 6, mid: 3, min: 2 },
        attributsCasteMax: 21,
        bonusEquilibre: 4,
        avantages: [
          {
            nom: "Point de Personnage +1",
            description:
              "A certains rang le personnage reçoit simplement 1 point de personnage (PP) supplémentaire qu’il peut utiliser sur le champ ou plus tard pour acquérir de nouveaux traits.\nComme pour les PP lors de la création, le personnage n’est pas limité dans ses choix (sauf conditions d’acquisition).",
          },
          {
            nom: "Maîtrise de caste 5",
            description:
              "Cette valeur affecte 3 sujets : La connaissance, la réputation et la récupération de caste.\nRécupération de caste : utilisée pour augmenter la récupération des ressources associées à la caste (si la ressource est l’endurance, c’est la récupération de fatigue qui augmente).\nConnaissance de caste : défausse pour mesurer la connaissance propre à sa caste, remplaçant le modificateur compétence + groupe par la valeur correspondant au rang actuel (tests via Intelligence).\nRéputation de caste : défausse pour mesurer la réputation au sein de la caste.",
          },
        ],
      },
      {
        rang: 10,
        titre: "Grand Maître +",
        reqXp: 2000,
        reqAptitude: 37,
        pcMax: 10,
        pa: 16,
        sauvegardes: { max: 6, mid: 4, min: 2 },
        attributsCasteMax: 21,
        bonusEquilibre: 5,
        avantages: [
          {
            nom: "Récupération Supérieure (+1)",
            description: "La récupération du personnage est améliorée de X.",
          },
          {
            nom: "Savoir-Faire",
            description:
              "Via ce trait le personnage peut remplacer la valeur des dés affichants 1 et 2 par 3 dans le cadre des jets basés sur les attributs de sa caste.\nCette altération de valeurs n’affecte pas les singularités.",
          },
        ],
      },
      {
        rang: 11,
        titre: "Sommité",
        reqXp: 2400,
        reqAptitude: 42,
        pcMax: 11,
        pa: 17,
        sauvegardes: { max: 7, mid: 4, min: 2 },
        attributsCasteMax: 22,
        bonusEquilibre: 5,
        avantages: [
          {
            nom: "Point de Personnage +1",
            description:
              "A certains rang le personnage reçoit simplement 1 point de personnage (PP) supplémentaire qu’il peut utiliser sur le champ ou plus tard pour acquérir de nouveaux traits.\nComme pour les PP lors de la création, le personnage n’est pas limité dans ses choix (sauf conditions d’acquisition).",
          },
          {
            nom: "Maîtrise de caste 6",
            description:
              "Cette valeur affecte 3 sujets : La connaissance, la réputation et la récupération de caste.\nRécupération de caste : utilisée pour augmenter la récupération des ressources associées à la caste (si la ressource est l’endurance, c’est la récupération de fatigue qui augmente).\nConnaissance de caste : défausse pour mesurer la connaissance propre à sa caste, remplaçant le modificateur compétence + groupe par la valeur correspondant au rang actuel (tests via Intelligence).\nRéputation de caste : défausse pour mesurer la réputation au sein de la caste.",
          },
        ],
      },
      {
        rang: 12,
        titre: "Sommité +",
        reqXp: 2800,
        reqAptitude: 47,
        pcMax: 12,
        pa: 18,
        sauvegardes: { max: 7, mid: 4, min: 2 },
        attributsCasteMax: 22,
        bonusEquilibre: 6,
        avantages: [
          {
            nom: "Groupes supérieurs",
            description:
              "Lorsqu’il acquiert cet avantage, le personnage peut désormais apprendre ses groupes jusqu’au rang 3.",
          },
          {
            nom: "Attributs supérieurs",
            description:
              "Lorsqu’il acquiert cet avantage, le personnage peut désormais monter tous ses attributs de base à 18.",
          },
        ],
      },
      {
        rang: 13,
        titre: "Epique",
        reqXp: 3200,
        reqAptitude: 51,
        pcMax: 13,
        pa: 19,
        sauvegardes: { max: 8, mid: 5, min: 3 },
        attributsCasteMax: 22,
        bonusEquilibre: 6,
        avantages: [
          {
            nom: "Point de Personnage +1",
            description:
              "A certains rang le personnage reçoit simplement 1 point de personnage (PP) supplémentaire qu’il peut utiliser sur le champ ou plus tard pour acquérir de nouveaux traits.\nComme pour les PP lors de la création, le personnage n’est pas limité dans ses choix (sauf conditions d’acquisition).",
          },
          {
            nom: "Maîtrise de caste 7",
            description:
              "Cette valeur affecte 3 sujets : La connaissance, la réputation et la récupération de caste.\nRécupération de caste : utilisée pour augmenter la récupération des ressources associées à la caste (si la ressource est l’endurance, c’est la récupération de fatigue qui augmente).\nConnaissance de caste : défausse pour mesurer la connaissance propre à sa caste, remplaçant le modificateur compétence + groupe par la valeur correspondant au rang actuel (tests via Intelligence).\nRéputation de caste : défausse pour mesurer la réputation au sein de la caste.",
          },
        ],
      },
      {
        rang: 14,
        titre: "Epique +",
        reqXp: 3600,
        reqAptitude: 57,
        pcMax: 14,
        pa: 20,
        sauvegardes: { max: 8, mid: 5, min: 3 },
        attributsCasteMax: 23,
        bonusEquilibre: 7,
        avantages: [
          {
            nom: "Multi Caste ou Caste Elite",
            description:
              "Lorsqu’il acquiert cet avantage, le personnage peut choisir un de ses traits de caste et en doubler les effets.\nSi le personnage ne souhaite pas améliorée un trait de caste ou si ses traits ne présentent pas d’avantage à être numériquement doublés, il peut à la place choisir d’obtenir un bonus de +2 à ses ressources de caste.",
          },
          {
            nom: "1ere Apothéose",
            description:
              "Lorsque le personnage atteint sa première apothéose, il reçoit un bonus de 1 à tous les jets effectués via les attributs de sa caste. L’endurance du personnage augmente de 2.\nA la seconde apothéose ce bonus augmente de 1 (total 2) et il peut relancer un test lié à un de ces attributs par jour. Son endurance augmente encore de 2 (total 4).\nA la troisième apothéose ce bonus augmente de 1 (total 3) et il peut relancer un test lié à un de ces attributs par scène. Son endurance augmente encore de 2 (total 6).\nA la dernière apothéose ce bonus augmente de 1 (total 4) et il peut relancer un test lié à un de ces attributs par tours. Son endurance augmente encore de 2 (total 8).",
          },
        ],
      },
      {
        rang: 15,
        titre: "Mythique",
        reqXp: 4000,
        reqAptitude: 63,
        pcMax: 15,
        pa: 21,
        sauvegardes: { max: 9, mid: 5, min: 3 },
        attributsCasteMax: 23,
        bonusEquilibre: 7,
        avantages: [
          {
            nom: "Point de Personnage +1",
            description:
              "A certains rang le personnage reçoit simplement 1 point de personnage (PP) supplémentaire qu’il peut utiliser sur le champ ou plus tard pour acquérir de nouveaux traits.\nComme pour les PP lors de la création, le personnage n’est pas limité dans ses choix (sauf conditions d’acquisition).",
          },
          {
            nom: "Maîtrise de caste 8",
            description:
              "Cette valeur affecte 3 sujets : La connaissance, la réputation et la récupération de caste.\nRécupération de caste : utilisée pour augmenter la récupération des ressources associées à la caste (si la ressource est l’endurance, c’est la récupération de fatigue qui augmente).\nConnaissance de caste : défausse pour mesurer la connaissance propre à sa caste, remplaçant le modificateur compétence + groupe par la valeur correspondant au rang actuel (tests via Intelligence).\nRéputation de caste : défausse pour mesurer la réputation au sein de la caste.",
          },
        ],
      },
      {
        rang: 16,
        titre: "Mythique +",
        reqXp: 4400,
        reqAptitude: 69,
        pcMax: 16,
        pa: 22,
        sauvegardes: { max: 9, mid: 6, min: 3 },
        attributsCasteMax: 23,
        bonusEquilibre: 8,
        avantages: [
          {
            nom: "Récupération Extrême (+2)",
            description: "La récupération du personnage est améliorée de X.",
          },
          {
            nom: "2eme Apothéose",
            description:
              "Lorsque le personnage atteint sa première apothéose, il reçoit un bonus de 1 à tous les jets effectués via les attributs de sa caste. L’endurance du personnage augmente de 2.\nA la seconde apothéose ce bonus augmente de 1 (total 2) et il peut relancer un test lié à un de ces attributs par jour. Son endurance augmente encore de 2 (total 4).\nA la troisième apothéose ce bonus augmente de 1 (total 3) et il peut relancer un test lié à un de ces attributs par scène. Son endurance augmente encore de 2 (total 6).\nA la dernière apothéose ce bonus augmente de 1 (total 4) et il peut relancer un test lié à un de ces attributs par tours. Son endurance augmente encore de 2 (total 8).",
          },
        ],
      },
      {
        rang: 17,
        titre: "Légende",
        reqXp: 4800,
        reqAptitude: 77,
        pcMax: 17,
        pa: 23,
        sauvegardes: { max: 10, mid: 6, min: 4 },
        attributsCasteMax: 24,
        bonusEquilibre: 8,
        avantages: [
          {
            nom: "Point de Personnage +1",
            description:
              "A certains rang le personnage reçoit simplement 1 point de personnage (PP) supplémentaire qu’il peut utiliser sur le champ ou plus tard pour acquérir de nouveaux traits.\nComme pour les PP lors de la création, le personnage n’est pas limité dans ses choix (sauf conditions d’acquisition).",
          },
          {
            nom: "Maîtrise de caste 9",
            description:
              "Cette valeur affecte 3 sujets : La connaissance, la réputation et la récupération de caste.\nRécupération de caste : utilisée pour augmenter la récupération des ressources associées à la caste (si la ressource est l’endurance, c’est la récupération de fatigue qui augmente).\nConnaissance de caste : défausse pour mesurer la connaissance propre à sa caste, remplaçant le modificateur compétence + groupe par la valeur correspondant au rang actuel (tests via Intelligence).\nRéputation de caste : défausse pour mesurer la réputation au sein de la caste.",
          },
        ],
      },
      {
        rang: 18,
        titre: "Légende +",
        reqXp: 5200,
        reqAptitude: 85,
        pcMax: 18,
        pa: 24,
        sauvegardes: { max: 10, mid: 6, min: 4 },
        attributsCasteMax: 24,
        bonusEquilibre: 9,
        avantages: [
          {
            nom: "Compétences extrêmes",
            description:
              "Lorsqu’il acquiert cet avantage, le personnage peut désormais apprendre ses compétences jusqu’au rang 6.",
          },
          {
            nom: "Multi Caste ou Caste Elite +",
            description:
              "Lorsqu’il acquiert cet avantage, le personnage peut choisir un de ses traits de caste et en doubler les effets.\nSi le personnage ne souhaite pas améliorée un trait de caste ou si ses traits ne présentent pas d’avantage à être numériquement doublés, il peut à la place choisir d’obtenir un bonus de +2 à ses ressources de caste.",
          },
          {
            nom: "3eme Apothéose",
            description:
              "Lorsque le personnage atteint sa première apothéose, il reçoit un bonus de 1 à tous les jets effectués via les attributs de sa caste. L’endurance du personnage augmente de 2.\nA la seconde apothéose ce bonus augmente de 1 (total 2) et il peut relancer un test lié à un de ces attributs par jour. Son endurance augmente encore de 2 (total 4).\nA la troisième apothéose ce bonus augmente de 1 (total 3) et il peut relancer un test lié à un de ces attributs par scène. Son endurance augmente encore de 2 (total 6).\nA la dernière apothéose ce bonus augmente de 1 (total 4) et il peut relancer un test lié à un de ces attributs par tours. Son endurance augmente encore de 2 (total 8).",
          },
        ],
      },
      {
        rang: 19,
        titre: "Divin",
        reqXp: 5600,
        reqAptitude: 95,
        pcMax: 19,
        pa: 25,
        sauvegardes: { max: 11, mid: 7, min: 4 },
        attributsCasteMax: 24,
        bonusEquilibre: 9,
        avantages: [
          {
            nom: "Point de Personnage +1",
            description:
              "A certains rang le personnage reçoit simplement 1 point de personnage (PP) supplémentaire qu’il peut utiliser sur le champ ou plus tard pour acquérir de nouveaux traits.\nComme pour les PP lors de la création, le personnage n’est pas limité dans ses choix (sauf conditions d’acquisition).",
          },
          {
            nom: "Maîtrise de caste 10",
            description:
              "Cette valeur affecte 3 sujets : La connaissance, la réputation et la récupération de caste.\nRécupération de caste : utilisée pour augmenter la récupération des ressources associées à la caste (si la ressource est l’endurance, c’est la récupération de fatigue qui augmente).\nConnaissance de caste : défausse pour mesurer la connaissance propre à sa caste, remplaçant le modificateur compétence + groupe par la valeur correspondant au rang actuel (tests via Intelligence).\nRéputation de caste : défausse pour mesurer la réputation au sein de la caste.",
          },
        ],
      },
      {
        rang: 20,
        titre: "Divin +",
        reqXp: 6000,
        reqAptitude: 105,
        pcMax: 20,
        pa: 26,
        sauvegardes: { max: 11, mid: 7, min: 4 },
        attributsCasteMax: 25,
        bonusEquilibre: 10,
        avantages: [
          {
            nom: "Groupes extrêmes",
            description:
              "Lorsqu’il acquiert cet avantage, le personnage peut désormais apprendre ses groupes jusqu’au rang 4.",
          },
          {
            nom: "Récupération Divine (+3)",
            description: "La récupération du personnage est améliorée de X.",
          },
          {
            nom: "Dernière Apothéose",
            description:
              "Lorsque le personnage atteint sa première apothéose, il reçoit un bonus de 1 à tous les jets effectués via les attributs de sa caste. L’endurance du personnage augmente de 2.\nA la seconde apothéose ce bonus augmente de 1 (total 2) et il peut relancer un test lié à un de ces attributs par jour. Son endurance augmente encore de 2 (total 4).\nA la troisième apothéose ce bonus augmente de 1 (total 3) et il peut relancer un test lié à un de ces attributs par scène. Son endurance augmente encore de 2 (total 6).\nA la dernière apothéose ce bonus augmente de 1 (total 4) et il peut relancer un test lié à un de ces attributs par tours. Son endurance augmente encore de 2 (total 8).",
          },
        ],
      },
    ];
  },
};

