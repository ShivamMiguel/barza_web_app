import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Serviço | Barza',
  description: 'Termos e condições de utilização da plataforma Barza.',
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

export default function TermsPage() {
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
            Termos de<br />Serviço
          </h1>
          <p className="text-sm text-on-surface-variant/50">
            Última actualização: {UPDATED}
          </p>
        </div>

        {/* Intro */}
        <p className="text-sm text-on-surface-variant/80 leading-relaxed">
          Bem-vindo à <strong className="text-on-surface">Barza</strong>. Ao acederes ou utilizares a nossa plataforma, concordas com estes Termos de Serviço. Lê-os com atenção antes de criares uma conta ou utilizares qualquer funcionalidade. Se não concordares, não deves utilizar a Barza.
        </p>

        <Section title="1. Descrição da Plataforma">
          <p>
            A Barza é uma plataforma digital de comunidade dedicada a profissionais e entusiastas da beleza em Angola. Permite a criação de perfis pessoais e espaços profissionais, publicação de serviços, interacção entre membros da comunidade e descoberta de profissionais de beleza.
          </p>
          <p>
            A Barza não presta directamente serviços de beleza — actua exclusivamente como plataforma de conexão entre profissionais e clientes.
          </p>
        </Section>

        <Section title="2. Elegibilidade e Contas">
          <p>Para utilizares a Barza, deves:</p>
          <ul className="space-y-1.5 mt-2">
            <Li>Ter pelo menos <strong className="text-on-surface">16 anos</strong> de idade.</Li>
            <Li>Fornecer informações verdadeiras, exactas e actualizadas no registo.</Li>
            <Li>Manter a confidencialidade da tua senha e ser responsável por todas as actividades realizadas na tua conta.</Li>
            <Li>Notificar-nos imediatamente em caso de acesso não autorizado à tua conta.</Li>
          </ul>
          <p className="mt-2">
            Reservamo-nos o direito de suspender ou encerrar contas que violem estes Termos ou que forneçam informações falsas.
          </p>
        </Section>

        <Section title="3. Espaços Profissionais">
          <p>Os utilizadores que criem um espaço profissional na Barza comprometem-se a:</p>
          <ul className="space-y-1.5 mt-2">
            <Li>Fornecer informações verdadeiras sobre o seu negócio, incluindo nome, localização, horário e serviços.</Li>
            <Li>Manter os preços e a disponibilidade actualizados para evitar expectativas incorrectas junto dos clientes.</Li>
            <Li>Publicar apenas imagens de serviços reais que representem o seu trabalho.</Li>
            <Li>Cumprir toda a legislação angolana aplicável à prestação de serviços de beleza e bem-estar.</Li>
            <Li>Não utilizar o espaço profissional para promover actividades ilegais ou enganosas.</Li>
          </ul>
          <p className="mt-2">
            A Barza pode remover ou suspender espaços profissionais que violem estas obrigações ou que recebam reclamações fundamentadas.
          </p>
        </Section>

        <Section title="4. Conteúdo do Utilizador">
          <p>
            Ao publicares conteúdo na Barza (posts, imagens, comentários, informações de serviços), manténs a propriedade intelectual desse conteúdo e concedes à Barza uma licença mundial, não exclusiva, gratuita e transferível para armazenar, exibir, reproduzir e distribuir esse conteúdo no âmbito da operação da plataforma.
          </p>
          <p>Ao publicares conteúdo, declaras que:</p>
          <ul className="space-y-1.5 mt-2">
            <Li>Tens os direitos necessários para publicar esse conteúdo.</Li>
            <Li>O conteúdo não viola direitos de terceiros, incluindo direitos de autor, privacidade ou marca.</Li>
            <Li>O conteúdo é verdadeiro e não é enganoso ou fraudulento.</Li>
          </ul>
        </Section>

        <Section title="5. Conduta Proibida">
          <p>É expressamente proibido na Barza:</p>
          <ul className="space-y-1.5 mt-2">
            <Li>Publicar conteúdo ofensivo, discriminatório, obsceno ou que incite à violência.</Li>
            <Li>Assediar, intimidar ou ameaçar outros utilizadores.</Li>
            <Li>Criar contas falsas ou fazer-se passar por outra pessoa ou entidade.</Li>
            <Li>Publicar spam, conteúdo publicitário não autorizado ou links maliciosos.</Li>
            <Li>Tentar aceder, interferir ou comprometer a segurança da plataforma ou de contas de terceiros.</Li>
            <Li>Utilizar a plataforma para actividades ilegais ao abrigo da legislação angolana.</Li>
            <Li>Recolher dados de outros utilizadores sem consentimento.</Li>
            <Li>Manipular avaliações ou interacções de forma artificial.</Li>
          </ul>
        </Section>

        <Section title="6. Avaliações e Interacções">
          <p>
            A Barza pode disponibilizar funcionalidades de avaliação e comentário de espaços profissionais. As avaliações devem ser honestas, baseadas em experiências reais e respeitar a conduta prevista nestes Termos. Reservamo-nos o direito de remover avaliações falsas, abusivas ou que violem estas regras.
          </p>
        </Section>

        <Section title="7. Propriedade Intelectual da Barza">
          <p>
            A marca, o logótipo, o design, o código e os demais elementos da plataforma Barza são propriedade exclusiva da Barza e estão protegidos pela legislação angolana de propriedade intelectual. É proibida a reprodução, cópia ou utilização sem autorização expressa e por escrito.
          </p>
        </Section>

        <Section title="8. Limitação de Responsabilidade">
          <p>
            A Barza actua como intermediária e não se responsabiliza por:
          </p>
          <ul className="space-y-1.5 mt-2">
            <Li>A qualidade, segurança ou legalidade dos serviços prestados pelos profissionais listados na plataforma.</Li>
            <Li>Discrepâncias entre os serviços descritos na plataforma e os efectivamente prestados.</Li>
            <Li>Danos directos ou indirectos decorrentes do uso ou impossibilidade de uso da plataforma.</Li>
            <Li>Conteúdo publicado por terceiros utilizadores.</Li>
            <Li>Interrupções de serviço causadas por manutenção, falhas técnicas ou factores fora do nosso controlo.</Li>
          </ul>
          <p className="mt-2">
            A plataforma é fornecida &ldquo;tal como está&rdquo;, sem garantias expressas ou implícitas de disponibilidade contínua ou ausência de erros.
          </p>
        </Section>

        <Section title="9. Suspensão e Encerramento">
          <p>
            Podemos suspender ou encerrar o teu acesso à Barza, com ou sem aviso prévio, se:
          </p>
          <ul className="space-y-1.5 mt-2">
            <Li>Violares estes Termos de Serviço.</Li>
            <Li>O teu comportamento prejudicar outros utilizadores ou a integridade da plataforma.</Li>
            <Li>Formos obrigados a fazê-lo por lei ou decisão judicial.</Li>
          </ul>
          <p className="mt-2">
            Podes encerrar a tua conta a qualquer momento nas definições do perfil. Após encerramento, os teus dados serão tratados de acordo com a nossa <Link href="/privacy" className="text-primary-container hover:underline">Política de Privacidade</Link>.
          </p>
        </Section>

        <Section title="10. Alterações aos Termos">
          <p>
            Podemos actualizar estes Termos de Serviço periodicamente. Notificamos os utilizadores sobre alterações materiais por e-mail ou através de aviso na plataforma. O uso continuado da Barza após a entrada em vigor das alterações constitui aceitação dos novos Termos.
          </p>
        </Section>

        <Section title="11. Lei Aplicável e Jurisdição">
          <p>
            Estes Termos são regidos pela legislação da <strong className="text-on-surface">República de Angola</strong>. Qualquer litígio decorrente da utilização da plataforma será submetido à jurisdição dos tribunais competentes de Luanda, Angola.
          </p>
        </Section>

        <Section title="12. Contacto">
          <p>
            Para questões sobre estes Termos de Serviço:
          </p>
          <div className="mt-3 p-4 rounded-2xl bg-surface-container border border-[rgba(86,67,58,0.12)] space-y-1">
            <p className="text-on-surface font-bold text-sm">Barza — Equipa Jurídica</p>
            <p>E-mail: <a href="mailto:legal@barza.app" className="text-primary-container hover:underline">legal@barza.app</a></p>
            <p>Luanda, República de Angola</p>
          </div>
        </Section>

        {/* Footer nav */}
        <div className="border-t border-[rgba(86,67,58,0.12)] pt-8 flex flex-wrap gap-4 text-xs text-on-surface-variant/40">
          <Link href="/privacy" className="hover:text-primary-container transition-colors">Política de Privacidade</Link>
          <span>·</span>
          <Link href="/community" className="hover:text-primary-container transition-colors">Comunidade</Link>
          <span>·</span>
          <span>© {new Date().getFullYear()} Barza</span>
        </div>

      </div>
    </div>
  )
}
