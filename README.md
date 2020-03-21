## Praktik opgave newsbox!
I denne praktikperiode skal I udvikle en nyheds webapplikation som er optimeret til den mobile skærm. I applikationen skal der listes nyheder fra DR.dk i et kategoriseret nyhedsoverblik. Det skal være muligt at vælge(klikke på) en nyhed i liste, for at se denne i sin fulde længde og herfra gemme den aktuelle nyhedsartikkel i et privat nyhedskartotek. Fra et settings-panel skal brugeren have mulighed for at administrere det kategoriseret nyhedsoverblik ved at slå visning til og fra på udvalgte nyhedskategorier.


**Målet med opgaven er:**<br>
At få arbejdet med et CSS framework og gjort sig nogen erfaring med et sådanne i et praktisk projekt.
At få erfaring med data konvertering så I kan præsentere data fra tredjepart services som ikke leverer data i XML format.
At arbejde med lagring af indstillinger og data.


**Udfordringen er:**<br>
Det er selvfølgelig en udfordring at vi ikke på samme måde som normalt har mulighed for vejledning på skolen. Jeg har derfor
lavet en "sådan hjælper du andre og sådan kan du spørge om hjælp" liste. 
Du finder listen  i slutningen af opgavebeskrivelsen.

## Opgavebeskrivelse

**User Interface:**<br>
Se XD fil i mappen projekt-UI.
#### Oblikatorisk opgaver:
1. Tidsestimering (projekt backlog)
2. Datakonvertering

   DR's nyhedsdata kommer i [XML](https://developer.mozilla.org/en-US/docs/Glossary/XML) format. Det er derfor nødvendigt at      få konvateret data fra XML- til JSON format.

   Her er lidt ressourcer som kan hjælpe jer:
      https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
      https://dev.to/niinpatel/converting-xml-to-json-using-recursion-2k4j
   
3. Animationer

   En nyhedskategori kan være "åben", så de relaterede artikler fremgår af en liste herunder. En nyhedskategori kan også være    "lukket", sådan at det kun er nyhedskategorien som fremgår af listen men ikke de relaterede artiker. Det er din opgave at    animere overgangen mellem "åben" / "lukket" tilstand på en lækker måde.
 
   I settingspanelt kan man "tænde og slukke" for nyhedskategorier. Det er din opgave at animere kontakternes overgang fra        "tænt" til "slukket".
 
4. CSS Framework
5. Deploy in netlify
6. Nyhedskategorier (Ryk op ned i settings)

**Ekstra opgaver:**
Søgefunktion

**Animationer** <br>
Listevisning (toggle)
On/Off Switches 


**CSS Framework** <br>
Du skal udvikle applikationens UI med Tailwind CSS

**Product backlog:** <br>
tidsestimering


**Tip:**<br>
Opret en fil hvor du kan ekspermantere med at konvertere data fra XML til JSON. Når du har fået tingende til at virke i det sikre sandbox miljø, er du klar til at implementere løsningen i applikationen.
datakonvertering

## Ekstra opgaver
1. Tilføj Swipe-down to refresh på nyhedsliste:
    [se illustraion](https://github.com/rts-cmk-opgaver/praktik-projekt-newsbox/blob/master/assets/pull-to-refresh-823x1024.png "swipe-down")
2. Feature med tutorial første gang appen bruges: [se illustration](https://github.com/rts-cmk-opgaver/praktik-projekt-newsbox/blob/master/assets/tutorial.png "tutorial")


## Se her hvis du får brug for hjælp
**StackOverflow:**<br>
På 'stacken' har I mulighed for at hjælpe eller få hjælpe fra hinanden og skolens undervisere.
https://stackoverflow.com/c/rts-cmk/questions

Det er et **krav** at i bruger *"Hvordan stiller jeg et godt spørgsmål?"* som guide for udformning af jeres spørgsmål.
https://stackoverflow.com/help/how-to-ask

**Teams:**<br>
I kan også holde møder på Skype for business, hvis i skal diskutere en problemstilling. I kan dele jeres skærm og i kan sågar fjernstyre hinandens maskiner, hvis det er nødvendigt at hjælpe med for eksempel debugging.
https://teams.microsoft.com/l/channel/19%3a1b3dcaedd4b44f3b9a84e6b19377f71e%40thread.tacv2/Generel?groupId=856d6686-7cf1-44f0-a45b-e96706667d75&tenantId=b99bf9e9-f5ba-4922-9c48-3b1458bd8136

**Live share:**<br>
Denne VSCode extensions giver jer ligeledes mulighed for at dele udviklingsmiljø med hinanden.
