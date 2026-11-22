# DeputeDex

Exploration publique de l'activité de l'Assemblée nationale (députés, groupes, scrutins, travail législatif) à partir de l'open data de l'AN.

## Institutions

**Législature**:
La période pendant laquelle siège une même Assemblée nationale élue, cinq ans au plus ; elle s'achève plus tôt en cas de dissolution. Numérotée depuis 1958 (« 17ᵉ législature »).
_Avoid_: Mandature, session

**Gouvernement**:
L'équipe dirigée par un Premier ministre, du début à la fin de son mandat ; nommé d'après lui (« Gouvernement Borne »), numéroté quand un même Premier ministre en forme plusieurs d'affilée (« Lecornu I », « Lecornu II »). Plusieurs gouvernements peuvent se succéder pendant une législature.
_Avoid_: Cabinet, exécutif (pour un gouvernement précis)

**Rang gouvernemental**:
Le niveau d'un membre du Gouvernement : ministre d'État, ministre (dont le garde des Sceaux), ministre délégué, secrétaire d'État. Les parlementaires « en mission » auprès du Gouvernement n'en sont pas membres.
_Avoid_: Portefeuille (le ministère, absent des données)

**Bureau**:
L'organe qui dirige l'Assemblée : sa présidence, six vice-présidents, trois questeurs et douze secrétaires. Le président et les secrétaires « d'âge » n'en font partie que le temps de la séance d'installation.
_Avoid_: Conférence des présidents

## Travail législatif

**Dossier législatif**:
Le parcours complet d'une initiative au Parlement, de son dépôt à son issue (adoption, rejet, promulgation…). Les résolutions en sont aussi.
_Avoid_: Projet de loi (pour désigner le parcours), loi, dossier parlementaire

**Procédure**:
Le type d'un dossier législatif, fixé à son ouverture : loi ordinaire, loi de finances, loi constitutionnelle, résolution…
_Avoid_: Étape, type de texte

**Étape**:
Un moment du parcours d'un dossier législatif : lecture dans une assemblée, commission mixte paritaire, lecture définitive, Conseil constitutionnel, promulgation.
_Avoid_: Procédure, acte (pour l'usage courant)

**Texte**:
Un document sur lequel une assemblée délibère et qui peut être amendé, rattaché à une étape d'un dossier législatif. Les rapports, avis et études d'impact ne sont pas des textes.
_Avoid_: Document (pour un texte amendable), loi

**Projet de loi**:
Le texte initial d'un dossier législatif quand son auteur est le Gouvernement.
_Avoid_: Projet de loi pour désigner le dossier entier

**Proposition de loi**:
Le texte initial d'un dossier législatif quand son auteur est un parlementaire.
_Avoid_: PPL (hors abréviation assumée), proposition (seul)

**État d'avancement**:
La dernière étape atteinte par un dossier législatif et son issue : en discussion à l'AN, en discussion au Sénat, en commission mixte paritaire, adopté définitivement, promulgué, rejeté ou caduc.
_Avoid_: Statut, état (seul)

**Caduc**:
Se dit d'un dossier législatif qui n'a pas abouti avant la fin de la législature.

**Amendement**:
Proposition de modification d'un texte, déposée par un député (ou le Gouvernement, une commission).

## Scrutins et votes

**Scrutin**:
Une question mise aux voix de l'Assemblée : un amendement, un article, l'ensemble d'un texte, une motion de censure… Peut être ordinaire ou solennel.
_Avoid_: Vote (pour désigner la mise aux voix elle-même)

**Vote**:
La position d'un député sur un scrutin : pour, contre, abstention ou non-votant. Un vote n'est pas une contribution.
_Avoid_: Scrutin (pour la position d'un député)

**Résultat d'un scrutin**:
L'issue d'un seul scrutin : adopté ou rejeté. À ne pas confondre avec l'état d'avancement d'un dossier législatif : un amendement rejeté ne fait pas un dossier rejeté.
_Avoid_: Statut, état d'avancement (pour un scrutin)

**Position majoritaire d'un groupe**:
La position (pour, contre, abstention) adoptée par le plus grand nombre de membres d'un groupe sur un scrutin.

## Contributions d'un député

**Contribution**:
Un acte par lequel un député prend part à un dossier législatif : déposer un amendement, co-signer un amendement, être rapporteur, être auteur du texte ou co-signataire du texte. Un vote n'est pas une contribution.
_Avoid_: Participation, implication

**Auteur du texte**:
Le député (ou membre du Gouvernement) qui dépose le texte à l'origine d'un dossier législatif. Un seul par dossier en règle générale.
_Avoid_: Initiateur

**Co-signataire du texte**:
Un député qui signe le texte à l'origine d'un dossier législatif aux côtés de son auteur.

**Rapporteur**:
Un député chargé par une commission, à une étape donnée d'un dossier législatif, d'en examiner le texte et d'en rendre compte : au fond, pour avis, spécial ou général. C'est une contribution à une étape, pas à un texte.

**Législature d'une contribution**:
La législature pendant laquelle la contribution a eu lieu, indépendamment de celle où le dossier législatif a été ouvert.
