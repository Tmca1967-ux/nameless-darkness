# SU Connect · Serviço de Urgência

**SU Connect** é a interface web de **consulta rápida** de procedimentos clínicos
do Serviço de Urgência (enfermagem).

> **Logótipo:** a app usa `logo.png` (na raiz da pasta). Guarde aí a imagem do
> logótipo com esse nome exato. Enquanto não existir, a app mostra um ícone
> provisório. Para o ícone de atalho/Home do telemóvel ficar perfeito, use uma
> imagem PNG quadrada (recomendado 512×512 ou superior). Cada procedimento é uma **referência** (metadados + link
para o PDF oficial) — esta app **não é a fonte normativa**. Os documentos
aprovados residem no sistema institucional (ex.: DiOr).

## Como abrir

A app é um único ficheiro (`index.html`), sem dependências e funciona offline.

### ✅ Maneira mais simples (recomendado) — duplo-clique no atalho

Dê **duplo-clique** em **`Abrir Procedimentos.command`**.

Abre uma janela de Terminal, arranca um pequeno servidor local e abre a app no
browser automaticamente. **Para parar**, feche essa janela (ou Ctrl+C).

> Este atalho serve a pasta por `http://localhost`, que é o **único modo em que
> os PDF abrem sempre de forma fiável**.

### Alternativa — servidor manual

```bash
cd "/Users/tecas/Desktop/Procedimentos"
python3 -m http.server 8000
```
Depois abrir <http://localhost:8000/>.

### ⚠️ Por que NÃO fazer duplo-clique no `index.html`

Abrir `index.html` diretamente usa o protocolo `file://`. Nesse modo, os browsers
(em especial o Chrome) **bloqueiam a abertura dos PDF locais** — o botão "Abrir
documento" abre uma aba com erro. A app deteta este modo e mostra um aviso.
Use sempre o atalho `.command` ou o servidor manual.

## Contas de demonstração

| Perfil | Email | Palavra-passe | Pode |
|---|---|---|---|
| Enfermeiro | `enfermeiro@su.pt` | `enfermeiro` | Pesquisar, filtrar, consultar, abrir documentos. Vê **apenas** procedimentos *Vigentes*. |
| Gestor | `gestor@su.pt` | `gestor` | Tudo acima + adicionar / editar / arquivar / apagar, ver **todos os estados** e alertas de revisão. |

> ⚠️ **Autenticação de demonstração** — validada no browser, sem segurança real.
> As credenciais estão no código. Não usar com dados sensíveis nem em produção
> sem um backend e autenticação adequados.

## Funcionalidades

**Todos os perfis**
- Lista de procedimentos em cartões.
- Pesquisa por texto livre (título, código, palavras-chave, área, responsáveis).
- Filtro por categoria.
- Página de detalhe com botão para abrir/descarregar o documento oficial.
- Design responsivo *mobile-first*, alto contraste, botões grandes.

**Visualização de cada procedimento (dois modos)**
- **Resumo / Operacionalização** — ficha rápida estruturada (Objetivo, Indicações,
  Material, Passos, Precauções) para consulta imediata à cabeceira.
- **Documento (PDF)** — abre a versão oficial completa. O PDF é a fonte que prevalece.

**Gestor**
- Filtro adicional por estado e vista de **todos** os estados.
- Adicionar / editar / arquivar (→ Obsoleto) / apagar.
- **Editar o resumo/operacionalização** de cada procedimento (campos por secção).
- **Gerir contas** (botão "Gerir contas"): criar contas, repor palavras-passe,
  e **conceder/retirar o perfil de Gestor** a outros utilizadores. Há sempre a
  salvaguarda de manter, no mínimo, um Gestor.
- **Alerta destacado** para procedimentos sem revisão há mais de 12 meses.
- **Registo automático** de quem atualizou (`atualizado_por`) e quando, em cada
  alteração.
- "Repor dados de exemplo" para restaurar os 18 procedimentos originais.

> **Resumos = rascunhos a validar.** Os resumos foram redigidos a partir dos PDFs
> e destinam-se a apoio rápido; **carecem de validação clínica** antes de uso e
> **não substituem** o documento oficial. Cada resumo exibe esse aviso na app.

> **Sincronização entre dispositivos:** ainda **não ativada** (decisão adiada).
> Por agora, as edições do gestor e as contas vivem no `localStorage` de cada
> browser. Quando ligarmos o servidor partilhado, passam a propagar-se a todos os
> dispositivos automaticamente.

Estados e cores: **Vigente** (verde), **Em Revisão** (âmbar), **Obsoleto** (cinza);
o vermelho fica reservado a alertas.

## Instalar no dispositivo (PWA) e usar offline

A app é uma **PWA**: instala-se no ecrã inicial (telemóvel/iPad) ou no ambiente
de trabalho, com o ícone do logótipo, e funciona **offline** (depois da 1ª
abertura com ligação). Requer ser servida por **HTTPS** (ver "Sincronização").

- **iPhone / iPad (Safari):** abrir o link → botão **Partilhar** → **Adicionar ao
  ecrã principal**.
- **Android / Chrome:** abrir o link → menu **⋮** → **Instalar app** (ou o botão
  **Instalar** dentro da app).
- **Computador (Chrome/Edge):** ícone **Instalar** na barra de endereço, ou o
  botão **Instalar** dentro da app → cria um atalho no ambiente de trabalho.

Ficheiros PWA: `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png`.
Ao publicar uma versão nova, incremente `CACHE` em `sw.js` (`su-connect-v1` →
`v2`…) para forçar a atualização nos dispositivos.

## Sincronização entre dispositivos (Supabase) — configuração

Ver **[supabase-schema.sql](supabase-schema.sql)** e os passos no fim deste
ficheiro. Em resumo: criar projeto Supabase (grátis) → correr o SQL → publicar a
app num host HTTPS grátis (ex.: Cloudflare Pages/Netlify) → colar as chaves na
app. As alterações do gestor passam a sincronizar em tempo real para todos.

## Partilhar (código QR)

A app tem um botão **"Partilhar"** (no topo, ao lado de "Sair") que mostra um
**código QR** do endereço atual, para abrir noutro dispositivo:

1. Abra a app com o atalho **`Abrir Procedimentos.command`** — ele arranca o
   servidor no endereço de **rede** (ex.: `http://192.168.1.69:8000/`) e abre logo
   o browser nesse endereço.
2. Toque em **Partilhar** e mostre o QR ao colega (ou use "Descarregar QR" para
   guardar/imprimir a imagem).
3. O colega aponta a câmara do telemóvel ao QR e abre a app.

**Requisitos para funcionar noutro dispositivo:**
- Estar na **mesma rede Wi-Fi** que este computador.
- Este computador tem de manter o **servidor a correr** (janela do atalho aberta).
- O QR gera-se a partir do endereço onde a app está aberta. Se abrir por
  `localhost`, o QR só serve nesse computador — por isso use o atalho, que abre
  pelo IP de rede. O IP pode mudar quando troca de rede; basta gerar o QR de novo.

> Para partilha permanente e acessível fora da rede local (sem manter o
> computador ligado) seria necessário alojar a app num servidor/serviço web.

## Dados

Os 18 procedimentos de exemplo foram importados de
`Base_Dados_Procedimentos.xlsx` e estão embebidos em `index.html`. São guardados
no `localStorage` do browser na primeira utilização; as edições do gestor
persistem nesse dispositivo.

**Limitação:** sendo uma app estática, os dados **não sincronizam entre
dispositivos** — cada browser tem a sua própria cópia. Para dados partilhados e
autenticação real seria necessário um backend.

**Correção de mapeamento (importante):** o ficheiro `Documento - 2025-12-05T122329.948.pdf`
continha afinal o conteúdo da **Via Verde AVC** (e não da queda). Foi corrigido:
- *Via Verde AVC* → `Documento - 2025-12-05T122329.948.pdf` (existe na pasta);
- *Prevenção e intervenção na queda do adulto* → `Prevenção e intervenção na queda no adulto.pdf`
  (já existia na pasta, mas não estava a ser usado).

Confirme que esta correção está correta para os seus documentos.

**PDF em falta:** apenas o *Plano de Catástrofe* (`PlanoCatastrofeHSMM.pdf`) não
está na pasta. Aparece na lista, mas o detalhe assinala "documento ainda não
carregado"; basta colocar o ficheiro com esse nome para o botão passar a funcionar.
