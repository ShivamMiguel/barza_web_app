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

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 rounded-2xl bg-primary-container/5 border border-primary-container/20 text-sm text-on-surface-variant/80 leading-relaxed">
      {children}
    </div>
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

        <Section title="1. O que é a Barza">
          <p>
            A Barza é uma <strong className="text-on-surface">plataforma de visibilidade profissional e inteligência de mercado</strong> dedicada à indústria da beleza em Angola. A Barza permite:
          </p>
          <ul className="space-y-1.5 mt-2">
            <Li>A criação de perfis pessoais e espaços profissionais para ganhar visibilidade na comunidade.</Li>
            <Li>A descoberta de profissionais da beleza por localização, especialidade e presença na plataforma.</Li>
            <Li>O acesso a sinais de tendências e inteligência de mercado da indústria da beleza.</Li>
            <Li>A publicação e partilha de conteúdo dentro de uma comunidade de profissionais e entusiastas.</Li>
          </ul>
          <Notice>
            <strong className="text-on-surface">A Barza não é um marketplace.</strong> A Barza não vende produtos, não intermedeia transacções financeiras, não processa pagamentos e não cobra comissões sobre serviços. Toda a actividade comercial entre clientes e profissionais acontece exclusivamente fora da plataforma, de forma directa e autónoma entre as partes.
          </Notice>
        </Section>

        <Section title="2. Conexão entre Clientes e Profissionais">
          <p>
            A Barza disponibiliza ferramentas que permitem a clientes entrar em contacto com profissionais da beleza. É importante compreender o seguinte:
          </p>
          <ul className="space-y-1.5 mt-2">
            <Li>Qualquer contacto ou pedido de agendamento iniciado através da Barza é uma <strong className="text-on-surface">ferramenta de conexão</strong>, não uma reserva confirmada nem um contrato de prestação de serviço.</Li>
            <Li>A Barza <strong className="text-on-surface">não participa, não gere, não controla e não valida</strong> qualquer serviço prestado entre clientes e profissionais.</Li>
            <Li>A decisão de agendar, executar ou recusar qualquer serviço é inteiramente da responsabilidade do cliente e do profissional.</Li>
            <Li>O relacionamento, a execução do serviço e quaisquer acordos comerciais são estabelecidos directamente entre cliente e profissional, sem qualquer intervenção da Barza.</Li>
          </ul>
        </Section>

        <Section title="3. Pagamentos e Transacções Financeiras">
          <Notice>
            <strong className="text-on-surface">A Barza não processa pagamentos.</strong> A Barza não intermedeia nem facilita transacções financeiras de qualquer natureza. Todos os pagamentos por serviços de beleza são acordados e efectuados exclusivamente entre o cliente e o profissional, através dos meios que estes acordarem, fora da plataforma. A Barza não cobra qualquer comissão sobre serviços, não retém valores e não tem acesso a dados de pagamento dos seus utilizadores.
          </Notice>
        </Section>

        <Section title="4. Elegibilidade e Contas">
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

        <Section title="5. Espaços Profissionais">
          <p>Os utilizadores que criem um espaço profissional na Barza comprometem-se a:</p>
          <ul className="space-y-1.5 mt-2">
            <Li>Fornecer informações verdadeiras sobre o seu negócio, incluindo nome, localização, horário e serviços.</Li>
            <Li>Manter a sua presença e informações actualizadas para uma descoberta precisa por parte de potenciais clientes.</Li>
            <Li>Publicar apenas imagens reais que representem o seu trabalho e identidade profissional.</Li>
            <Li>Cumprir toda a legislação angolana aplicável à prestação de serviços de beleza e bem-estar.</Li>
            <Li>Não utilizar o espaço profissional para promover actividades ilegais ou enganosas.</Li>
          </ul>
          <p className="mt-2">
            A Barza pode remover ou suspender espaços profissionais que violem estas obrigações ou que recebam reclamações fundamentadas.
          </p>
        </Section>

        <Section title="6. Conteúdo do Utilizador">
          <p>
            Ao publicares conteúdo na Barza (posts, imagens, informações de perfil ou de espaço profissional), manténs a propriedade intelectual desse conteúdo e concedes à Barza uma licença mundial, não exclusiva, gratuita e transferível para armazenar, exibir, reproduzir e distribuir esse conteúdo no âmbito da operação da plataforma.
          </p>
          <p>Ao publicares conteúdo, declaras que:</p>
          <ul className="space-y-1.5 mt-2">
            <Li>Tens os direitos necessários para publicar esse conteúdo.</Li>
            <Li>O conteúdo não viola direitos de terceiros, incluindo direitos de autor, privacidade ou marca.</Li>
            <Li>O conteúdo é verdadeiro e não é enganoso ou fraudulento.</Li>
          </ul>
        </Section>

        <Section title="7. Conduta Proibida">
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

        <Section title="8. Propriedade Intelectual da Barza">
          <p>
            A marca, o logótipo, o design, o código e os demais elementos da plataforma Barza são propriedade exclusiva da Barza e estão protegidos pela legislação angolana de propriedade intelectual. É proibida a reprodução, cópia ou utilização sem autorização expressa e por escrito.
          </p>
        </Section>

        <Section title="9. Limitação de Responsabilidade">
          <p>
            A Barza actua exclusivamente como plataforma de visibilidade e descoberta e não se responsabiliza por:
          </p>
          <ul className="space-y-1.5 mt-2">
            <Li>A qualidade, segurança ou legalidade dos serviços prestados pelos profissionais listados na plataforma.</Li>
            <Li>Acordos, pagamentos ou conflitos estabelecidos directamente entre clientes e profissionais fora da plataforma.</Li>
            <Li>Danos directos ou indirectos decorrentes do uso ou impossibilidade de uso da plataforma.</Li>
            <Li>Conteúdo publicado por terceiros utilizadores.</Li>
            <Li>Interrupções de serviço causadas por manutenção, falhas técnicas ou factores fora do nosso controlo.</Li>
          </ul>
          <p className="mt-2">
            A plataforma é fornecida &ldquo;tal como está&rdquo;, sem garantias expressas ou implícitas de disponibilidade contínua ou ausência de erros.
          </p>
        </Section>

        <Section title="10. Suspensão e Encerramento">
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

        <Section title="11. Alterações aos Termos">
          <p>
            Podemos actualizar estes Termos de Serviço periodicamente. Notificamos os utilizadores sobre alterações materiais por e-mail ou através de aviso na plataforma. O uso continuado da Barza após a entrada em vigor das alterações constitui aceitação dos novos Termos.
          </p>
        </Section>

        <Section title="12. Lei Aplicável e Jurisdição">
          <p>
            Estes Termos são regidos pela legislação da <strong className="text-on-surface">República de Angola</strong>. Qualquer litígio decorrente da utilização da plataforma será submetido à jurisdição dos tribunais competentes de Luanda, Angola.
          </p>
        </Section>

        <Section title="13. Contacto">
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
