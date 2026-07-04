// CMS content registry — the SINGLE source of truth for every editable singular
// text on the site. Each field's `default` is the exact current hardcoded Turkish
// value; the site falls back to it when the DB has no value for that key (so a
// missing/empty key never leaves a blank on the site).
//
// Language-ready: values are stored in site_content.value as JSON {tr, en}. For
// now only `tr` is edited/shown; `en` stays null (a later turn wires EN). Using
// the existing `value` column avoids a schema migration.

export type CmsFieldType = "text" | "textarea";

type Def = {
  key: string;
  label: string;
  type: CmsFieldType;
  default: string;
};

type SectionDef = {
  id: string;
  title: string;
  fields: Def[];
};

const SECTIONS_DEF: SectionDef[] = [
  {
    id: "hero",
    title: "Hero",
    fields: [
      { key: "hero.eyebrow", label: "Üst etiket", type: "text", default: "Serdivan · Sakarya · Saç Sistemi" },
      { key: "hero.title1", label: "Başlık — 1. satır", type: "text", default: "Aynaya baktığında gördüğün yüz." },
      { key: "hero.title2", label: "Başlık — 2. satır", type: "text", default: "Onu geri istiyorsan, burada bir adres var." },
      { key: "hero.subtitle", label: "Alt başlık", type: "textarea", default: "Serdivan'da sessiz bir atölye.\nAcı yok, kesik yok, iyileşme süreci yok. Sadece saç." },
    ],
  },
  {
    id: "nedir",
    title: "Protez saç nedir",
    fields: [
      { key: "nedir.eyebrow", label: "Üst etiket", type: "text", default: "Saç Sistemi" },
      { key: "nedir.title", label: "Başlık", type: "text", default: "Protez saç nedir?" },
      { key: "nedir.paragraph", label: "Paragraf", type: "textarea", default: "Saç kaybı yaşadığın bölgeye, kendi saç yapına birebir uyacak şekilde hazırlanmış bir ünite. Medikal sabitleyicilerle yerine oturur. Kendi saçın gibi yıkarsın, tararsın, şekil verirsin." },
      { key: "nedir.point1_title", label: "1. madde — başlık", type: "text", default: "Acısız." },
      { key: "nedir.point1_desc", label: "1. madde — açıklama", type: "text", default: "Cerrahi değil. Uygulama sırasında ağrı, sızı yok." },
      { key: "nedir.point2_title", label: "2. madde — başlık", type: "text", default: "Geri dönüşü var." },
      { key: "nedir.point2_desc", label: "2. madde — açıklama", type: "text", default: "Kalıcı bir karar vermek zorunda değilsin." },
      { key: "nedir.point3_title", label: "3. madde — başlık", type: "text", default: "Kendi saçına zarar vermez." },
      { key: "nedir.point3_desc", label: "3. madde — açıklama", type: "text", default: "Kafa derisi hava alır, terletmez." },
      { key: "nedir.slogan", label: "Slogan", type: "textarea", default: "Duş al, denize gir, havuza atla, fön çek, renk değiştir. Kendi saçınla ne yapıyorsan." },
    ],
  },
  {
    id: "modeller",
    title: "Modeller",
    fields: [
      { key: "modeller.eyebrow", label: "Üst etiket", type: "text", default: "Modeller" },
      { key: "modeller.title", label: "Başlık", type: "text", default: "Üç yol. Hepsi kendi saçın." },
      { key: "modeller.intro", label: "Giriş", type: "textarea", default: "Hepsi %100 gerçek insan saçından, Kore işçiliği. Fark; taban yapısında ve doğallığın derecesinde." },
      { key: "modeller.m1_title", label: "1. model — ad", type: "text", default: "Ferah Tarama" },
      { key: "modeller.m1_desc", label: "1. model — açıklama", type: "textarea", default: "Orta bölümü french lace. Kafa derin nefes alır, su geçirir. Ön 1 cm'lik bölüme ağartma uygulanır — saç çizgin doğal görünür. Tül, ölçüne göre kesilir." },
      { key: "modeller.m2_title", label: "2. model — ad", type: "text", default: "Lux Protez" },
      { key: "modeller.m2_desc", label: "2. model — açıklama", type: "textarea", default: "Tabanın tamamı nanofilament tül (France Lace). Baştan sona nefes alır. Ön 4 cm ağartılır. Ön tülde 1 cm'lik bölüm RSK tek düğümle işlenir — mümkün olan en doğal saç çizgisi." },
      { key: "modeller.m3_title", label: "3. model — ad", type: "text", default: "Sil Baştan" },
      { key: "modeller.m3_desc", label: "3. model — açıklama", type: "textarea", default: "Full kalıp. Komple/dengesiz dökülme, doğuştan saçsızlık, alopesi, radyoterapi sonrası dökülme, yanık ya da kafa şekli farklılıkları için. Alından enseye, şakaktan şakağa." },
      { key: "modeller.footnote", label: "Alt not", type: "text", default: "Hangisinin sana uyduğunu ön görüşmede birlikte kararlaştırırız." },
    ],
  },
  {
    id: "surec",
    title: "Süreç",
    fields: [
      { key: "surec.eyebrow", label: "Üst etiket", type: "text", default: "Süreç" },
      { key: "surec.title", label: "Başlık", type: "text", default: "Dört adım. Bir öğleden sonra." },
      { key: "surec.s1_title", label: "1. adım — ad", type: "text", default: "Buluşma" },
      { key: "surec.s1_desc", label: "1. adım — açıklama", type: "text", default: "On beş dakika. Sadece konuşuruz. Satış yok, baskı yok." },
      { key: "surec.s2_title", label: "2. adım — ad", type: "text", default: "Ölçü" },
      { key: "surec.s2_desc", label: "2. adım — açıklama", type: "text", default: "Kafa yapın, mevcut saçın, ten tonun, yaşam tarzın. Hepsi önemli." },
      { key: "surec.s3_title", label: "3. adım — ad", type: "text", default: "Uygulama" },
      { key: "surec.s3_desc", label: "3. adım — açıklama", type: "text", default: "İki-üç saat. Acı yok, kesik yok, iyileşme yok." },
      { key: "surec.s4_title", label: "4. adım — ad", type: "text", default: "Yansıma" },
      { key: "surec.s4_desc", label: "4. adım — açıklama", type: "text", default: "Aynaya bakarsın. Geri döndün." },
    ],
  },
  {
    id: "atolye",
    title: "Atölye",
    fields: [
      { key: "atolye.eyebrow", label: "Üst etiket", type: "text", default: "Mekan & Gizlilik" },
      { key: "atolye.title", label: "Başlık", type: "text", default: "Kimse görmeden." },
      { key: "atolye.paragraph1", label: "Paragraf 1", type: "textarea", default: "Serdivan'daki yeni atölyemiz daha büyük ve ayrı odalı. Randevun senin — kapalı bir odada, tek tek ilgileniriz. İstersen kimseyle karşılaşmadan gelir, kimse anlamadan gidersin." },
      { key: "atolye.paragraph2", label: "Paragraf 2", type: "textarea", default: "Ekip büyüdü; aynı anda birkaç kişiye hizmet verebiliyoruz. Beklemezsin." },
      { key: "atolye.p1_title", label: "1. madde — başlık", type: "text", default: "Ayrı odalar." },
      { key: "atolye.p1_desc", label: "1. madde — açıklama", type: "text", default: "Görüşme de uygulama da kapalı kapı ardında." },
      { key: "atolye.p2_title", label: "2. madde — başlık", type: "text", default: "Randevuyla." },
      { key: "atolye.p2_desc", label: "2. madde — açıklama", type: "text", default: "Herkes kendi saatinde; karşılaşma olmaz." },
    ],
  },
  {
    id: "kanit",
    title: "Kanıt (Önce/Sonra)",
    fields: [
      { key: "kanit.eyebrow", label: "Üst etiket", type: "text", default: "Uygulamalarımız" },
      { key: "kanit.title", label: "Başlık", type: "text", default: "Öncesi ve sonrası" },
      { key: "kanit.subtitle", label: "Alt başlık", type: "textarea", default: "Aşağıdakiler gerçek. Kadraj her zaman kusursuz değil — çünkü bunlar stüdyo değil, atölye." },
    ],
  },
  {
    id: "usta",
    title: "Usta",
    fields: [
      { key: "usta.eyebrow", label: "Üst etiket", type: "text", default: "Usta" },
      { key: "usta.title", label: "Başlık", type: "text", default: "İşi yapan el." },
      { key: "usta.quote1", label: "Alıntı — 1. paragraf", type: "textarea", default: "[X] yıldır aynı işi yapıyorum: Serdivan'da, küçük bir atölyede, tek tek." },
      { key: "usta.quote2", label: "Alıntı — 2. paragraf", type: "textarea", default: 'Kimseye "şunu da al" demem. Sana ne yakışıyorsa onu konuşuruz. Ölçü doğruysa, gerisi kendiliğinden gelir.' },
      { key: "usta.signature", label: "İmza", type: "text", default: "Alperen Aygın" },
    ],
  },
  {
    id: "sss",
    title: "SSS",
    fields: [
      { key: "sss.eyebrow", label: "Üst etiket", type: "text", default: "Sık Sorulanlar" },
      { key: "sss.title", label: "Başlık", type: "text", default: "Aklındakiler." },
      { key: "sss.q1", label: "1. soru", type: "text", default: "Acıyor mu?" },
      { key: "sss.a1", label: "1. cevap", type: "textarea", default: "Hayır. Cerrahi bir işlem değil. Ağrı ya da sızı hissetmezsin." },
      { key: "sss.q2", label: "2. soru", type: "text", default: "Fark edilir mi? Doğal duruyor mu?" },
      { key: "sss.a2", label: "2. cevap", type: "textarea", default: "Saç çizgisi ağartma ve tek düğüm teknikleriyle hazırlanır. Yakından bile ayırmak zordur." },
      { key: "sss.q3", label: "3. soru", type: "text", default: "Ne kadar sürüyor?" },
      { key: "sss.a3", label: "3. cevap", type: "textarea", default: "Uygulama iki-üç saat. Ön görüşme bir saat." },
      { key: "sss.q4", label: "4. soru", type: "text", default: "Kendi saçıma zarar verir mi?" },
      { key: "sss.a4", label: "4. cevap", type: "textarea", default: "Vermez. Kafa derin hava alır, terletmez." },
      { key: "sss.q5", label: "5. soru", type: "text", default: "Suyla arası nasıl?" },
      { key: "sss.a5", label: "5. cevap", type: "textarea", default: "Sorun değil. Yıkarsın, denize girersin, fön çekersin." },
      { key: "sss.q6", label: "6. soru", type: "text", default: "Ne sıklıkla bakım?" },
      { key: "sss.a6", label: "6. cevap", type: "textarea", default: "[3-4 haftada bir — netleşecek]. Bakımı biz yaparız." },
      { key: "sss.q7", label: "7. soru", type: "text", default: "Fiyat?" },
      { key: "sss.a7", label: "7. cevap", type: "textarea", default: "Modele ve ölçüye göre değişir. Net rakamı ön görüşmede konuşuruz. Bakım [₺1.000]." },
      { key: "sss.q8", label: "8. soru", type: "text", default: "Gizli kalır mı?" },
      { key: "sss.a8", label: "8. cevap", type: "textarea", default: "Atölye randevuyla çalışır ve ayrı odaları var. Kapalı bir odada tek tek ilgileniriz. Kimse görmeden gelir, kimse anlamadan gidersin." },
    ],
  },
  {
    id: "iletisim",
    title: "İletişim",
    fields: [
      { key: "iletisim.eyebrow", label: "Üst etiket", type: "text", default: "İletişim & Randevu" },
      { key: "iletisim.title", label: "Başlık", type: "text", default: "Bir saatlik bir buluşma." },
      { key: "iletisim.intro", label: "Giriş", type: "textarea", default: "İstersen formu doldur, istersen WhatsApp'tan yaz, istersen ara. Üçü de sana ulaşır." },
      { key: "iletisim.form_hint", label: "Form üstü not", type: "textarea", default: "Fotoğraf göndermek zorunda değilsiniz.\nÖnce sadece konuşalım." },
      { key: "iletisim.form_name", label: "Form — ad etiketi", type: "text", default: "Ad *" },
      { key: "iletisim.form_phone", label: "Form — telefon etiketi", type: "text", default: "Telefon *" },
      { key: "iletisim.form_day", label: "Form — gün etiketi", type: "text", default: "Tercih ettiğin gün" },
      { key: "iletisim.day1", label: "Gün seçeneği 1", type: "text", default: "Hafta içi" },
      { key: "iletisim.day2", label: "Gün seçeneği 2", type: "text", default: "Hafta sonu" },
      { key: "iletisim.day3", label: "Gün seçeneği 3", type: "text", default: "Fark etmez" },
      { key: "iletisim.form_note", label: "Form — not etiketi", type: "text", default: "Eklemek istediğin bir şey" },
      { key: "iletisim.form_submit", label: "Form — gönder butonu", type: "text", default: "Randevumu bırak" },
      { key: "iletisim.form_error", label: "Form — hata mesajı", type: "text", default: "Ad ve telefon gerekli." },
      { key: "iletisim.success_eyebrow", label: "Başarı — üst etiket", type: "text", default: "Randevu isteğin alındı" },
      { key: "iletisim.success_msg", label: "Başarı — mesaj", type: "textarea", default: "Aldık. 24 saat içinde döneceğiz." },
      { key: "iletisim.address", label: "Adres", type: "text", default: "[Yeni adres — Serdivan / Sakarya]" },
      { key: "iletisim.phone", label: "Telefon", type: "text", default: "0 535 483 89 97" },
      { key: "iletisim.email", label: "E-posta", type: "text", default: "alperenaygin21@gmail.com" },
      { key: "iletisim.hours", label: "Saatler", type: "text", default: "[Pazartesi–Cumartesi, 10:00–19:00 · Randevuyla]" },
      { key: "iletisim.instagram", label: "Instagram (@ olmadan)", type: "text", default: "alperenayginhairstudio" },
      { key: "iletisim.kvkk", label: "KVKK notu", type: "text", default: "KVKK: [aydınlatma metni linki]" },
    ],
  },
  {
    id: "footer",
    title: "Footer",
    fields: [
      { key: "footer.tagline", label: "Slogan", type: "text", default: "Serdivan'da bir atölye. Bir aynaya geri dönüş." },
      { key: "footer.keywords", label: "Anahtar kelimeler", type: "textarea", default: "Sakarya protez saç · Serdivan protez saç · protez saç uygulama · protez saç bakımı · saç sistemi Sakarya · Alperen Aygın" },
      { key: "footer.copyright", label: "Telif", type: "text", default: "© [2026] Alperen Aygın. Sessizce hazırlandı." },
    ],
  },
  {
    id: "trust",
    title: "Güven şeridi",
    fields: [
      { key: "trust.years", label: "Yıl sayısı (rakam)", type: "text", default: "12" },
      { key: "trust.item2", label: "2. öğe", type: "text", default: "Ayrı odalı özel atölye" },
      { key: "trust.material", label: "3. öğe (%100 sonrası)", type: "text", default: "gerçek insan saçı" },
      { key: "trust.item4", label: "4. öğe", type: "text", default: "Serdivan / Sakarya" },
    ],
  },
];

export type CmsField = { key: string; label: string; type: CmsFieldType };
export type CmsSection = { id: string; title: string; fields: CmsField[] };

export const CMS_SECTIONS: CmsSection[] = SECTIONS_DEF.map((s) => ({
  id: s.id,
  title: s.title,
  fields: s.fields.map(({ key, label, type }) => ({ key, label, type })),
}));

export const CONTENT_DEFAULTS: Record<string, string> = Object.fromEntries(
  SECTIONS_DEF.flatMap((s) => s.fields.map((f) => [f.key, f.default]))
);

/** All keys belonging to a section (for the save action). */
export function sectionKeys(sectionId: string): string[] {
  return CMS_SECTIONS.find((s) => s.id === sectionId)?.fields.map((f) => f.key) ?? [];
}
