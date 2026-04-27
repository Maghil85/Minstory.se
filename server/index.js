import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import multer from "multer";
import FormDataNode from "form-data";
import { rateLimit } from "express-rate-limit";
import { uploadFromUrl, uploadFromBase64 } from "./uploadToStorage.js";
import { getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { Resend } from "resend";

// ── E-post via Resend ─────────────────────────────────────────────────────────
async function sendOrderConfirmation({ to, customerName, bookTitle, printOption, totalPrice }) {
  if (!process.env.RESEND_API_KEY || !to) return;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const printLabel = printOption === "hard" ? "Inbunden bok (hårdpärm)" : "Häftad bok (mjukpärm)";
  const priceStr = `${totalPrice} kr`;

  await resend.emails.send({
    from: "Minstory <kontakt@minstory.se>",
    to,
    subject: `Orderbekräftelse – ${bookTitle || "Din bok"}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#222">
        <h2 style="color:#7c3aed">Tack för din beställning, ${customerName || ""}! 🎉</h2>
        <p>Vi har tagit emot din beställning och påbörjar trycket av din bok.</p>
        <table style="width:100%;border-collapse:collapse;margin:24px 0">
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666">Boktitel</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:bold">${bookTitle || "–"}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666">Tryckalternativ</td><td style="padding:8px 0;border-bottom:1px solid #eee">${printLabel}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Totalt</td><td style="padding:8px 0;font-weight:bold;color:#7c3aed">${priceStr}</td></tr>
        </table>
        <p style="color:#555">Leveranstid är ca 7–14 arbetsdagar. Har du frågor? Kontakta oss på <a href="mailto:kontakt@minstory.se">kontakt@minstory.se</a>.</p>
        <p style="margin-top:32px;color:#999;font-size:12px">Minstory.se – personliga barnböcker</p>
      </div>
    `,
  });
}

// Returnerar Firestore-instans för den namngivna databasen "default"
function getDb() {
  const apps = getApps();
  return apps.length ? getFirestore(apps[0], "default") : null;
}

const app = express();
const PORT = process.env.PORT || 3001;

// Railway och andra reverse proxies sätter X-Forwarded-For — behövs för rate limiting
app.set("trust proxy", 1);

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Tillåt requests utan origin (t.ex. server-till-server, curl)
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      callback(new Error(`CORS blockerad för origin: ${origin}`));
    },
  })
);

// ── Rate limiting ─────────────────────────────────────────────────────────────
// Bokgenerering: max 5 böcker per IP och 15 minuter (skyddar OpenAI-kostnad)
const generateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "För många bokgenereringar. Vänta lite och försök igen." },
});

// Övriga API-anrop: max 60 per minut
const generalLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "För många förfrågningar. Vänta lite och försök igen." },
});

app.use("/api/generate-book", generateLimit);
app.use("/api/", generalLimit);

// Lazy-initialiserad — kastar inte fel vid saknad API-nyckel vid uppstart
let _openai = null;
function getOpenAI() {
  if (_openai) return _openai;
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY saknas. Lägg till den i Railway Variables.");
  }
  _openai = new OpenAI({
    apiKey:  process.env.OPENAI_API_KEY,
    project: process.env.OPENAI_PROJECT_ID,
  });
  return _openai;
}

// ── Multer: minne, max 8 MB, enbart bilder ───────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Endast bildfiler (jpg/png/webp) är tillåtna."));
  },
});

// ── Format-beskrivningar ──────────────────────────────────────────────────────
const FORMAT_DESCRIPTIONS = {
  classic:   "klassisk barnbok med stående sidor",
  landscape: "filmisk bilderbok med liggande, panoramaliknande sidor",
  digital:   "digital animerad bok optimerad för mobil och skärm",
  comic:     "serietidning med paneler, pratbubblor och action",
};

// ── Format-specifik bildstil och aspektratio ─────────────────────────────────
const FORMAT_IMAGE_STYLE = {
  classic: {
    stylePrefix:  "Children's storybook watercolor illustration, soft warm tones, cozy portrait composition, gentle lighting",
    negPrompt:    "photorealistic, photograph, comic panels, harsh lines, dark, scary",
    aspect:       "2:3",   // stående
  },
  landscape: {
    stylePrefix:  "Cinematic children's book illustration, wide panoramic scene, sweeping horizontal composition, rich environment, 16:9 landscape",
    negPrompt:    "portrait orientation, vertical composition, photorealistic, dark",
    aspect:       "16:9",
  },
  digital: {
    stylePrefix:  "Vibrant digital children's app illustration, bold flat colors, clean modern style, vertical 9:16 mobile composition",
    negPrompt:    "horizontal landscape, photorealistic, muted colors, dark",
    aspect:       "9:16",
  },
  comic: {
    stylePrefix:  "Comic book panel art, bold thick ink outlines, halftone dot pattern, dynamic action angle, graphic novel style for children, high contrast cel shading, blank speech bubble integrated in scene with no text inside",
    negPrompt:    "watercolor, painterly, soft, photorealistic, photograph, blurry, text inside speech bubble",
    aspect:       "2:3",   // stående panel
  },
};

const FORMAT_TEXT_INSTRUCTIONS = {
  classic:   "Skriv 2–4 meningar per sida i berättarröst, varmt och poetiskt.",
  landscape: "Skriv 2–3 meningar per sida med fokus på miljö och rörelse, filmiskt.",
  digital:   "Skriv 1–3 korta meningar per sida, lätta att läsa på mobilskärm.",
  comic:     "Skriv 1–3 korta, energiska meningar per sida. Använd gärna dialog och utrop. Texten ska passa en seriebubbla eller caption-ruta.",
};

// ── Berättelsestruktur per format (för buildPrompt) ───────────────────────────
const FORMAT_STORY_STRUCTURE = {
  classic:   "Bygg en sammanhängande berättelse med tydlig inledning, mitt och slut. Varje sida för berättelsen framåt naturligt och poetiskt.",
  landscape: "Fokusera på miljöer, resor och äventyr i det stora formatet. Varje sida beskriver en ny miljö eller ett steg i äventyret. Stämningsfullt, filmiskt.",
  digital:   "Berättelsen ska vara snabbpacead och engagerande. Varje sida har en tydlig känsla eller händelse. Kort och slagkraftigt för mobilläsning.",
  comic:     "Berättelsen MÅSTE kännas som en riktig serietidning. Bygg varje sida som ett eget dramatiskt ögonblick med dialog (t.ex. '– Håll kvar! skrek Max.'). Inkludera aktiva verb, spänning och gärna ljudmaleriska ord (t.ex. 'PANG!', 'WOOSH!', 'HA HA!'). Varje sida ska ha en mini-konflikt, reaktion eller cliffhanger som drar läsaren vidare. Karaktärerna pratar och agerar – de sitter INTE bara still.",
};

const FORMAT_IMAGE_INSTRUCTIONS = {
  classic:   "Detailed English prompt for a warm watercolor children's book illustration in portrait orientation. Include setting, characters, mood, lighting.",
  landscape: "Detailed English prompt for a wide cinematic panoramic scene in 16:9 landscape orientation. Emphasize environment, depth, horizon.",
  digital:   "Detailed English prompt for a bold, vibrant digital illustration in vertical 9:16 mobile orientation. Focus on close-up character moments.",
  comic:     "Detailed English prompt for a comic book panel with bold ink outlines, dynamic action angle, expressive character. Include a large blank speech bubble (no text inside, just the outline/shape) coming from the main character, positioned in the upper area so it looks natural in a comic panel. Add action lines or energy effects if appropriate.",
};

function buildPrompt(fd) {
  const fmt = fd.bookFormat || "classic";
  const age = parseInt(fd.personAge, 10);
  const ageInstruction = age <= 4
    ? "Barnet är väldigt litet. Använd KORTA, ENKLA meningar med lätta ord. Max 1–2 meningar per sida."
    : age <= 7
    ? "Använd enkla, tydliga meningar. Ord som ett litet barn förstår. Gärna lite rim eller upprepning."
    : age <= 10
    ? "Använd ett flödande, lite mer beskrivande språk med varierade meningar. Fortfarande barnvänligt."
    : "Använd ett mer nyanserat och rikt språk. Längre meningar är okej. Engagerande och bildligt.";

  const comicSwedishNote = fmt === "comic"
    ? "\nCOMIC EXTRA VIKTIGT: All dialog och alla utrop MÅSTE vara på svenska. Skriv t.ex. 'Häftigt!', 'Spring!', 'Stopp!', 'Vad händer?' — ALDRIG 'Wow!', 'OMG!', 'Run!' eller andra engelska utrop."
    : "";

  return `Du är en kreativ svensk barnboksförfattare. Skapa en komplett bok baserad på:

Huvudperson: ${fd.personName}${fd.personAge ? `, ${fd.personAge} år` : ""}
Relation till beställaren: ${fd.relation || "okänt"}
Beskrivning av personen: ${fd.description || "—"}
Berättelsens tema / idé: ${fd.storyIdea || "ett magiskt äventyr"}
Bokstil / genre: ${fd.bookStyle === "__custom__" ? fd.customBookStyle : (fd.bookStyle || "äventyr")}
Bokformat: ${FORMAT_DESCRIPTIONS[fmt] || "klassisk bok"}
Antal sidor: ${fd.pageCount}

SPRÅK — ABSOLUT KRAV:
- All text i boken (titlar, sidtext, baksidetext) MÅSTE vara på svenska.
- Skriv naturlig, flytande svenska som passar barn.
- Skriv ALDRIG någon del av berättelsen på engelska.
- Bildprompts (imagePrompt) ska däremot vara på engelska — de visas inte för läsaren.${comicSwedishNote}

ÅLDERSANPASSNING: ${ageInstruction}

Berättelsestruktur: ${FORMAT_STORY_STRUCTURE[fmt] || FORMAT_STORY_STRUCTURE.classic}
Instruktioner för text per sida: ${FORMAT_TEXT_INSTRUCTIONS[fmt] || FORMAT_TEXT_INSTRUCTIONS.classic}

Returnera ENBART ett JSON-objekt (utan markdown eller extra text) med exakt denna struktur:
{
  "title": "Bokens titel (på svenska)",
  "coverDescription": "Kort beskrivning av omslagets motiv (på engelska, för AI-bildgenerering)",
  "backCoverText": "En inbjudande baksidesstext (2–3 meningar på svenska, som på en riktig boks baksida — väck nyfikenhet utan att avslöja slutet)",
  "pages": [
    {
      "pageNumber": 1,
      "text": "Sidans text på svenska",
      "imagePrompt": "${FORMAT_IMAGE_INSTRUCTIONS[fmt] || FORMAT_IMAGE_INSTRUCTIONS.classic}"
    }
  ]
}

Skapa exakt ${fd.pageCount} sidor. Berättelsen ska vara engagerande, sammanhängande och på svenska.`;
}

function placeholderImage(index, format) {
  const seed = (index + 1) * 13;
  if (format === "landscape") return `https://picsum.photos/seed/${seed}/900/560`;
  if (format === "digital")   return `https://picsum.photos/seed/${seed}/450/800`;
  return `https://picsum.photos/seed/${seed}/640/480`;
}

// ── GPT-4o Vision: analysera kundernas foto ───────────────────────────────────
async function analysePhoto(imageBuffer, mimeType) {
  const base64 = imageBuffer.toString("base64");
  const resp = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [{
      role: "user",
      content: [
        {
          type: "text",
          text: "Describe this person in detail for consistent children's book illustrations. Include: approximate age, hair color and style, eye color, skin tone, build, and any distinctive features or typical clothing. Be specific and concise, in English. This description will be appended to every image generation prompt.",
        },
        {
          type: "image_url",
          image_url: { url: `data:${mimeType};base64,${base64}`, detail: "high" },
        },
      ],
    }],
    max_tokens: 250,
  });
  return resp.choices[0].message.content.trim();
}

// ── Stability AI Style Guide (/v2beta/stable-image/control/style, 5 credits) ──
// Använder kundens foto som stilreferens för konsekvent karaktärsutseende.
async function stableImageStyleGuide(styleImageBuffer, mimeType, prompt, format = "classic") {
  if (!process.env.STABILITY_API_KEY) {
    throw new Error("STABILITY_API_KEY saknas på servern.");
  }

  const fmtStyle = FORMAT_IMAGE_STYLE[format] || FORMAT_IMAGE_STYLE.classic;

  const form = new FormDataNode();
  form.append("image", styleImageBuffer, { filename: "photo.jpg", contentType: mimeType });
  form.append("prompt", `${fmtStyle.stylePrefix}, highly detailed. ${prompt}`);
  form.append("negative_prompt", `${fmtStyle.negPrompt}, ugly, blurry, nsfw, watermark, text, low quality`);
  form.append("fidelity", "0.5");
  form.append("aspect_ratio", fmtStyle.aspect);
  form.append("output_format", "png");

  const resp = await fetch(
    "https://api.stability.ai/v2beta/stable-image/control/style",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
        Accept: "application/json",
        ...form.getHeaders(),
      },
      body: form,
    }
  );

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.message || `Stability AI Style Guide-fel: ${resp.status}`);
  }

  const data = await resp.json();
  // v2beta control-endpoints returnerar { image: "base64..." }
  // Ladda upp till Firebase Storage för permanent URL (undviker Firestore-storleksgräns)
  const base64DataUrl = `data:image/png;base64,${data.image}`;
  return uploadFromBase64(base64DataUrl);
}

// ── DALL-E 3 (används när ingen bild laddas upp) ──────────────────────────────
const dalleSize = (fmt) => {
  if (fmt === "landscape") return "1792x1024";
  if (fmt === "digital")   return "1024x1792";
  return "1024x1024";
};

async function generateImageDalle(prompt, format, fallbackIndex) {
  const fmtStyle = FORMAT_IMAGE_STYLE[format] || FORMAT_IMAGE_STYLE.classic;
  try {
    const resp = await getOpenAI().images.generate({
      model: "dall-e-3",
      prompt: `${fmtStyle.stylePrefix}. ${prompt}`,
      n: 1,
      size: dalleSize(format),
      quality: "standard",
    });
    const tempUrl = resp.data[0].url;
    // Ladda ned och ladda upp till Firebase Storage för permanent URL
    // (DALL-E URLs löper ut efter ~1 timme)
    const permanentUrl = await uploadFromUrl(tempUrl, format);
    return permanentUrl;
  } catch (imgErr) {
    console.warn(`[dalle] Bild misslyckades (${fallbackIndex}):`, imgErr?.message ?? imgErr);
    return placeholderImage(fallbackIndex, format);
  }
}

// ── GPT-4o Vision: kontrollera att text matchar bild, justera vid behov ───────
async function refinePageText(imageUrl, originalText, pageNumber) {
  // Hoppa över platshållarbilder (picsum.photos)
  if (!imageUrl || imageUrl.includes("picsum.photos")) return originalText;
  try {
    const resp = await getOpenAI().chat.completions.create({
      model: "gpt-4o",
      messages: [{
        role: "user",
        content: [
          {
            type: "text",
            text: `Du hjälper till med en svensk barnbok. Här är texten för sida ${pageNumber}:\n\n"${originalText}"\n\nTitta på illustrationen. Om texten och bilden matchar bra, returnera texten oförändrad. Om de inte matchar riktigt, returnera en lätt justerad text som bättre beskriver vad som visas på bilden.\n\nVIKTIGT:\n- Returnera ALLTID texten på svenska, oavsett vad bilden visar.\n- Behåll samma längd, ton och berättarperspektiv som originaltexten.\n- Returnera ENBART texten, utan citattecken eller förklaring.`,
          },
          { type: "image_url", image_url: { url: imageUrl, detail: "low" } },
        ],
      }],
      max_tokens: 250,
    });
    const refined = resp.choices[0].message.content.trim();
    return refined || originalText;
  } catch (err) {
    console.warn(`[refine] Sida ${pageNumber} – behöll originaltext:`, err.message);
    return originalText;
  }
}

// ── POST /api/generate-book ───────────────────────────────────────────────────
// Accepterar multipart/form-data (med valfri "photo"-fil) ELLER JSON
app.post("/api/generate-book", upload.single("photo"), async (req, res) => {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY är inte konfigurerad på servern." });
  }

  const raw_body = req.body;

  if (!raw_body || !raw_body.personName || !raw_body.pageCount) {
    return res.status(400).json({ error: "Obligatoriska fält saknas: personName, pageCount." });
  }

  const effectivePageCount = Number(raw_body.pageCount);
  const formData = { ...raw_body, pageCount: effectivePageCount };
  const photoFile = req.file ?? null; // { buffer, mimetype } om uppladdad

  try {

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Du är en kreativ svensk bokförfattare. Returnera alltid valid JSON utan extra text.",
        },
        { role: "user", content: buildPrompt(formData) },
      ],
      temperature: 0.85,
      response_format: { type: "json_object" },
    });

    const raw = JSON.parse(completion.choices[0].message.content);
    const rawPages = raw.pages || [];

    // ── Om foto är uppladdad: analysera med GPT-4o Vision ────────────────────
    let characterDesc = null;
    if (photoFile) {
      console.log("[photo] Analyserar kundbilder med GPT-4o Vision...");
      characterDesc = await analysePhoto(photoFile.buffer, photoFile.mimetype);
      console.log("[photo] Karaktärsbeskrivning:", characterDesc);
    }

    // ── Bildgenerering: SD img2img (med foto) eller DALL-E 3 (utan foto) ──────
    async function generateImage(prompt, format, fallbackIndex) {
      const fullPrompt = characterDesc
        ? `${prompt}. Character description for consistency: ${characterDesc}`
        : prompt;

      if (photoFile && process.env.STABILITY_API_KEY) {
        try {
          return await stableImageStyleGuide(photoFile.buffer, photoFile.mimetype, fullPrompt, format);
        } catch (sdErr) {
          console.warn(`[stability] Style Guide misslyckades, faller tillbaka till DALL-E:`, sdErr.message);
        }
      }
      return generateImageDalle(fullPrompt, format, fallbackIndex);
    }

    // Generera omslagsbild + alla sidobjekt parallellt
    const [coverImage, ...pageImages] = await Promise.all([
      generateImage(
        raw.coverDescription || `Cover for a book titled "${raw.title || "Min bok"}"`,
        formData.bookFormat,
        99
      ),
      ...rawPages.map((p, i) =>
        generateImage(p.imagePrompt || `Page ${i + 1} illustration`, formData.bookFormat, i)
      ),
    ]);

    const pages = rawPages.map((p, i) => ({
      pageNumber: p.pageNumber ?? i + 1,
      text: p.text ?? "",
      imagePrompt: p.imagePrompt ?? "",
      imageUrl: pageImages[i],
    }));

    // ── Text-finjustering: GPT-4o Vision kontrollerar text↔bild-matchning ────
    // Körs i batchar om 5 för att undvika rate limits vid långa böcker (20-24 sidor).
    console.log(`[refine] Finjusterar ${pages.length} sidtexter i batchar...`);
    const REFINE_BATCH = 5;
    const refinedTexts = [];
    for (let bi = 0; bi < pages.length; bi += REFINE_BATCH) {
      const batch = pages.slice(bi, bi + REFINE_BATCH);
      const batchResults = await Promise.all(
        batch.map((p) => refinePageText(p.imageUrl, p.text, p.pageNumber))
      );
      refinedTexts.push(...batchResults);
    }
    const refinedPages = pages.map((p, i) => ({ ...p, text: refinedTexts[i] }));

    const book = {
      title: raw.title || "Min bok",
      format: formData.bookFormat || "classic",
      coverImage,
      backCoverText: raw.backCoverText || "",
      pages: refinedPages,
    };

    return res.json(book);
  } catch (err) {
    console.error("[generate-book]", err);
    const message = err?.error?.message || err?.message || "Okänt fel vid AI-generering.";
    return res.status(502).json({ error: message });
  }
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// ── POST /api/order-print ─────────────────────────────────────────────────────
// Tar emot beställning av tryckt bok (tillval efter AI-generering).
app.post("/api/order-print", express.json(), async (req, res) => {
  const { book, printOption, totalPrice, customerEmail, customerName } = req.body || {};

  if (!book || !printOption || !totalPrice) {
    return res.status(400).json({ error: "book, printOption och totalPrice krävs." });
  }
  if (!["soft", "hard"].includes(printOption)) {
    return res.status(400).json({ error: "Ogiltigt printOption." });
  }

  try {
    const db = getDb();
    if (db) {
      await db.collection("printOrders").add({
        orderId: book.orderId || null,
        bookTitle: book.title || null,
        bookFormat: book.format || null,
        printOption,
        totalPrice: Number(totalPrice),
        customerEmail: customerEmail || null,
        customerName: customerName || null,
        status: "pending",
        createdAt: FieldValue.serverTimestamp(),
      });
    }
  } catch (err) {
    console.error("[order-print] Firestore error:", err.message);
    // Loggar felet men returnerar ändå success till klienten
  }

  // Skicka orderbekräftelse till kunden
  try {
    await sendOrderConfirmation({
      to: customerEmail,
      customerName,
      bookTitle: book.title,
      printOption,
      totalPrice,
    });
  } catch (err) {
    console.error("[order-print] E-post fel:", err.message);
    // Skickar inte fel till klienten om e-post misslyckas
  }

  console.log("[order-print]", {
    title: book.title,
    pages: book.pages,
    format: book.format,
    printOption,
    totalPrice,
    customerEmail,
    receivedAt: new Date().toISOString(),
  });

  return res.json({ success: true, message: "Order mottagen" });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", ts: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Minstory backend körs på http://localhost:${PORT}`);
});
