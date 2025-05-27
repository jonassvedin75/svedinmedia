
import type { WorkshopFormStep } from "@/types";

export const brandWorkshopSteps: WorkshopFormStep[] = [
  // PASS 1: GRUNDERNA I VARUMÄRKESBYGGET
  {
    stepIdentifier: "pass1_q1",
    title: "Vad är ett varumärke - egentligen?",
    questions: [
      { id: "q1a", label: "Vad vill du att människor ska tänka, känna eller säga när ditt namn eller företag nämns?", type: "textarea", placeholder: "Dina tankar här..." },
      { id: "q1b", label: "Reflektera över vad ditt varumärke är idag. Vad signalerar du, medvetet eller omedvetet?", type: "textarea", placeholder: "Dina reflektioner..." },
    ],
  },
  {
    stepIdentifier: "pass1_q2",
    title: "Personlighet eller varumärke – eller båda?",
    questions: [
      { id: "q2a", label: "Vad är skillnaden mellan ditt företags varumärke och ditt personliga varumärke?", type: "textarea", placeholder: "Beskriv skillnaden..." },
      { id: "q2b", label: "Skriv ner tre ord du tror andra skulle använda för att beskriva dig. Vill du förstärka eller förändra dessa?", type: "textarea", placeholder: "Tre ord och din reflektion..." },
    ],
  },
  {
    stepIdentifier: "pass1_q3",
    title: "Utmaningar och möjligheter?",
    questions: [
      { id: "q3a", label: "Har du stött på normer, förväntningar eller föreställningar som gjort det svårare att bygga ditt varumärke som företagare?", type: "textarea", placeholder: "Beskriv dina erfarenheter..." },
    ],
  },
  // PASS 2: VARUMÄRKETS ESSENS
  {
    stepIdentifier: "pass2_q1",
    title: "Vad är din mission?",
    questions: [
      { id: "q1a", label: "Vad är din drivkraft, dina värderingar och din spetskompetens?", type: "textarea", placeholder: "Drivkraft, värderingar, spetskompetens..." },
      { id: "q1b", label: "Formulera din mission i en mening. Vad är du här för att förändra eller bidra med?", type: "textarea", placeholder: "Min mission är att..." },
    ],
  },
  {
    stepIdentifier: "pass2_q2",
    title: "Vilka är dina värderingar?",
    questions: [
      { id: "q2a", label: "Vilka tre värderingar är viktigast för dig? Hur syns de i ditt varumärke idag?", type: "textarea", placeholder: "Mina tre viktigaste värderingar och hur de syns..." },
    ],
  },
  {
    stepIdentifier: "pass2_q3",
    title: "Vad är din spetskompetens?",
    questions: [
      { id: "q3a", label: "Vad kan bara du erbjuda, tack vare din bakgrund, erfarenhet och inställning?", type: "textarea", placeholder: "Min unika spetskompetens..." },
    ],
  },
  {
    stepIdentifier: "pass2_q4",
    title: "Vad innebär positionering?",
    questions: [
      { id: "q4a", label: "Hur vill du att andra ska uppfatta dig om ett halvår? Sätt ord på känslan du vill förmedla.", type: "textarea", placeholder: "Önskad uppfattning och känsla..." },
    ],
  },
  // PASS 3: STRATEGI OCH KOMMUNIKATION
  {
    stepIdentifier: "pass3_q1",
    title: "Vilken är din målgrupp?",
    questions: [
      { id: "q1a", label: "Vilka målgrupper vänder du dig till – eller vill vända dig till framöver?", type: "textarea", placeholder: "Mina målgrupper..." },
      { id: "q1b", label: "Vad behöver målgruppen? Vilka problem löser du för dem?", type: "textarea", placeholder: "Målgruppens behov och mina lösningar..." },
      { id: "q1c", label: "Vad bryr sig din målgrupp om? Vilka värderingar är viktiga för dem?", type: "textarea", placeholder: "Målgruppens värderingar..." },
      { id: "q1d", label: "Hur beter de sig? Var finns de (digitala kanaler, fysiska platser etc.)?", type: "textarea", placeholder: "Målgruppens beteende och kanaler..." },
      { id: "q1e", label: "Vilket språk och vilken typ av tilltal använder och uppskattar din målgrupp?", type: "textarea", placeholder: "Språk och tilltal..." },
      { id: "q1f", label: "Hur kan du bygga starkare relationer och en känsla av gemenskap med din målgrupp?", type: "textarea", placeholder: "Bygga relationer och gemenskap..." },
      { id: "q1g", label: "Vad vill din idealkund ha och hur kan du och ditt erbjudande vara en del av lösningen för hen?", type: "textarea", placeholder: "Idealkundens önskemål och min lösning..." },
    ],
  },
  {
    stepIdentifier: "pass3_q2",
    title: "Vad är ditt budskap?",
    questions: [
      { id: "q2a", label: "Identifiera kärnan: Vad är det viktigaste du vill att människor ska förstå om dig och ditt företag?", type: "textarea", placeholder: "Kärnan i mitt budskap..." },
      { id: "q2b", label: "Tänk mottagare: Vad behöver målgruppen höra för att känna att du och ditt erbjudande är relevant för dem?", type: "textarea", placeholder: "Budskap anpassat till mottagaren..." },
      { id: "q2c", label: "Formulera med känsla: Vilken känsla vill du att ditt budskap ska förmedla?", type: "textarea", placeholder: "Känslan i budskapet..." },
      { id: "q2d", label: "Förenkla och fokusera: Hur kan du formulera ditt budskap med färre ord, utan att tappa dess kraft och tydlighet?", type: "textarea", placeholder: "Förenklat och fokuserat budskap..." },
      { id: "q2e", label: "Gör det minnesvärt: Vad i ditt budskap gör det särskilt minnesvärt och lätt för andra att återberätta?", type: "textarea", placeholder: "Göra budskapet minnesvärt..." },
      { id: "q2f", label: "Stäm av med verkligheten: På vilket sätt speglas ditt budskap i hur du och ditt företag faktiskt agerar och kommunicerar i vardagen?", type: "textarea", placeholder: "Budskapets förankring i verkligheten..." },
    ],
  },
  {
    stepIdentifier: "pass3_q3",
    title: "Vilken ton och känsla skapar du?",
    questions: [
      { id: "q3a", label: "Identifiera uttryck: Beskriv med tre ord hur tonen i din kommunikation känns just nu.", type: "textarea", placeholder: "Tre ord om nuvarande ton..." },
      { id: "q3b", label: "Tänk mottagare: Hur vill din målgrupp bli tilltalad?", type: "textarea", placeholder: "Målgruppens önskade tilltal..." },
      { id: "q3c", label: "Formulera känslan: Vilken känsla vill du att ditt varumärke ska väcka?", type: "textarea", placeholder: "Önskad känsla för varumärket..." },
      { id: "q3d", label: "Förenkla och förankra: Är tonen konsekvent i alla kanaler och känns den som du?", type: "textarea", placeholder: "Konsekvens och autenticitet i tonen..." },
      { id: "q3e", label: "Gör det mänskligt: Låter din kommunikation som en person eller som en funktion? Utveckla gärna.", type: "textarea", placeholder: "Mänsklig vs. funktionell kommunikation..." },
      { id: "q3f", label: "Skapa igenkänning: Hur vet någon att det är du och ditt varumärke, även om logotypen inte syns, baserat på din ton?", type: "textarea", placeholder: "Igenkänning via ton..." },
    ],
  },
  // UTVÄRDERING
  {
    stepIdentifier: "eval_q1",
    title: "Vad tar du med dig?",
    questions: [
      { id: "q1a", label: "Reflektera över dina viktigaste insikter och lärdomar från workshopen.", type: "textarea", placeholder: "Mina viktigaste insikter och lärdomar..." },
    ],
  },
  {
    stepIdentifier: "eval_q2",
    title: "Vad överraskade dig?",
    questions: [
      { id: "q2a", label: "Fanns det något under workshopen som var oväntat eller som utmanade dina tidigare tankar och perspektiv?", type: "textarea", placeholder: "Oväntade insikter eller utmaningar..." },
    ],
  },
  {
    stepIdentifier: "eval_q3",
    title: "Vad vill du utveckla vidare?",
    questions: [
      { id: "q3a", label: "Vilka specifika områden, idéer eller åtgärder känner du att du vill arbeta mer med och fördjupa dig i efter denna workshop?", type: "textarea", placeholder: "Områden för vidare utveckling..." },
    ],
  },
  // REVIEW AND SUBMIT
  {
    stepIdentifier: "review_submit",
    title: "Granska och Skicka",
    questions: [], // No direct questions, just text and a submit button
  },
];
