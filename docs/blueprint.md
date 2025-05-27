# **App Name**: Utvecklingsportalen

## Core Features:

- Firebase Konfiguration: Konfigurera Next.js-frontend för att initialisera Firebase korrekt med angivna konfigurationsvärden.
- Sidstruktur och URL-upplägg: Implementera grundläggande sidstruktur med Next.js App Router: Hemsida, Inloggning, Registrering, Mina Idéer (skyddad), Idé-detaljsida (skyddad), Inställningar (valfritt).
- Användarautentisering: Implementera användarautentisering (inloggning/registrering) med Firebase Authentication och skydda /my-ideas och undersidor.
- Idégenerering UI: Skapa ett tydligt input-fält för tema/problemformulering och en knapp för att generera idéer. Visa genererade idéer (initialt mock-data) på startsidan.
- AI-koppling (simulerad): Simulera AI-koppling för idégenerering. Visa en laddningsindikator och presentera 2-3 exempelidéer (hårdkodade) vid klick på knappen.
- Idévisning: Skapa en enkel listkomponent för att visa idéer (titel/kort sammanfattning). Visa en tom eller mock-databaserad lista på /my-ideas.
- Idésparande (lokal state): Lägg till en 'Spara'-knapp vid varje genererad idé. Spara idéer i en lokal state-variabel (React useState) för att simulera en personlig samling.
- Exportera Användarberättelser (platshållare): Lägg till en platshållarknapp 'Exportera Användarberättelser' på idés detaljsida. Ingen faktisk exportlogik i detta steg.

## Style Guidelines:

- Primärfärg: Djup indigo (#3F51B5) – använd för knappar, viktiga länkar, aktiva element.
- Bakgrundsfärg: Mycket ljus lavendel (#F0F2FA) – för huvudbakgrunder på sidor.
- Accentfärg: Ljus himmelsblå (#c2e7ff) – för mindre accenter, CTA-element, eller sekundära interaktiva element.
- Ren, lättläst sans-serif (t.ex. Roboto, Inter, eller systemets standard sans-serif).
- Enkla ikoner i konturstil (t.ex. från Material Symbols eller en liknande ikonuppsättning).
- Ren, modern och luftig med tydliga hierarkier. Fokusera på användbarhet och läsbarhet. Element och komponenter bör följa Google Material Design-principer