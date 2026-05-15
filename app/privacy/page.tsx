import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade | Barza',
  description: 'Como a Barza recolhe, utiliza e protege os teus dados pessoais.',
}

const UPDATED = '15 de Maio de 2026'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-display font-extrabold text-primary-container uppercase tracking-widest">
        {title}
      </h2>
      <div className="space-y-3 text-sm text-on-surface-variant/80 leading-relaxed">
        {children}
      </div>
    </section>
  )
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="text-primary-container/50 flex-shrink-0 mt-0.5">·</span>
      <span>{children}</span>
    </li>
  )
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen px-6 py-16 pb-24 lg:py-20">
      <div className="max-w-2xl mx-auto space-y-12">

        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-on-surface-variant/50 hover:text-on-surface transition-colors text-xs font-label uppercase tracking-widest"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Início
        </Link>

        {/* Header */}
        <div className="space-y-3 border-b border-[rgba(86,67,58,0.15)] pb-10">
          <p className="text-[10px] font-label uppercase tracking-[0.25em] text-primary-container/70">
            Documento Legal
          </p>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-on-surface leading-tight">
            Política de<br />Privacidade
          </h1>
          <p className="text-sm text-on-surface-variant/50">
            Última actualização: {UPDATED}
          </p>
        </div>

        {/* Intro */}
        <p className="text-sm text-on-surface-variant/80 leading-relaxed">
          A <strong className="text-on-surface">Barza</strong> (&ldquo;nós&rdquo;, &ldquo;nosso&rdquo;) é uma plataforma digital de comunidade para profissionais e entusiastas da beleza, operada em Angola. Esta Política de Privacidade explica que dados recolhemos, como os utilizamos e que direitos tens sobre eles. Ao usares a Barza, aceitas as práticas descritas neste documento.
        </p>

        <Section title="1. Dados que Recolhemos">
          <p>Recolhemos informações que nos forneces directamente e informações geradas pelo uso da plataforma:</p>
          <ul className="space-y-1.5 mt-2">
            <Li><strong className="text-on-surface">Conta:</strong> nome completo, endereço de e-mail, fotografia de perfil, profissão e biografia.</Li>
            <Li><strong className="text-on-surface">Espaço profissional:</strong> nome do espaço, logótipo, localização (cidade, morada, coordenadas GPS), telefone, horário de funcionamento e categorias de serviços.</Li>
            <Li><strong className="text-on-surface">Conteúdo publicado:</strong> posts, imagens de serviços e comentários que publicares na plataforma.</Li>
            <Li><strong className="text-on-surface">Dados de uso:</strong> páginas visitadas, pesquisas realizadas, interações com conteúdo (gostos, partilhas) e dados de sessão.</Li>
            <Li><strong className="text-on-surface">Dados de dispositivo:</strong> endereço IP, tipo de browser, sistema operativo e identificadores de dispositivo.</Li>
            <Li><strong className="text-on-surface">Localização:</strong> somente quando autorizas explicitamente, para funcionalidades de detecção de localização.</Li>
          </ul>
        </Section>

        <Section title="2. Como Utilizamos os Teus Dados">
          <ul className="space-y-1.5">
            <Li>Criar e gerir a tua conta e perfil na Barza.</Li>
            <Li>Exibir o teu espaço profissional e serviços a outros utilizadores.</Li>
            <Li>Personalizar o feed e as sugestões de conteúdo.</Li>
            <Li>Permitir funcionalidades de comunidade: publicações, seguidores e interações.</Li>
            <Li>Enviar notificações relacionadas com a tua actividade na plataforma.</Li>
            <Li>Melhorar e desenvolver novos recursos da plataforma através de análise de uso.</Li>
            <Li>Garantir a segurança da plataforma e prevenir fraudes ou abusos.</Li>
            <Li>Cumprir obrigações legais aplicáveis em Angola.</Li>
          </ul>
        </Section>

        <Section title="3. Partilha de Dados">
          <p>Não vendemos os teus dados pessoais. Partilhamos informações apenas nas seguintes situações:</p>
          <ul className="space-y-1.5 mt-2">
            <Li><strong className="text-on-surface">Outros utilizadores:</strong> o teu perfil público, posts e espaço profissional são visíveis a outros membros da comunidade Barza.</Li>
            <Li><strong className="text-on-surface">Prestadores de serviços:</strong> partilhamos dados com fornecedores de infraestrutura (alojamento, armazenamento de ficheiros, envio de e-mail) que nos ajudam a operar a plataforma, sob contratos de confidencialidade.</Li>
            <Li><strong className="text-on-surface">Obrigações legais:</strong> podemos divulgar dados quando exigido por lei, decisão judicial ou autoridade competente angolana.</Li>
            <Li><strong className="text-on-surface">Transferências de negócio:</strong> em caso de fusão, aquisição ou venda de activos, os teus dados poderão ser transferidos, com notificação prévia.</Li>
          </ul>
        </Section>

        <Section title="4. Armazenamento e Segurança">
          <p>
            Os teus dados são armazenados em servidores seguros. Utilizamos encriptação TLS para transmissão de dados, controlo de acesso baseado em funções e monitorização contínua de segurança. Embora tomemos todas as medidas razoáveis, nenhum sistema é completamente imune a riscos.
          </p>
          <p>
            Conservamos os teus dados enquanto a tua conta estiver activa. Após eliminação de conta, apagamos os dados pessoais em até <strong className="text-on-surface">30 dias</strong>, salvo obrigação legal de retenção mais prolongada.
          </p>
        </Section>

        <Section title="5. Os Teus Direitos">
          <p>Tens os seguintes direitos relativamente aos teus dados pessoais:</p>
          <ul className="space-y-1.5 mt-2">
            <Li><strong className="text-on-surface">Acesso:</strong> solicitar uma cópia dos dados que guardamos sobre ti.</Li>
            <Li><strong className="text-on-surface">Rectificação:</strong> corrigir dados incorrectos ou incompletos directamente nas definições do perfil ou por pedido.</Li>
            <Li><strong className="text-on-surface">Eliminação:</strong> solicitar a eliminação da tua conta e dados associados.</Li>
            <Li><strong className="text-on-surface">Portabilidade:</strong> receber os teus dados num formato estruturado e legível por máquina.</Li>
            <Li><strong className="text-on-surface">Oposição:</strong> opor-te ao tratamento de dados para fins de marketing ou análise.</Li>
          </ul>
          <p className="mt-3">Para exercer estes direitos, contacta-nos em <strong className="text-on-surface">privacidade@barza.app</strong>.</p>
        </Section>

        <Section title="6. Cookies e Tecnologias Semelhantes">
          <p>
            Utilizamos cookies essenciais para autenticação e funcionamento da plataforma, e cookies analíticos para compreender como a plataforma é utilizada. Podes gerir as preferências de cookies nas definições do teu browser. A desactivação de cookies essenciais pode afectar o funcionamento da plataforma.
          </p>
        </Section>

        <Section title="7. Privacidade de Menores">
          <p>
            A Barza não se destina a menores de <strong className="text-on-surface">16 anos</strong>. Não recolhemos intencionalmente dados de menores. Se tomares conhecimento de que um menor nos forneceu dados sem consentimento parental, contacta-nos para que possamos eliminar essas informações.
          </p>
        </Section>

        <Section title="8. Alterações a Esta Política">
          <p>
            Podemos actualizar esta Política de Privacidade periodicamente. Notificamos os utilizadores sobre alterações materiais por e-mail ou através de aviso na plataforma. O uso continuado da Barza após as alterações constitui aceitação da nova política.
          </p>
        </Section>

        <Section title="9. Contacto">
          <p>
            Para questões sobre privacidade ou para exercer os teus direitos:
          </p>
          <div className="mt-3 p-4 rounded-2xl bg-surface-container border border-[rgba(86,67,58,0.12)] space-y-1">
            <p className="text-on-surface font-bold text-sm">Barza — Equipa de Privacidade</p>
            <p>E-mail: <a href="mailto:privacidade@barza.app" className="text-primary-container hover:underline">privacidade@barza.app</a></p>
            <p>Luanda, República de Angola</p>
          </div>
        </Section>

        {/* Footer nav */}
        <div className="border-t border-[rgba(86,67,58,0.12)] pt-8 flex flex-wrap gap-4 text-xs text-on-surface-variant/40">
          <Link href="/terms" className="hover:text-primary-container transition-colors">Termos de Serviço</Link>
          <span>·</span>
          <Link href="/community" className="hover:text-primary-container transition-colors">Comunidade</Link>
          <span>·</span>
          <span>© {new Date().getFullYear()} Barza</span>
        </div>

      </div>
    </div>
  )
}
