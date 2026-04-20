import { useState, useCallback, useMemo, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════════
   CONTRACT GENERATOR — WebDev Contract Base
   Gray gradient · Red/Green · Arial 12 paper
   ═══════════════════════════════════════════════════════════════════ */

const DEFAULT_TEMPLATE = `CONTRATO DE PRESTAÇÃO DE SERVIÇOS
DESENVOLVIMENTO DE WEBSITE

1. PARTES

CONTRATANTE:
{{NOME_DO_CONTRATANTE}}, {{TIPO_DE_PESSOA_CONTRATANTE}}, inscrito sob o {{CPF_CNPJ_CONTRATANTE}}, com endereço em {{ENDERECO_CONTRATANTE}}, e-mail {{EMAIL_CONTRATANTE}}.

CONTRATADO:
{{NOME_DO_CONTRATADO}}, {{TIPO_DE_PESSOA_CONTRATADO}}, inscrito sob o {{CPF_CNPJ_CONTRATADO}}, com endereço em {{ENDERECO_CONTRATADO}}, e-mail {{EMAIL_CONTRATADO}}.

2. ACEITE DIGITAL E VALIDADE JURÍDICA

2.1. As partes concordam que este contrato poderá ser assinado eletronicamente por meio de plataforma de assinatura digital.

2.2. As assinaturas eletrônicas terão plena validade jurídica, nos termos da legislação aplicável, incluindo a Medida Provisória nº 2.200-2/2001.

2.3. As partes reconhecem como válidos:
● Assinatura eletrônica simples
● Assinatura eletrônica avançada
● Assinatura digital com certificado ICP-Brasil

2.4. Este documento assinado digitalmente produzirá os mesmos efeitos de um documento físico assinado.

3. OBJETO

3.1. Prestação de serviços de desenvolvimento de website, incluindo:

{{DESCRICAO_DO_PROJETO}}

{{FUNCIONALIDADES}}

{{TECNOLOGIAS}}

4. PRAZO

4.1. O prazo para execução dos serviços será de {{PRAZO_TOTAL}}, iniciando-se em {{DATA_INICIO}} e com previsão de término em {{DATA_FINAL}}.

4.2. O prazo poderá ser alterado em caso de:
● Atrasos no envio de materiais por parte do CONTRATANTE
● Solicitações de alterações adicionais

5. VALOR E PAGAMENTO

5.1. Valor da Taxa de Implementação

5.1.1. Pela execução inicial do projeto (desenvolvimento, configuração e entrega do website), o CONTRATANTE pagará ao CONTRATADO o valor de:

R$ {{VALOR_IMPLEMENTACAO}}

5.1.2. Este valor refere-se exclusivamente à fase de construção e entrega do projeto, não incluindo serviços recorrentes.

5.2. Valor da Mensalidade (Serviço Recorrente)

5.2.1. Após a entrega do projeto, o CONTRATANTE pagará o valor mensal de:

R$ {{VALOR_MENSAL}} / mês

5.2.2. Este valor contempla:

{{DESCRICAO_SERVICOS_MENSAIS}}

5.3. Vigência Contratual

5.3.1. O presente contrato terá vigência mínima de:

{{PERIODO_CONTRATO}}

5.3.2. Durante este período, o CONTRATANTE se compromete ao pagamento integral da recorrência contratada.

5.4. Modalidades de Pagamento

O CONTRATANTE poderá optar por uma das seguintes formas de pagamento:

(A) Pagamento Parcelado (Modelo Padrão)
● Valor da implementação: {{VALOR_IMPLEMENTACAO}}
● Mensalidade: R$ {{VALOR_MENSAL}} pagos mensalmente

(B) Pagamento Antecipado (Plano Anual)

5.4.1. O CONTRATANTE poderá optar pelo pagamento antecipado do contrato, somando:
● Taxa de implementação +
● 12 meses de mensalidade

Totalizando:

R$ {{VALOR_TOTAL_CONSOLIDADO}}

5.4.2. Em caso de pagamento antecipado, poderá ser concedido desconto de:

{{PERCENTUAL_DESCONTO}}%

5.5. Condições Gerais de Pagamento

5.5.1. Forma de pagamento:

{{FORMA_DE_PAGAMENTO}}

5.5.2. Em caso de atraso:
● Juros de 10% ao mês em relação ao valor mensal de: R$ {{VALOR_MENSAL}}

5.6. Inadimplência e Suspensão

5.6.1. Em caso de atraso superior a {{DIAS_INADIMPLENCIA}} dias, o CONTRATADO poderá:
● Suspender os serviços
● Tornar o website indisponível
● Interromper suporte e manutenção

5.6.2. A reativação ocorrerá apenas após a regularização dos pagamentos.

5.7. Rescisão Antecipada

5.7.1. Em caso de cancelamento antes do término da vigência:
● Multa de 50% sobre o valor restante

6. ESCOPO E LIMITAÇÕES

6.1. Tudo que não estiver descrito neste contrato será considerado fora do escopo.

7. OBRIGAÇÕES

7.1. CONTRATADO
● Executar o projeto conforme escopo
● Corrigir falhas técnicas
● Entregar o projeto funcional

7.2. CONTRATANTE
● Fornecer materiais e acessos
● Aprovar etapas
● Realizar pagamentos

8. PROPRIEDADE INTELECTUAL

8.1. O CONTRATADO poderá utilizar o projeto em portfólio.

9. SUPORTE

9.1. Período: {{PERIODO_SUPORTE}}

9.2. Inclui: correções técnicas

9.3. Não inclui: novas funcionalidades

10. RESCISÃO

10.1. O contrato poderá ser rescindido por qualquer das partes mediante aviso prévio de {{DIAS_AVISO}} dias.

10.2. Em caso de rescisão:
● Valores já pagos não serão reembolsados
● Serviços já realizados serão cobrados proporcionalmente

11. MULTA CONTRATUAL

11.1. Multa por descumprimento:

100% do valor restante do contrato

12. CONFIDENCIALIDADE

12.1. As partes se comprometem a manter sigilo sobre todas as informações trocadas.

13. FORO

13.1. Fica eleito o foro da comarca de {{CIDADE_ESTADO_FORO}} para dirimir quaisquer questões oriundas deste contrato.

14. ASSINATURA DIGITAL

Ao assinar eletronicamente este documento, as partes:
● Confirmam que leram e concordam com todos os termos
● Declaram que possuem capacidade legal para contratação
● Aceitam a validade jurídica da assinatura digital

BLOCO DE ASSINATURA

CONTRATANTE
Nome: {{NOME_DO_CONTRATANTE}}
E-mail: {{EMAIL_CONTRATANTE}}
Data: {{DATA_ASSINATURA_CONTRATANTE}}

CONTRATADO
Nome: {{NOME_DO_CONTRATADO}}
E-mail: {{EMAIL_CONTRATADO}}
Data: {{DATA_ASSINATURA_CONTRATADO}}`;

// ── Engine — now uses {{FIELD}} delimiters ──
function parseFields(tpl: string) {
  const rx = /\{\{([A-ZÀ-Ú0-9a-zà-ú_/]+)\}\}/g;
  const seen = new Set(), out = [];
  let m;
  while ((m = rx.exec(tpl)) !== null) {
    const key = m[1];
    if (!seen.has(key)) {
      seen.add(key);
      out.push({ key, label: toLabel(key), type: inferType(key) });
    }
  }
  return out;
}

function toLabel(n: string) {
  return n.replace(/[_/]/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

function inferType(n: string) {
  const u = n.toUpperCase();
  if (/DATA|INICIO|FINAL/.test(u) && !/CONTRATANTE|CONTRATADO/.test(u)) return "date";
  if (/DATA_ASSINATURA/.test(u)) return "date";
  if (/DIAS/.test(u)) return "number";
  if (/PERCENTUAL|JUROS|MULTA_PERCENTUAL/.test(u)) return "number";
  if (/ENDERECO/.test(u)) return "textarea";
  if (/DESCRICAO|FUNCIONALIDADES|TECNOLOGIAS|SERVICOS_MENSAIS/.test(u)) return "textarea";
  return "text";
}

function sub(tpl: string, vals: Record<string, string>) {
  return tpl.replace(/\{\{([A-ZÀ-Ú0-9a-zà-ú_/]+)\}\}/g, (full, key) => {
    const v = vals[key];
    return v && v.trim() ? v : full;
  });
}

function fmtDate(v: string) {
  if (!v) return "";
  const [y, m, d] = v.split("-");
  return `${d}/${m}/${y}`;
}

function sec(k: string) {
  const u = k.toUpperCase();
  if (/CONTRATANTE/.test(u) && !/CONTRATADO/.test(u)) return "Contratante";
  if (/CONTRATADO/.test(u)) return "Contratado";
  if (/VALOR|PAGAMENTO|MENSAL|IMPLEMENTACAO|CONSOLIDADO|FORMA|MULTA|JUROS|DESCONTO|INADIMPLENCIA/.test(u)) return "Financeiro";
  if (/DATA|PRAZO|INICIO|FINAL|PERIODO|DIAS/.test(u) && !/ASSINATURA/.test(u)) return "Prazos & Vigência";
  if (/DESCRICAO|FUNCIONALIDADES|TECNOLOGIAS|SERVICOS/.test(u)) return "Projeto & Escopo";
  if (/CIDADE|ESTADO|FORO/.test(u)) return "Foro";
  if (/SUPORTE|AVISO/.test(u)) return "Suporte & Rescisão";
  if (/ASSINATURA/.test(u)) return "Assinatura";
  if (/NOME_DO|TIPO_DE|CPF|CNPJ|ENDERECO|EMAIL/.test(u)) {
    if (/CONTRATANTE/.test(u)) return "Contratante";
    if (/CONTRATADO/.test(u)) return "Contratado";
  }
  return "Outros";
}

const SEC_ORDER = ["Contratante", "Contratado", "Projeto & Escopo", "Prazos & Vigência", "Financeiro", "Suporte & Rescisão", "Foro", "Assinatura", "Outros"];

function makePDF(content: string) {
  const h = `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
@page{margin:2.5cm;size:A4}
body{font-family:Arial,Helvetica,sans-serif;font-size:12pt;line-height:1.8;color:#111}
.title{font-size:13pt;font-weight:bold;text-align:center;margin-bottom:0.3em}
.subtitle{font-size:12pt;font-weight:bold;text-align:center;margin-bottom:2em;color:#333}
p{margin:0 0 0.6em;text-align:justify}
.section-num{font-weight:bold;margin-top:1.2em}
.bullet{margin-left:2em}
</style></head><body>
${content.split("\n").map((l, i) => {
    const t = l.trim();
    if (i === 0) return `<p class="title">${t}</p>`;
    if (i === 1 && t === "DESENVOLVIMENTO DE WEBSITE") return `<p class="subtitle">${t}</p>`;
    if (!t) return "<br/>";
    if (/^\d+\.\s/.test(t) && !/^\d+\.\d+/.test(t)) return `<p class="section-num">${t}</p>`;
    if (t.startsWith("●")) return `<p class="bullet">${t}</p>`;
    return `<p>${t}</p>`;
  }).join("\n")}
</body></html>`;
  const b = new Blob([h], { type: "text/html" });
  const u = URL.createObjectURL(b);
  const w = window.open(u, "_blank");
  if (w) w.onload = () => setTimeout(() => w.print(), 400);
  URL.revokeObjectURL(u);
}

// ── Icons ──
const IcoCheck = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12" /></svg>;
const IcoDown = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7,10 12,15 17,10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>;
const IcoRefresh = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23,4 23,10 17,10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" /></svg>;
const IcoUpload = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16,16 12,12 8,16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" /></svg>;
const IcoClock = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg>;
const IcoChev = ({ open }: { open?: boolean }) => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s ease" }}><polyline points="6,9 12,15 18,9" /></svg>;

// ── App ──
export default function ContractGenerator() {
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [values, setValues] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState(DEFAULT_TEMPLATE);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [openSec, setOpenSec] = useState(new Set(SEC_ORDER));
  const [showTpl, setShowTpl] = useState(false);
  const [showHist, setShowHist] = useState(false);
  const [tmpTpl, setTmpTpl] = useState("");
  const [hist, setHist] = useState<any[]>([]);
  const [toast, setToast] = useState<{msg: string, type: string} | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 40); }, []);

  const fields = useMemo(() => parseFields(template), [template]);
  const filled = fields.filter(f => values[f.key]?.trim()).length;
  const pct = fields.length ? (filled / fields.length) * 100 : 0;
  const allOk = filled === fields.length && fields.length > 0;

  const sections = useMemo(() => {
    const g: Record<string, any[]> = {};
    fields.forEach(f => { const s = sec(f.key); if (!g[s]) g[s] = []; g[s].push(f); });
    return g;
  }, [fields]);

  const notify = useCallback((msg: string, type = "ok") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3200); }, []);

  const chg = useCallback((k: string, v: string, t: string) => {
    let val = v; if (t === "date" && v) val = fmtDate(v);
    setValues(p => ({ ...p, [k]: val })); setTouched(p => ({ ...p, [k]: true }));
  }, []);
  const raw = useCallback((k: string, v: string) => { setValues(p => ({ ...p, [k]: v })); setTouched(p => ({ ...p, [k]: true })); }, []);

  useEffect(() => { const t = setTimeout(() => setPreview(sub(template, values)), 250); return () => clearTimeout(t); }, [values, template]);

  const doUpdate = useCallback(() => { setPreview(sub(template, values)); notify("Prévia atualizada"); }, [template, values, notify]);

  const doGen = useCallback(() => {
    const miss = fields.filter(f => !values[f.key]?.trim());
    if (miss.length) { notify(`${miss.length} campo${miss.length > 1 ? "s" : ""} pendente${miss.length > 1 ? "s" : ""}`, "err"); setTouched(Object.fromEntries(fields.map(f => [f.key, true]))); return; }
    const fin = sub(template, values); setPreview(fin); makePDF(fin);
    setHist(p => [{ id: Date.now(), date: new Date().toLocaleDateString("pt-BR"), client: values["NOME_DO_CONTRATANTE"] || "—", vals: { ...values } }, ...p].slice(0, 30));
    notify("Contrato gerado — use Ctrl+P para salvar como PDF");
  }, [fields, values, template, notify]);

  const doLoadTpl = useCallback(() => {
    if (!tmpTpl.trim()) return;
    setTemplate(tmpTpl.trim()); setValues({}); setTouched({}); setPreview(tmpTpl.trim()); setShowTpl(false); notify("Template carregado");
  }, [tmpTpl, notify]);

  const toggle = useCallback((s: string) => { setOpenSec(p => { const n = new Set(p); n.has(s) ? n.delete(s) : n.add(s); return n; }); }, []);

  const R = 20, circ = 2 * Math.PI * R;

  return (
    <div className={`cg${mounted ? " cg--in" : ""}`}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {toast && (
        <div className={`cg-toast${toast.type === "err" ? " cg-toast--err" : ""}`}>
          <span className="cg-toast__dot" />{toast.msg}
        </div>
      )}

      {/* ─── HEADER ─── */}
      <header className="cg-hdr">
        <div className="cg-hdr__brand">
          <div className="cg-logo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14,2 14,8 20,8" />
              <line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="13" y2="17" />
            </svg>
          </div>
          <div>
            <div className="cg-logo__name">Contractum</div>
            <div className="cg-logo__sub">Contrato WebDev</div>
          </div>
        </div>

        <div className="cg-meter">
          <svg width="50" height="50" viewBox="0 0 50 50">
            <circle cx="25" cy="25" r={R} fill="none" stroke="#e0e0e0" strokeWidth="2.5" />
            <circle cx="25" cy="25" r={R} fill="none"
              stroke={allOk ? "#2eac68" : "#D63031"}
              strokeWidth="2.5" strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
              transform="rotate(-90 25 25)"
              style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.3s ease" }}
            />
            <text x="25" y="29" textAnchor="middle" fill="#333" fontSize="11" fontFamily="DM Sans,sans-serif" fontWeight="700">{Math.round(pct)}%</text>
          </svg>
          <div className="cg-meter__lbl">{filled}/{fields.length} campos</div>
        </div>

        <div className="cg-hdr__nav">
          <button className="cg-hbtn" onClick={() => { setTmpTpl(template); setShowTpl(true); }}>
            <IcoUpload /> Template
          </button>
          <button className="cg-hbtn" onClick={() => setShowHist(true)}>
            <IcoClock /> Histórico
            {hist.length > 0 && <span className="cg-badge">{hist.length}</span>}
          </button>
        </div>
      </header>

      {/* ─── BODY ─── */}
      <div className="cg-body">

        {/* LEFT */}
        <aside className="cg-left">
          <div className="cg-left__top">
            <div className="cg-eyebrow">
              <span className="cg-eyebrow__line" />
              <span className="cg-eyebrow__txt">Dados do Contrato</span>
              <span className="cg-eyebrow__line" />
            </div>
          </div>

          <div className="cg-scroll">
            {SEC_ORDER.filter(s => sections[s]).map(sName => {
              const sf = sections[sName];
              const sFilled = sf.filter(f => values[f.key]?.trim()).length;
              const isOpen = openSec.has(sName);
              const done = sFilled === sf.length;

              return (
                <div className="cg-sec" key={sName}>
                  <button className="cg-sec__hdr" onClick={() => toggle(sName)}>
                    <div className="cg-sec__left">
                      <span className={`cg-dot${done ? " cg-dot--done" : ""}`} />
                      <span className="cg-sec__name">{sName}</span>
                    </div>
                    <div className="cg-sec__right">
                      <span className={`cg-pill${done ? " cg-pill--done" : ""}`}>{sFilled}/{sf.length}</span>
                      <IcoChev open={isOpen} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="cg-sec__body">
                      {sf.map(field => {
                        const ok = !!values[field.key]?.trim();
                        const err = touched[field.key] && !ok;

                        return (
                          <div className="cg-field" key={field.key}>
                            <label className="cg-lbl">
                              <span className={`cg-tag${ok ? " cg-tag--ok" : ""}`}>{field.key}</span>
                              <span className="cg-lbl__name">{field.label}</span>
                              {ok && <span className="cg-chk"><IcoCheck /></span>}
                            </label>

                            {field.type === "textarea" ? (
                              <textarea
                                className={`cg-input cg-input--ta${ok ? " is-ok" : ""}${err ? " is-err" : ""}`}
                                placeholder={`Informe ${field.label.toLowerCase()}…`}
                                value={values[field.key] || ""}
                                onChange={e => raw(field.key, e.target.value)}
                                onBlur={() => setTouched(p => ({ ...p, [field.key]: true }))}
                              />
                            ) : field.type === "date" ? (
                              <input type="date"
                                className={`cg-input${ok ? " is-ok" : ""}${err ? " is-err" : ""}`}
                                onChange={e => chg(field.key, e.target.value, "date")}
                                onBlur={() => setTouched(p => ({ ...p, [field.key]: true }))}
                              />
                            ) : (
                              <input
                                type={field.type === "number" ? "number" : "text"}
                                className={`cg-input${ok ? " is-ok" : ""}${err ? " is-err" : ""}`}
                                placeholder={`Informe ${field.label.toLowerCase()}…`}
                                value={values[field.key] || ""}
                                onChange={e => raw(field.key, e.target.value)}
                                onBlur={() => setTouched(p => ({ ...p, [field.key]: true }))}
                              />
                            )}
                            {err && <span className="cg-err">Campo obrigatório</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="cg-left__foot">
            <button className="cg-btn-upd" onClick={doUpdate}>
              <IcoRefresh /> Atualizar prévia
            </button>
          </div>
        </aside>

        {/* RIGHT */}
        <section className="cg-right">
          <div className="cg-right__bar">
            <span className="cg-eyebrow__txt">Prévia do Documento</span>
            <button className={`cg-btn-gen${allOk ? " is-ready" : ""}`} onClick={doGen}>
              <IcoDown /> Gerar Contrato
            </button>
          </div>

          <div className="cg-preview">
            <div className="cg-paper">
              <div className="cg-paper__body">
                {preview.split("\n").map((line, i) => {
                  const t = line.trim();
                  if (!t) return <div key={i} style={{ height: 6 }} />;

                  const parts = []; let last = 0;
                  const rx = /\{\{([A-ZÀ-Ú0-9a-zà-ú_/]+)\}\}/g; let m2;
                  while ((m2 = rx.exec(line)) !== null) {
                    if (m2.index > last) parts.push(<span key={`t${i}-${last}`}>{line.slice(last, m2.index)}</span>);
                    parts.push(<mark key={`v${i}-${m2.index}`} className="cg-var">{m2[0]}</mark>);
                    last = m2.index + m2[0].length;
                  }
                  if (last < line.length) parts.push(<span key={`e${i}`}>{line.slice(last)}</span>);

                  // Title lines
                  if (i === 0) return <p key={i} className="cg-d-title">{parts}</p>;
                  if (t === "DESENVOLVIMENTO DE WEBSITE") return <p key={i} className="cg-d-subtitle">{parts}</p>;
                  // Section headers: "1. PARTES", "2. ACEITE...", etc.
                  if (/^\d+\.\s[A-ZÀ-Ú]/.test(t) && !/^\d+\.\d+/.test(t)) return <p key={i} className="cg-d-section">{parts}</p>;
                  // Subsection: "5.1.1.", "5.2.", etc.
                  if (/^\d+\.\d+/.test(t)) return <p key={i} className="cg-d-sub">{parts}</p>;
                  // Bullets
                  if (t.startsWith("●")) return <p key={i} className="cg-d-bullet">{parts}</p>;
                  // Labels like "CONTRATANTE:", "CONTRATADO:", "(A)...", "(B)..."
                  if (/^(CONTRATANTE|CONTRATADO|BLOCO DE ASSINATURA):?/.test(t)) return <p key={i} className="cg-d-label">{parts}</p>;

                  return <p key={i} className="cg-d-para">{parts}</p>;
                })}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ─── TEMPLATE MODAL ─── */}
      {showTpl && (
        <div className="cg-ov" onClick={() => setShowTpl(false)}>
          <div className="cg-modal" onClick={e => e.stopPropagation()}>
            <h2 className="cg-modal__title">Carregar Template</h2>
            <p className="cg-modal__desc">Cole o texto do contrato modelo. Use <code>{"{{CAMPO}}"}</code> para delimitar variáveis.</p>
            <textarea className="cg-modal__ta" placeholder="Cole seu template aqui…" value={tmpTpl} onChange={e => setTmpTpl(e.target.value)} />
            <div className="cg-modal__act">
              <button className="cg-modal__cancel" onClick={() => setShowTpl(false)}>Cancelar</button>
              <button className="cg-modal__ok" onClick={doLoadTpl}>Usar template</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── HISTORY MODAL ─── */}
      {showHist && (
        <div className="cg-ov" onClick={() => setShowHist(false)}>
          <div className="cg-modal" onClick={e => e.stopPropagation()}>
            <h2 className="cg-modal__title">Histórico</h2>
            <p className="cg-modal__desc">{hist.length > 0 ? `${hist.length} contrato${hist.length > 1 ? "s" : ""} gerado${hist.length > 1 ? "s" : ""}` : "Nenhum contrato gerado ainda."}</p>
            {hist.length > 0 && (
              <div className="cg-hist">
                {hist.map(r => (
                  <div className="cg-hist__item" key={r.id}>
                    <div>
                      <div className="cg-hist__name">{r.client}</div>
                      <div className="cg-hist__date">{r.date}</div>
                    </div>
                    <button className="cg-hist__btn" onClick={() => { setValues(r.vals); setPreview(sub(template, r.vals)); setShowHist(false); notify("Dados restaurados"); }}>Restaurar</button>
                  </div>
                ))}
              </div>
            )}
            <div className="cg-modal__act">
              <button className="cg-modal__cancel" onClick={() => setShowHist(false)}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── STYLES ─── */}
      <style>{`
        :root {
          --red: #D63031;
          --red-soft: #E74C3C;
          --red-bg: rgba(214,48,49,0.06);
          --red-border: rgba(214,48,49,0.25);
          --green: #27AE60;
          --green-bg: rgba(39,174,96,0.06);
          --green-border: rgba(39,174,96,0.3);
          --white: #ffffff;
          --bdr: #d0d0d0;
          --bdr2: #c0c0c0;
          --txt: #1a1a1a;
          --txt2: #555;
          --txt3: #888;
          --ff: 'DM Sans', Arial, Helvetica, sans-serif;
          --ff-mono: 'JetBrains Mono', monospace;
        }
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

        .cg {
          font-family: var(--ff);
          background: linear-gradient(168deg, #f8f8f8 0%, #e8e8e8 35%, #dcdcdc 70%, #d0d0d0 100%);
          color: var(--txt);
          height: 100vh; display: flex; flex-direction: column; overflow: hidden;
          opacity: 0; transform: translateY(5px);
          transition: opacity 0.45s ease, transform 0.45s ease;
        }
        .cg--in { opacity: 1; transform: none; }

        .cg-toast {
          position: fixed; top: 16px; right: 16px; z-index: 9999;
          display: flex; align-items: center; gap: 10px;
          padding: 10px 18px 10px 13px; border-radius: 10px;
          font-family: var(--ff); font-size: 12.5px; font-weight: 600;
          background: var(--white); color: var(--green);
          border: 1px solid var(--green-border);
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          animation: tin 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .cg-toast--err { color: var(--red); border-color: var(--red-border); }
        @keyframes tin { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:none} }
        .cg-toast__dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; background: var(--green); box-shadow: 0 0 6px rgba(39,174,96,0.5); }
        .cg-toast--err .cg-toast__dot { background: var(--red); box-shadow: 0 0 6px rgba(214,48,49,0.5); }

        .cg-hdr {
          flex-shrink: 0; height: 60px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 24px;
          background: var(--white); border-bottom: 1px solid var(--bdr);
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          position: relative; z-index: 10;
        }
        .cg-hdr__brand { display: flex; align-items: center; gap: 12px; }
        .cg-logo {
          width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
          background: var(--red);
          display: flex; align-items: center; justify-content: center;
          color: var(--white);
          box-shadow: 0 3px 12px rgba(214,48,49,0.25);
        }
        .cg-logo__name { font-size: 20px; font-weight: 700; color: var(--txt); line-height: 1; letter-spacing: -0.3px; }
        .cg-logo__sub { font-size: 9px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--txt3); margin-top: 1px; }

        .cg-meter { display: flex; flex-direction: column; align-items: center; gap: 1px; }
        .cg-meter__lbl { font-size: 9px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--txt3); }

        .cg-hdr__nav { display: flex; gap: 8px; }
        .cg-hbtn {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px;
          background: var(--white); border: 1px solid var(--bdr); border-radius: 8px;
          color: var(--txt2); font-family: var(--ff); font-size: 12px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .cg-hbtn:hover { border-color: var(--red); color: var(--red); background: var(--red-bg); }
        .cg-badge { background: var(--red); color: var(--white); font-size: 9px; font-weight: 800; padding: 1px 6px; border-radius: 10px; margin-left: 2px; }

        .cg-body { flex: 1; display: flex; overflow: hidden; position: relative; z-index: 1; }

        .cg-left {
          width: 380px; min-width: 300px; max-width: 420px; flex-shrink: 0;
          display: flex; flex-direction: column;
          background: var(--white);
          border-right: 1px solid var(--bdr);
          box-shadow: 2px 0 8px rgba(0,0,0,0.03);
        }
        .cg-left__top { flex-shrink: 0; padding: 14px 22px 10px; }
        .cg-eyebrow { display: flex; align-items: center; gap: 10px; }
        .cg-eyebrow__line { flex: 1; height: 1px; background: var(--bdr); }
        .cg-eyebrow__txt { font-size: 9.5px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: var(--txt3); white-space: nowrap; }

        .cg-scroll { flex: 1; overflow-y: auto; }
        .cg-scroll::-webkit-scrollbar { width: 4px; }
        .cg-scroll::-webkit-scrollbar-track { background: transparent; }
        .cg-scroll::-webkit-scrollbar-thumb { background: #ccc; border-radius: 2px; }

        .cg-sec { border-bottom: 1px solid #eee; }
        .cg-sec__hdr {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          padding: 10px 22px; background: none; border: none; cursor: pointer;
          transition: background 0.15s;
        }
        .cg-sec__hdr:hover { background: #fafafa; }
        .cg-sec__left { display: flex; align-items: center; gap: 10px; }
        .cg-sec__right { display: flex; align-items: center; gap: 9px; color: var(--txt3); }
        .cg-sec__name { font-size: 10.5px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase; color: var(--txt2); }
        .cg-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; background: var(--bdr); border: 2px solid #bbb; transition: all 0.3s; }
        .cg-dot--done { background: var(--green); border-color: var(--green); box-shadow: 0 0 6px rgba(39,174,96,0.4); }
        .cg-pill { font-size: 10px; font-weight: 700; padding: 2px 9px; border-radius: 20px; background: #f0f0f0; color: var(--txt3); border: 1px solid #ddd; transition: all 0.3s; }
        .cg-pill--done { background: var(--green-bg); color: var(--green); border-color: var(--green-border); }

        .cg-sec__body { padding: 4px 22px 18px; display: flex; flex-direction: column; gap: 14px; }

        .cg-field { display: flex; flex-direction: column; gap: 5px; }
        .cg-lbl { display: flex; align-items: baseline; gap: 7px; flex-wrap: wrap; }
        .cg-tag {
          font-family: var(--ff-mono); font-size: 8.5px; font-weight: 500;
          color: var(--red); letter-spacing: 0.2px;
          background: var(--red-bg); border: 1px solid var(--red-border);
          padding: 1px 6px; border-radius: 3px; white-space: nowrap;
          transition: all 0.3s;
        }
        .cg-tag--ok { color: var(--green); background: var(--green-bg); border-color: var(--green-border); }
        .cg-lbl__name { font-size: 12px; font-weight: 600; color: var(--txt); }
        .cg-chk { margin-left: auto; color: var(--green); display: flex; align-items: center; }

        .cg-input {
          width: 100%; padding: 10px 13px;
          background: #fafafa; border: 1.5px solid #ddd; border-radius: 8px;
          color: var(--txt); font-family: var(--ff); font-size: 13px;
          outline: none; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          -webkit-appearance: none; appearance: none;
        }
        .cg-input::placeholder { color: #b0b0b0; }
        .cg-input:focus { border-color: var(--red); background: var(--white); box-shadow: 0 0 0 3px rgba(214,48,49,0.08); }
        .cg-input.is-ok { border-color: var(--green-border); background: var(--green-bg); }
        .cg-input.is-ok:focus { border-color: var(--green); box-shadow: 0 0 0 3px rgba(39,174,96,0.1); }
        .cg-input.is-err { border-color: var(--red); box-shadow: 0 0 0 3px rgba(214,48,49,0.08); background: rgba(214,48,49,0.03); }
        .cg-input--ta { min-height: 72px; resize: vertical; line-height: 1.55; }
        .cg-err { font-size: 10.5px; color: var(--red); font-weight: 500; }

        .cg-left__foot {
          flex-shrink: 0; padding: 12px 22px;
          border-top: 1px solid #eee;
          display: flex; justify-content: flex-end;
          background: var(--white);
        }
        .cg-btn-upd {
          display: flex; align-items: center; gap: 7px;
          padding: 9px 18px;
          background: var(--white); border: 1.5px solid var(--bdr); border-radius: 8px;
          color: var(--txt2); font-family: var(--ff); font-size: 12px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .cg-btn-upd:hover { border-color: var(--red); color: var(--red); }

        .cg-right { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .cg-right__bar {
          flex-shrink: 0; height: 48px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 28px;
          background: rgba(255,255,255,0.7); backdrop-filter: blur(8px);
          border-bottom: 1px solid var(--bdr);
        }
        .cg-btn-gen {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 22px;
          background: var(--white); border: 1.5px solid var(--bdr2); border-radius: 8px;
          color: var(--txt2); font-family: var(--ff); font-size: 12px; font-weight: 700;
          letter-spacing: 0.6px; text-transform: uppercase;
          cursor: pointer; transition: all 0.25s;
        }
        .cg-btn-gen.is-ready { background: var(--red); border-color: var(--red); color: var(--white); box-shadow: 0 4px 16px rgba(214,48,49,0.3); }
        .cg-btn-gen.is-ready:hover { background: #c0392b; box-shadow: 0 6px 24px rgba(214,48,49,0.35); }

        .cg-preview { flex: 1; overflow-y: auto; padding: 32px 28px; }
        .cg-preview::-webkit-scrollbar { width: 5px; }
        .cg-preview::-webkit-scrollbar-track { background: transparent; }
        .cg-preview::-webkit-scrollbar-thumb { background: #c5c5c5; border-radius: 3px; }

        .cg-paper {
          width: 100%; max-width: 700px;
          margin: 0 auto;
          background: var(--white); border-radius: 4px; border: 1px solid #d8d8d8;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 6px 20px rgba(0,0,0,0.08), 0 20px 50px rgba(0,0,0,0.06);
          min-height: 780px; height: max-content;
        }
        .cg-paper__body { padding: 52px 56px 48px; }

        /* Document typography — clean Arial */
        .cg-d-title { font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: bold; color: #111; text-align: center; line-height: 1.4; margin-bottom: 2px; }
        .cg-d-subtitle { font-family: Arial, Helvetica, sans-serif; font-size: 13px; font-weight: bold; color: #333; text-align: center; margin-bottom: 24px; }
        .cg-d-section { font-family: Arial, Helvetica, sans-serif; font-size: 12px; font-weight: bold; color: #111; margin-top: 22px; margin-bottom: 8px; line-height: 1.6; }
        .cg-d-sub { font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #222; line-height: 1.75; margin-bottom: 4px; text-align: justify; }
        .cg-d-para { font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 1.75; color: #222; margin-bottom: 4px; text-align: justify; }
        .cg-d-bullet { font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 1.75; color: #222; margin-bottom: 2px; padding-left: 20px; }
        .cg-d-label { font-family: Arial, Helvetica, sans-serif; font-size: 12px; font-weight: bold; color: #111; margin-top: 14px; margin-bottom: 4px; }

        .cg-var {
          background: rgba(214,48,49,0.08); color: var(--red);
          border: 1px dashed rgba(214,48,49,0.35); border-radius: 3px; padding: 0 3px;
          font-family: var(--ff-mono); font-size: 0.82em; font-style: normal;
        }

        .cg-ov {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0,0,0,0.35); backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          animation: ovIn 0.2s ease;
        }
        @keyframes ovIn { from{opacity:0} to{opacity:1} }
        .cg-modal {
          width: 90%; max-width: 560px;
          background: var(--white); border: 1px solid var(--bdr); border-radius: 14px; padding: 28px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.15);
          animation: modIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes modIn { from{opacity:0;transform:scale(0.94) translateY(12px)} to{opacity:1;transform:none} }
        .cg-modal__title { font-size: 20px; font-weight: 700; color: var(--txt); margin-bottom: 6px; }
        .cg-modal__desc { font-size: 13px; color: var(--txt3); margin-bottom: 18px; line-height: 1.6; }
        .cg-modal__desc code { font-family: var(--ff-mono); font-size: 11px; background: var(--red-bg); color: var(--red); padding: 1px 6px; border-radius: 3px; border: 1px solid var(--red-border); }
        .cg-modal__ta {
          width: 100%; min-height: 200px; resize: vertical;
          padding: 14px; margin-bottom: 18px;
          background: #fafafa; border: 1.5px solid #ddd; border-radius: 10px;
          color: var(--txt); font-family: var(--ff-mono); font-size: 12px; line-height: 1.65;
          outline: none; transition: border-color 0.2s;
        }
        .cg-modal__ta:focus { border-color: var(--red); }
        .cg-modal__act { display: flex; justify-content: flex-end; gap: 10px; }
        .cg-modal__cancel {
          padding: 9px 18px; background: none; border: 1.5px solid #ddd; border-radius: 8px;
          color: var(--txt3); font-family: var(--ff); font-size: 12px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .cg-modal__cancel:hover { border-color: #bbb; color: var(--txt2); }
        .cg-modal__ok {
          padding: 9px 22px; background: var(--red); border: none; border-radius: 8px;
          color: var(--white); font-family: var(--ff); font-size: 12px; font-weight: 700;
          cursor: pointer; transition: all 0.2s; box-shadow: 0 3px 12px rgba(214,48,49,0.25);
        }
        .cg-modal__ok:hover { background: #c0392b; box-shadow: 0 5px 18px rgba(214,48,49,0.3); }

        .cg-hist { max-height: 260px; overflow-y: auto; margin-bottom: 18px; }
        .cg-hist__item { display: flex; align-items: center; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid #eee; }
        .cg-hist__name { font-size: 14px; font-weight: 600; color: var(--txt); }
        .cg-hist__date { font-size: 10.5px; color: var(--txt3); }
        .cg-hist__btn {
          padding: 6px 14px; background: var(--white); border: 1.5px solid var(--bdr); border-radius: 6px;
          color: var(--txt2); font-family: var(--ff); font-size: 11px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .cg-hist__btn:hover { border-color: var(--red); color: var(--red); }
      `}</style>
    </div>
  );
}

