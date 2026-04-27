/**
 * AI Book Generator Service
 * Anropar backend-API:t /api/generate-book (Express + OpenAI server-side).
 * API-nyckeln hanteras enbart på servern — exponeras aldrig i klientkod.
 * Bilder: Placeholder (Picsum) — byt till DALL-E på serversidan för riktiga AI-bilder.
 */

// ── Bildplaceholder per format ────────────────────────────────────────────────
function placeholderImage(index, format) {
  const seed = (index + 1) * 13;
  if (format === "landscape") return `https://picsum.photos/seed/${seed}/900/560`;
  if (format === "digital")   return `https://picsum.photos/seed/${seed}/450/800`;
  return `https://picsum.photos/seed/${seed}/640/480`;
}

// ── Anrop till backend ────────────────────────────────────────────────────────
async function callBackend(formData, photoFile) {
  let body;
  let headers = {};

  if (photoFile) {
    // Skicka som multipart/form-data med bild
    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => fd.append(k, String(v)));
    fd.append("photo", photoFile, photoFile.name);
    body = fd;
    // Låt webbläsaren sätta Content-Type med boundary
  } else {
    // Ingen bild — skicka som JSON
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(formData);
  }

  const apiBase = import.meta.env.VITE_API_URL || "";
  const res = await fetch(`${apiBase}/api/generate-book`, {
    method: "POST",
    headers,
    body,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Serverfel: ${res.status}`);
  }

  return res.json();
}

// ── Mock-bok för demo/dev utan API-nyckel ─────────────────────────────────────
function buildMockBook(fd) {
  const name = fd.personName || "Hjälten";
  const count = fd.previewOnly ? 4 : (Number(fd.pageCount) || 15);

  const texts = [
    `Det var en gång ${name} som bodde i en liten by vid kanten av den stora skogen. Varje kväll satt ${name} vid fönstret och drömde om äventyr.`,
    `En morgon hittade ${name} ett brev under dörrmattan. Brevet var förslutet med ett rött lacksigill och bara ett ord stod på kuvertet: "Kom."`,
    `${name} packade ryggsäcken med en karta, ett äpple och ett litet ljus. Med klappande hjärta öppnade ${name} skogens gröna port.`,
    `Snart mötte ${name} en liten räv med blå ögon. "Jag känner till alla stigar," sa räven. "Följ mig — men lita på ditt hjärta."`,
    `De vandrade länge tills träden tätnade och solen knappt nådde marken. Luften doftade av mossa och hemligheter.`,
    `Plötsligt öppnade sig skogen och avslöjade en glittrande sjö. Mitt ute på sjön låg en ö med ett gammalt torn av vit sten.`,
    `"Vi måste ta oss dit," sa ${name} bestämt. Räven log och pekade på en rad stepping-stones som stack upp ur det blå vattnet.`,
    `Sten för sten balanserade ${name} sig fram. Vattnet sjöng och silverfjärilar dansade runt deras axlar.`,
    `I tornets inre väntade ett rum fyllt med glödande böcker och kartor som rörde sig av sig själva. ${name} kände en varm stråle i bröstet.`,
    `"Det är kunskapens rum," viskade räven. "Bara den som söker med öppet hjärta kan hitta hit."`,
    `${name} förstod att äventyret inte handlade om guld eller ädelstenar — utan om modet att tro på det egna hjärtat.`,
    `Med en ny karta i handen och räven vid sidan vände ${name} hemåt. Skogen sjöng en avsångssång bland löven.`,
    `Hemma berättade ${name} om tornet, räven och de rörliga kartorna. Alla lyssnade med vidöppna ögon.`,
    `Från den dagen visste ${name} att varje dag kan gömma ett nytt äventyr — om man bara vågar öppna dörren.`,
    `Och ${name} levde nyfiket och modigt, alltid redo att följa nästa brev under dörrmattan. Slut. ✨`,
  ];

  const pages = Array.from({ length: count }, (_, i) => ({
    pageNumber: i + 1,
    text: texts[i % texts.length],
    imagePrompt: `Storybook illustration page ${i + 1}: ${name} in a magical adventure, ${fd.storyIdea || "enchanted forest"}. Warm colors, friendly, child-friendly art style.`,
    imageUrl: placeholderImage(i, fd.bookFormat),
  }));

  return {
    title: `${name}s Stora Äventyr`,
    format: fd.bookFormat || "classic",
    coverImage: placeholderImage(99, fd.bookFormat),
    pages,
  };
}

// ── Hjälp: kontrollera om backend svarar ────────────────────────────────────
async function isBackendAvailable() {
  try {
    const health = await fetch("/api/health");
    return health.ok;
  } catch {
    return false;
  }
}


// ── Generera hela boken ────────────────────────────────────────────────────
export async function generateBookWithAI(formData, photoFile = null) {
  if (!(await isBackendAvailable())) {
    await new Promise((r) => setTimeout(r, 2000));
    return buildMockBook(formData);
  }
  return callBackend(formData, photoFile);
}
