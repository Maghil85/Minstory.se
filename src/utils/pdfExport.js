const FORMAT_LABELS = {
  classic:   "Klassisk bok",
  landscape: "Liggande bok",
  digital:   "Digital bok",
  comic:     "Seriebok",
};

// ── PDF-dimensioner per format ────────────────────────────────────────────────
const FORMAT_OPTIONS = {
  classic:   { orientation: "portrait",  w: 559, h: 744, pdfFormat: "a5" },   // A5 stående
  landscape: { orientation: "landscape", w: 794, h: 560, pdfFormat: "a5" },   // A5 liggande
  digital:   { orientation: "portrait",  w: 400, h: 710, pdfFormat: [70, 125] }, // mobilratio
  comic:     { orientation: "portrait",  w: 559, h: 744, pdfFormat: "a5" },   // A5 stående
};

function buildCoverHTML(book, w, h) {
  const isLandscape = book.format === "landscape";
  const titleSize   = isLandscape ? 32 : 42;
  const padBottom   = isLandscape ? 36 : 52;
  const gradH       = Math.round(h * 0.58);
  return `
    <div style="width:${w}px;height:${h}px;background:#111;position:relative;overflow:hidden;box-sizing:border-box;">
      ${book.coverImage
        ? `<img src="${book.coverImage}" crossorigin="anonymous"
            style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;"/>`
        : `<div style="position:absolute;top:0;left:0;width:100%;height:100%;
            background:linear-gradient(135deg,#F59E0B,#8B5E00);
            display:flex;align-items:center;justify-content:center;font-size:80px;">📖</div>`}
      <div style="position:absolute;bottom:0;left:0;right:0;height:${gradH}px;
        background:linear-gradient(transparent,rgba(0,0,0,0.82) 50%,rgba(0,0,0,0.97));"></div>
      <div style="position:absolute;bottom:0;left:0;right:0;padding:${padBottom}px;
        text-align:center;box-sizing:border-box;">
        <h1 style="color:#fff;font-size:${titleSize}px;font-weight:900;margin:0 0 14px;
          font-family:Georgia,serif;text-shadow:0 2px 16px rgba(0,0,0,0.7);line-height:1.2;">${book.title}</h1>
        <div style="width:40px;height:2px;background:#F59E0B;border-radius:1px;margin:0 auto 12px;"></div>
        <p style="color:rgba(255,255,255,0.65);font-size:12px;margin:0;letter-spacing:0.8px;
          text-transform:uppercase;font-family:sans-serif;">
          ${FORMAT_LABELS[book.format] || ""} &nbsp;·&nbsp; ${book.pages.length} sidor
        </p>
      </div>
    </div>`;
}

function buildClassicPageHTML(page, w, h) {
  const imgH = Math.round(h * 0.60);
  return `
    <div style="width:${w}px;height:${h}px;background:#FEFCF8;display:flex;flex-direction:column;
      font-family:'Playfair Display',Georgia,'Times New Roman',serif;overflow:hidden;">
      <div style="width:100%;height:${imgH}px;overflow:hidden;flex-shrink:0;">
        ${page.imageUrl
          ? `<img src="${page.imageUrl}" crossorigin="anonymous"
              style="width:100%;height:100%;object-fit:cover;display:block;"/>`
          : `<div style="width:100%;height:100%;background:linear-gradient(135deg,#FFF3D6,#FFEED4);
              display:flex;align-items:center;justify-content:center;font-size:48px;">🖼️</div>`}
      </div>
      <div style="height:1px;background:linear-gradient(90deg,transparent,#D4B896,transparent);flex-shrink:0;"></div>
      <div style="flex:1;padding:18px 26px 12px;display:flex;flex-direction:column;justify-content:center;background:#FEFCF8;">
        <p style="margin:0;font-size:15px;line-height:1.8;color:#2D2016;
          font-family:'Playfair Display',Georgia,serif;letter-spacing:0.01em;">${page.text || ""}</p>
        <div style="margin-top:auto;padding-top:8px;text-align:right;">
          <span style="font-size:11px;color:#B89B72;font-style:italic;">— ${page.pageNumber} —</span>
        </div>
      </div>
    </div>`;
}

function buildLandscapePageHTML(page, w, h) {
  const imgW = Math.round(w * 0.55);
  const txtW = w - imgW - 1;
  return `
    <div style="width:${w}px;height:${h}px;background:#FEFCF8;display:flex;flex-direction:row;
      font-family:'Playfair Display',Georgia,'Times New Roman',serif;overflow:hidden;">
      <div style="width:${imgW}px;height:100%;overflow:hidden;flex-shrink:0;">
        ${page.imageUrl
          ? `<img src="${page.imageUrl}" crossorigin="anonymous"
              style="width:100%;height:100%;object-fit:cover;display:block;"/>`
          : `<div style="width:100%;height:100%;background:linear-gradient(135deg,#FFF3D6,#FFEED4);
              display:flex;align-items:center;justify-content:center;font-size:48px;">🖼️</div>`}
      </div>
      <div style="width:1px;background:linear-gradient(180deg,transparent,#D4B896,transparent);flex-shrink:0;"></div>
      <div style="width:${txtW}px;padding:32px 28px;display:flex;flex-direction:column;justify-content:center;background:#FEFCF8;">
        <div style="width:32px;height:2px;background:#D4B896;border-radius:1px;margin-bottom:18px;"></div>
        <p style="margin:0;font-size:15px;line-height:1.85;color:#2D2016;
          font-family:'Playfair Display',Georgia,serif;">${page.text || ""}</p>
        <div style="margin-top:auto;padding-top:16px;">
          <span style="font-size:12px;color:#B89B72;font-style:italic;">Sida ${page.pageNumber}</span>
        </div>
      </div>
    </div>`;
}

function buildDigitalPageHTML(page, w, h) {
  const imgH = Math.round(h * 0.65);
  return `
    <div style="width:${w}px;height:${h}px;background:#0F0F0F;display:flex;flex-direction:column;overflow:hidden;">
      <div style="width:100%;height:${imgH}px;overflow:hidden;flex-shrink:0;position:relative;">
        ${page.imageUrl
          ? `<img src="${page.imageUrl}" crossorigin="anonymous"
              style="width:100%;height:100%;object-fit:cover;display:block;"/>`
          : `<div style="width:100%;height:100%;background:linear-gradient(135deg,#1a1a2e,#16213e);
              display:flex;align-items:center;justify-content:center;font-size:48px;">🖼️</div>`}
        <div style="position:absolute;bottom:0;left:0;right:0;height:50px;
          background:linear-gradient(transparent,#0F0F0F);"></div>
      </div>
      <div style="flex:1;padding:14px 20px 16px;background:#0F0F0F;display:flex;flex-direction:column;justify-content:center;">
        <div style="margin-bottom:8px;">
          <span style="font-size:10px;font-weight:700;color:#F59E0B;letter-spacing:1.5px;
            text-transform:uppercase;font-family:sans-serif;">Sida ${page.pageNumber}</span>
        </div>
        <p style="margin:0;font-size:14px;line-height:1.7;color:#F0E8D8;font-family:sans-serif;">${page.text || ""}</p>
      </div>
    </div>`;
}

function buildComicPageHTML(page, w, h) {
  const headerH = 22;
  const halftone = "background-image:radial-gradient(circle,rgba(17,17,17,0.13) 1px,transparent 1px);background-size:6px 6px;";
  const captionBox = (text) => `
    <div style="background:#E8D84C;border:2px solid #111;border-radius:5px;padding:7px 10px;
      width:100%;box-sizing:border-box;">
      <p style="margin:0;font-size:12px;line-height:1.5;color:#1A1200;font-weight:600;
        font-family:Bangers,'Comic Sans MS',cursive;letter-spacing:0.02em;">${text}</p>
    </div>`;
  const imgTag = (url, pos = "center top", extra = "") =>
    url
      ? `<img src="${url}" crossorigin="anonymous"
           style="width:100%;height:100%;object-fit:cover;object-position:${pos};display:block;${extra}"/>`
      : `<div style="width:100%;height:100%;background:linear-gradient(135deg,#FFF3D6,#FFD88A);
           display:flex;align-items:center;justify-content:center;font-size:30px;">🖼️</div>`;

  const variant = ((page.pageNumber || 1) - 1) % 3;
  let panelHTML;

  if (variant === 0) {
    // 2-panel (60/40) uppe + caption nere
    const topRowH = Math.round((h - headerH) * 0.56);
    const panel1W = Math.round(w * 0.60);
    panelHTML = `
      <div style="height:${topRowH}px;display:flex;border-bottom:3px solid #111;flex-shrink:0;">
        <div style="width:${panel1W}px;position:relative;overflow:hidden;border-right:3px solid #111;flex-shrink:0;">
          ${imgTag(page.imageUrl, "center top")}
          <div style="position:absolute;inset:0;${halftone}"></div>
          <span style="position:absolute;top:5px;right:7px;font-size:16px;filter:drop-shadow(1px 1px 0 #111);">💥</span>
        </div>
        <div style="flex:1;position:relative;overflow:hidden;background:#F5EFC4;">
          ${page.imageUrl
            ? `<img src="${page.imageUrl}" crossorigin="anonymous"
                 style="position:absolute;width:200%;height:180%;object-fit:cover;top:-20%;right:-50%;filter:contrast(1.1) saturate(1.15);"/>`
            : `<div style="position:absolute;inset:0;background:repeating-linear-gradient(45deg,#FFE88A,#FFE88A 3px,#FFFDE8 3px,#FFFDE8 10px);"></div>`}
          <div style="position:absolute;inset:0;${halftone}"></div>
        </div>
      </div>
      <div style="flex:1;padding:10px 12px;display:flex;align-items:center;background:#FFFDE8;">
        ${captionBox(page.text || "")}
      </div>`;
  } else if (variant === 1) {
    // Helbild uppe (68%) + caption nere
    const imgH = Math.round((h - headerH) * 0.68);
    panelHTML = `
      <div style="height:${imgH}px;position:relative;overflow:hidden;border-bottom:3px solid #111;flex-shrink:0;">
        ${imgTag(page.imageUrl, "center")}
        <div style="position:absolute;inset:0;${halftone}"></div>
        <span style="position:absolute;top:8px;left:10px;font-size:20px;filter:drop-shadow(1px 1px 0 #111);">⭐</span>
        <span style="position:absolute;bottom:8px;right:10px;font-size:16px;filter:drop-shadow(1px 1px 0 #111);">💥</span>
      </div>
      <div style="flex:1;padding:10px 12px;display:flex;align-items:center;background:#FFFDE8;">
        ${captionBox(page.text || "")}
      </div>`;
  } else {
    // Variant 2: caption uppe + helbild nere (72%)
    const capH = Math.round((h - headerH) * 0.26);
    panelHTML = `
      <div style="height:${capH}px;padding:10px 12px;display:flex;align-items:center;
        background:#FFFDE8;border-bottom:3px solid #111;flex-shrink:0;position:relative;">
        ${captionBox(page.text || "")}
      </div>
      <div style="flex:1;position:relative;overflow:hidden;">
        ${imgTag(page.imageUrl, "center bottom")}
        <div style="position:absolute;inset:0;${halftone}"></div>
        <span style="position:absolute;bottom:8px;right:10px;font-size:16px;filter:drop-shadow(1px 1px 0 #111);">💥</span>
      </div>`;
  }

  return `
    <div style="width:${w}px;height:${h}px;background:#FFFDE8;display:flex;flex-direction:column;
      border:3px solid #111;box-sizing:border-box;overflow:hidden;font-family:Bangers,'Comic Sans MS',cursive;">
      <div style="background:#111;color:#FFE44D;font-size:10px;font-weight:900;letter-spacing:2px;
        padding:3px 10px;text-transform:uppercase;display:flex;justify-content:space-between;
        align-items:center;flex-shrink:0;height:${headerH}px;box-sizing:border-box;">
        <span style="color:rgba(255,228,77,0.55);font-size:9px;letter-spacing:1px;">MinStory</span>
        <span>#${page.pageNumber}</span>
      </div>
      <div style="flex:1;display:flex;flex-direction:column;">
        ${panelHTML}
      </div>
    </div>`;
}

function buildBackCoverHTML(book, w, h) {
  const fmt   = book.format || "classic";
  const bg    = fmt === "comic" ? "#111" : fmt === "digital" ? "#0F0F0F" : "#2D2016";
  const pad   = Math.round(h * 0.10);
  const backText = book.backCoverText ||
    "En personlig och magisk berättelse. Skapad med kärlek för att bevaras för alltid.";
  return `
    <div style="width:${w}px;height:${h}px;background:${bg};position:relative;overflow:hidden;
      display:flex;align-items:center;justify-content:center;text-align:center;
      padding:${pad}px;box-sizing:border-box;">
      ${book.coverImage
        ? `<img src="${book.coverImage}" crossorigin="anonymous"
            style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;opacity:0.10;"/>`
        : ""}
      <div style="position:relative;z-index:1;max-width:${Math.round(w * 0.76)}px;">
        <div style="font-size:28px;margin-bottom:18px;">📖</div>
        <p style="color:rgba(255,255,255,0.88);font-size:15px;line-height:1.78;margin:0 0 28px;
          font-family:'Playfair Display',Georgia,serif;font-style:italic;">
          &ldquo;${backText}&rdquo;
        </p>
        <div style="width:40px;height:1px;background:rgba(255,255,255,0.25);margin:0 auto 22px;"></div>
        <p style="color:#fff;font-weight:700;font-size:17px;margin:0 0 5px;
          font-family:'Playfair Display',Georgia,serif;">MinStory</p>
        <p style="color:rgba(255,255,255,0.50);font-size:11px;margin:0 0 14px;
          letter-spacing:0.07em;text-transform:uppercase;font-family:sans-serif;">
          Din personliga bilderbok
        </p>
        <p style="color:rgba(255,255,255,0.28);font-size:11px;margin:0;font-family:sans-serif;">
          www.minstory.se
        </p>
      </div>
    </div>`;
}

/**
 * Konverterar en bild-URL (eller data:-URI) till en base64 data URI.
 * Firebase Storage-URLs proxyas via Railway-servern för att undvika CORS-blockeringar.
 */
const API_URL = typeof import.meta !== "undefined"
  ? (import.meta.env?.VITE_API_URL || "")
  : "";

async function toDataUri(url) {
  if (!url) return url;
  if (url.startsWith("data:")) return url;

  // Använd server-proxy för Firebase Storage-URLs
  const isFirebase =
    url.startsWith("https://firebasestorage.googleapis.com/") ||
    url.startsWith("https://storage.googleapis.com/");
  const fetchUrl = isFirebase
    ? `${API_URL}/api/proxy-image?url=${encodeURIComponent(url)}`
    : url;

  try {
    const res = await fetch(fetchUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn("[pdfExport] toDataUri failed for", url, err.message);
    return url;
  }
}

/**
 * Genererar och laddar ner en PDF av en bok.
 * @param {Object} book - { title, format, coverImage, backCoverText, pages: [{pageNumber, text, imageUrl}] }
 */
export async function downloadBookAsPdf(book) {
  const { jsPDF } = await import("jspdf");
  const html2canvas = (await import("html2canvas")).default;

  const fmt    = book.format || "classic";
  const opts   = FORMAT_OPTIONS[fmt] || FORMAT_OPTIONS.classic;
  const { orientation, w, h } = opts;
  const pdfFmt = opts.pdfFormat;

  const pdf   = new jsPDF({ orientation, unit: "mm", format: pdfFmt });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  const container = document.createElement("div");
  container.style.cssText = `position:fixed;left:-9999px;top:0;width:${w}px;height:${h}px;overflow:hidden;`;
  document.body.appendChild(container);

  // Pre-fetch all images as data URIs to avoid CORS issues in html2canvas
  const coverDataUri = await toDataUri(book.coverImage);
  const pagesWithDataUris = await Promise.all(
    (book.pages || []).map(async (p) => ({ ...p, imageUrl: await toDataUri(p.imageUrl) }))
  );
  const resolvedBook = { ...book, coverImage: coverDataUri, pages: pagesWithDataUris };

  const allPages = [null, ...resolvedBook.pages, "back"]; // null = framsida, "back" = bakpärm

  // Vänta på att Google Fonts ska laddas (Playfair Display, Bangers)
  await document.fonts.ready;

  for (let i = 0; i < allPages.length; i++) {
    const page = allPages[i];

    container.innerHTML = page === null
      ? buildCoverHTML(resolvedBook, w, h)
      : page === "back"
      ? buildBackCoverHTML(resolvedBook, w, h)
      : fmt === "landscape" ? buildLandscapePageHTML(page, w, h)
      : fmt === "digital"   ? buildDigitalPageHTML(page, w, h)
      : fmt === "comic"     ? buildComicPageHTML(page, w, h)
      : buildClassicPageHTML(page, w, h);

    await new Promise((r) => setTimeout(r, 80));
    const canvas = await html2canvas(container, {
      scale: 1.5, useCORS: true, backgroundColor: null, logging: false,
      width: w, height: h,
    });
    const imgData = canvas.toDataURL("image/jpeg", 0.92);

    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, 0, pageW, pageH);
  }

  document.body.removeChild(container);
  pdf.save(`${resolvedBook.title || "bok"}.pdf`);
}
